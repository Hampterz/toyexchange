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
        // Check if the input is an email (contains @)
        const isEmail = username.includes('@');
        
        // Find user by username or email
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
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
    
    // For regular login, we don't redirect to profile customization
    // Only Google accounts with auto-generated usernames need customization
    res.status(200).json({
      ...userWithoutPassword,
      needsProfileCustomization: false
    });
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
      
      console.log("Google auth request received:", { email, name, id });
      
      if (!email || !name || !id) {
        console.error("Missing required Google account information:", { email, name, id });
        return res.status(400).json({ message: "Missing required Google account information" });
      }
      
      // First check if user with this Google ID already exists
      let user = await storage.getUserByGoogleId(id);
      console.log("User found by Google ID:", user ? "Yes" : "No");
      
      // If no user found by Google ID, check by email
      if (!user) {
        user = await storage.getUserByEmail(email);
        console.log("User found by email:", user ? "Yes" : "No");
        
        // If a user with this email exists, update their Google ID
        if (user) {
          console.log(`Updating existing user ${user.email} with Google ID: ${id}`);
          
          // Update user with Google information
          const updateData = { 
            googleId: id,
            // Update profile picture if available and user doesn't have one
            ...(picture && !user.profilePicture ? { profilePicture: picture } : {}),
            // Update location if provided and user's location is unknown or empty
            ...(location && (!user.location || user.location === 'Unknown location') ? { location } : {}),
            ...(latitude && !user.latitude ? { latitude } : {}),
            ...(longitude && !user.longitude ? { longitude } : {})
          };
          
          console.log("Updating user with data:", updateData);
          
          const updatedUser = await storage.updateUser(user.id, updateData);
          
          if (updatedUser) {
            user = updatedUser;
            console.log(`Updated existing user: ${user.name} (${user.email})`);
          } else {
            console.error("Failed to update existing user");
          }
        } else {
          // If no user exists at all, create a new one
          console.log("No user found, creating new account");
          
          // Generate a unique username based on email or name
          // Strip any non-alphanumeric characters
          let baseUsername = email.split('@')[0].toLowerCase();
          if (!baseUsername) {
            baseUsername = (givenName || name.split(' ')[0]).toLowerCase();
          }
          
          // Clean the username - keep only letters and numbers
          baseUsername = baseUsername.replace(/[^a-z0-9]/g, '');
          
          // Add a timestamp suffix for uniqueness
          const timestamp = Date.now().toString().slice(-4);
          const username = `${baseUsername}${timestamp}`;
          
          // Generate a random password (user won't need to know it since they'll use Google to login)
          const randomPassword = randomBytes(16).toString('hex');
          
          console.log(`Creating new user with username: ${username}, email: ${email}`);
          
          try {
            // Create the user with all available information
            // Make sure we have a proper name format by using first and last name if available
            const formattedName = name || (givenName && familyName 
              ? `${givenName} ${familyName}` 
              : givenName || email.split('@')[0]);
            
            user = await storage.createUser({
              username,
              email,
              name: formattedName,  // Use properly formatted name
              password: await hashPassword(randomPassword),
              googleId: id,
              location: location || 'Unknown location',
              profilePicture: picture || '',
              latitude: latitude || null,
              longitude: longitude || null,
              // Store first and last name if available in userProfile
              ...(givenName ? { firstName: givenName } : {}),
              ...(familyName ? { lastName: familyName } : {})
            });
            
            console.log(`Successfully created new user: ${user.id} - ${user.name} (${user.email})`);
          } catch (error) {
            console.error("Failed to create user:", error);
            return res.status(500).json({ message: "Failed to create user account", error: String(error) });
          }
        }
      } else {
        console.log(`Existing user found by Google ID: ${user.id} - ${user.name} (${user.email})`);
        
        // User exists, check if we need to update their info
        const userNeedsUpdate = 
          (location && (!user.location || user.location === 'Unknown location')) || 
          (picture && !user.profilePicture) ||
          (latitude && !user.latitude) ||
          (longitude && !user.longitude);
          
        if (userNeedsUpdate) {
          console.log(`Updating existing user ${user.email} with additional information`);
          
          const updateData = {
            // Only update these fields if they're empty
            ...(location && (!user.location || user.location === 'Unknown location') ? { location } : {}),
            ...(picture && !user.profilePicture ? { profilePicture: picture } : {}),
            ...(latitude && !user.latitude ? { latitude } : {}),
            ...(longitude && !user.longitude ? { longitude } : {})
          };
          
          console.log("Updating user with data:", updateData);
          
          const updatedUser = await storage.updateUser(user.id, updateData);

          if (updatedUser) {
            user = updatedUser;
            console.log(`Successfully updated user: ${user.id} - ${user.name} (${user.email})`);
          } else {
            console.error("Failed to update user");
          }
        }
      }
      
      // Double check if we have a valid user before attempting to log in
      if (!user || !user.id) {
        console.error("No valid user object after processing:", user);
        return res.status(500).json({ message: "Failed to create or retrieve user account" });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        
        console.log(`User successfully logged in: ${user.id} - ${user.name} (${user.email})`);
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        
        // Check if this is a new user account or if the username was auto-generated
        // We detect auto-generated usernames by checking if they end with a timestamp (4 digits)
        const isNewAccount = userWithoutPassword.username.match(/\d{4}$/);
        
        // Return a flag indicating if the user should be redirected to the profile customization page
        // Only users who logged in with Google and have an auto-generated username need to customize their profile
        res.status(200).json({
          ...userWithoutPassword,
          needsProfileCustomization: !!userWithoutPassword.googleId && isNewAccount
        });
      });
    } catch (error) {
      console.error("Error in Google auth:", error);
      next(error);
    }
  });

  // Add an endpoint to check if an email exists before registration
  app.post("/api/check-email", async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      return res.json({ exists: !!existingUser });
    } catch (error) {
      next(error);
    }
  });

  // Password reset request - Step 1: Request a reset token
  app.post("/api/request-password-reset", async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      // Even if user doesn't exist, we don't want to reveal that info
      // for security reasons, so we always return success
      if (!user) {
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      }
      
      // Generate a reset token and expiry (1 hour from now)
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Save token to database
      await storage.savePasswordResetToken(user.id, resetToken, resetTokenExpiry);
      
      // Get base URL for email links
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Import the email service
      const { sendPasswordResetEmail } = await import('./email-service');
      
      // Send the password reset email with the token
      const emailSent = await sendPasswordResetEmail(
        user.email, 
        resetToken, 
        baseUrl
      );
      
      if (!emailSent) {
        console.error(`Failed to send password reset email to ${user.email}`);
      } else {
        console.log(`Password reset email sent successfully to ${user.email}`);
      }
      
      return res.json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent.",
        // In development, return the token for testing
        ...(process.env.NODE_ENV === 'development' ? { 
          resetToken, 
          resetUrl: `${baseUrl}/reset-password?token=${resetToken}` 
        } : {})
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      next(error);
    }
  });
  
  // Password reset - Step 2: Verify token and reset password
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: "Token and new password are required" 
        });
      }
      
      // Validate password
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: "Password must be at least 6 characters" 
        });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      // Check if token exists and is valid
      if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid or expired password reset token" 
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user's password and clear reset token
      await storage.updatePassword(user.id, hashedPassword);
      
      return res.json({ 
        success: true, 
        message: "Password has been reset successfully. You can now log in with your new password." 
      });
    } catch (error) {
      console.error("Password reset error:", error);
      next(error);
    }
  });
  
  // Verify if a reset token is valid
  app.get("/api/verify-reset-token/:token", async (req, res, next) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ valid: false });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      // Check if token exists and is valid
      if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.json({ valid: false });
      }
      
      return res.json({ valid: true });
    } catch (error) {
      console.error("Token verification error:", error);
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
