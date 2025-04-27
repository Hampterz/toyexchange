import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Use a default secret for development - in production you should use an environment variable 
  const sessionSecret = process.env.SESSION_SECRET || "toyshare-dev-secret-key-not-for-production";
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Don't return password in response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.status(200).json(userWithoutPassword);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Handle Google sign-in
  app.post("/api/google-auth", async (req, res, next) => {
    try {
      const { 
        email, 
        name, 
        id, 
        picture, 
        givenName, 
        familyName, 
        location, 
        latitude, 
        longitude 
      } = req.body;
      
      if (!email || !name || !id) {
        return res.status(400).json({ message: "Missing required Google account information" });
      }
      
      // First check if user with this Google ID already exists
      let user = await storage.getUserByGoogleId(id);
      
      // If no user found by Google ID, check by email
      if (!user) {
        user = await storage.getUserByEmail(email);
        
        // If a user with this email exists, update their Google ID
        if (user) {
          console.log(`Updating existing user ${user.email} with Google ID: ${id}`);
          
          // Update user with Google information
          const updatedUser = await storage.updateUser(user.id, { 
            googleId: id,
            // Update profile picture if available
            profilePicture: picture || user.profilePicture,
            // Update location if provided and user's current location is unknown
            ...(location && user.location === 'Unknown location' ? { location } : {}),
            ...(latitude ? { latitude } : {}),
            ...(longitude ? { longitude } : {})
          });
          
          if (updatedUser) {
            user = updatedUser;
            console.log(`Updated existing user: ${user.name} (${user.email})`);
          }
        } else {
          // If no user exists at all, create a new one
          
          // Generate a unique username based on name and random suffix to avoid conflicts
          // First try to use first name or email prefix
          let baseUsername = (givenName || name.split(' ')[0] || email.split('@')[0]).toLowerCase();
          
          // Replace spaces and special characters
          baseUsername = baseUsername.replace(/[^a-z0-9]/g, '');
          
          // Generate a timestamp suffix for uniqueness
          const timestamp = Date.now().toString().slice(-4);
          const username = `${baseUsername}${timestamp}`;
          
          // Generate a random password (user won't need to know it since they'll use Google to login)
          const randomPassword = randomBytes(16).toString('hex');
          
          console.log(`Creating new user for Google account: ${name} (${email})`);
          
          // Create the user with all available information
          user = await storage.createUser({
            username,
            email,
            name,  // Use full name with proper capitalization
            password: await hashPassword(randomPassword),
            googleId: id,
            location: location || 'Unknown location',
            profilePicture: picture || '',
            latitude,
            longitude
            // Note: arrays will be initialized with default values in the database
          });
          
          console.log(`Created new user: ${user.name} (${user.email}) with location: ${user.location}`);
        }
      } else {
        // User exists, check if we need to update their info
        const userNeedsUpdate = 
          (location && user.location === 'Unknown location') || 
          (picture && !user.profilePicture) ||
          (latitude && !user.latitude) ||
          (longitude && !user.longitude);
          
        if (userNeedsUpdate) {
          console.log(`Updating existing user ${user.email} with additional information`);
          
          const updatedUser = await storage.updateUser(user.id, {
            // Only update these fields if they're empty
            ...(location && user.location === 'Unknown location' ? { location } : {}),
            ...(picture && !user.profilePicture ? { profilePicture: picture } : {}),
            ...(latitude && !user.latitude ? { latitude } : {}),
            ...(longitude && !user.longitude ? { longitude } : {})
          });

          if (updatedUser) {
            user = updatedUser;
          }
        }
      }
      
      // Check if we have a valid user before attempting to log in
      if (!user) {
        return res.status(500).json({ message: "Failed to create or retrieve user account" });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error in Google auth:", error);
      next(error);
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
}
