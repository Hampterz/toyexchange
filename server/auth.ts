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
      const { email, name, id, picture } = req.body;
      
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
          user = await storage.updateUser(user.id, { 
            googleId: id,
            // Update profile picture if available
            profilePicture: picture || user.profilePicture
          });
        } else {
          // If no user exists at all, create a new one
          // Use email as username (without the @gmail.com part)
          const username = email.split('@')[0];
          
          // Generate a random password (user won't need to know it since they'll use Google to login)
          const randomPassword = randomBytes(16).toString('hex');
          
          console.log(`Creating new user for Google account: ${email}`);
          // Create the user
          user = await storage.createUser({
            username,
            email,
            name,
            password: await hashPassword(randomPassword),
            googleId: id,
            location: req.body.location || 'Unknown location',
            profilePicture: picture || '',
          });
        }
      }
      
      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    } catch (error) {
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
