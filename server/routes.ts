import type { Express } from "express";
import { createServer, type Server } from "http";
import * as fs from "fs";
import * as path from "path";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { 
  insertToySchema,
  insertMessageSchema,
  insertToyRequestSchema,
  insertFavoriteSchema,
  insertContactMessageSchema,
  insertGroupSchema,
  insertGroupMemberSchema,
  insertFollowSchema,
  insertReportSchema,
  insertMeetupLocationSchema,
  insertToyHistorySchema,
  insertSafetyTipSchema,
  insertWishSchema,
  insertWishOfferSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Configure multer storage for file uploads
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'profile-' + uniqueSuffix + ext);
    }
  });

  // File filter to only allow image files
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  };

  const upload = multer({ 
    storage: fileStorage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
  });

  // Middleware to check authentication
  const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // TOYS ROUTES
  // Get all toys with optional filters
  app.get("/api/toys", async (req, res) => {
    try {
      const filters: Record<string, any> = {};
      
      // Parse query parameters
      if (req.query.location) filters.location = req.query.location as string;
      if (req.query.ageRange) filters.ageRange = req.query.ageRange as string;
      if (req.query.category) filters.category = req.query.category as string;
      if (req.query.condition) filters.condition = req.query.condition as string;
      if (req.query.search) filters.search = req.query.search as string;
      if (req.query.isAvailable) filters.isAvailable = req.query.isAvailable === "true";
      
      // Handle location-based distance filtering
      if (req.query.latitude && req.query.longitude) {
        filters.latitude = parseFloat(req.query.latitude as string);
        filters.longitude = parseFloat(req.query.longitude as string);
        
        // Default distance is 10 miles if not specified
        filters.distance = req.query.distance ? 
          parseFloat(req.query.distance as string) : 
          10;
      }
      
      const toys = await storage.getToys(filters);
      res.json(toys);
    } catch (error) {
      console.error("Error fetching toys:", error);
      res.status(500).json({ message: "Failed to fetch toys" });
    }
  });

  // Get a specific toy
  app.get("/api/toys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const toy = await storage.getToy(id);
      
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      res.json(toy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch toy" });
    }
  });

  // Create a new toy
  app.post("/api/toys", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const toyData = { ...req.body, userId };

      const validatedData = insertToySchema.parse(toyData);
      const newToy = await storage.createToy(validatedData);
      
      res.status(201).json(newToy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid toy data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create toy" });
    }
  });

  // Update a toy
  app.patch("/api/toys/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const toy = await storage.getToy(id);
      
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      if (toy.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this toy" });
      }
      
      const updatedToy = await storage.updateToy(id, req.body);
      res.json(updatedToy);
    } catch (error) {
      res.status(500).json({ message: "Failed to update toy" });
    }
  });

  // Delete a toy
  app.delete("/api/toys/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const toy = await storage.getToy(id);
      
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      // Allow both the toy owner and admin user to delete toys
      const isAdmin = req.user!.username === "adminsreyas";
      if (toy.userId !== req.user!.id && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to delete this toy" });
      }
      
      await storage.deleteToy(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete toy" });
    }
  });

  // Get toys by user (with userId in URL)
  app.get("/api/users/:userId/toys", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const toys = await storage.getToysByUser(userId);
      res.json(toys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's toys" });
    }
  });
  
  // Get toys by current logged-in user
  app.get("/api/toys/by-user", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      console.log("Fetching toys for user ID:", userId);
      const toys = await storage.getToysByUser(userId);
      console.log("Retrieved toys:", toys);
      res.json(toys);
    } catch (error) {
      console.error("Error fetching toys by user:", error);
      res.status(500).json({ message: "Failed to fetch toys", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // MESSAGES ROUTES
  // Get messages for current user
  app.get("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get conversation between two users
  app.get("/api/messages/:userId", ensureAuthenticated, async (req, res) => {
    try {
      const currentUserId = req.user!.id;
      const otherUserId = parseInt(req.params.userId);
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Send a message
  app.post("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const senderId = req.user!.id;
      const messageData = { ...req.body, senderId };

      const validatedData = insertMessageSchema.parse(messageData);
      const newMessage = await storage.createMessage(validatedData);
      
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Mark message as read
  app.patch("/api/messages/:id/read", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.receiverId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this message" });
      }
      
      const updatedMessage = await storage.updateMessageRead(id, true);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Delete a message (only allows senders to delete their unread messages)
  app.delete("/api/messages/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      // Only sender can delete, and only if message hasn't been read
      if (message.senderId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to delete this message" });
      }
      
      if (message.read) {
        return res.status(400).json({ message: "Cannot delete messages that have been read" });
      }
      
      const success = await storage.deleteMessage(id);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to delete message" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });
  
  // Delete entire conversation with another user
  app.delete("/api/conversations/:otherUserId", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const otherUserId = parseInt(req.params.otherUserId);
      
      if (isNaN(otherUserId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const success = await storage.deleteConversation(userId, otherUserId);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to delete conversation" });
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // TOY REQUESTS ROUTES
  // Get toy requests for a toy
  app.get("/api/toys/:toyId/requests", ensureAuthenticated, async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      const toy = await storage.getToy(toyId);
      
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      if (toy.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to view these requests" });
      }
      
      const requests = await storage.getToyRequestsByToy(toyId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch toy requests" });
    }
  });

  // Get requests made by current user
  app.get("/api/requests/made", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const requests = await storage.getToyRequestsByRequester(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your requests" });
    }
  });

  // Get requests received by current user
  app.get("/api/requests/received", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const requests = await storage.getToyRequestsByOwner(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch received requests" });
    }
  });

  // Create a toy request
  app.post("/api/toys/:toyId/request", ensureAuthenticated, async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      const requesterId = req.user!.id;
      
      const toy = await storage.getToy(toyId);
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      if (toy.userId === requesterId) {
        return res.status(400).json({ message: "You cannot request your own toy" });
      }
      
      const ownerId = toy.userId;
      
      // Check if a pending request already exists
      const existingRequests = await storage.getToyRequestsByToy(toyId);
      const alreadyRequested = existingRequests.some(
        request => request.requesterId === requesterId && request.status === "pending"
      );
      
      if (alreadyRequested) {
        return res.status(400).json({ message: "You already have a pending request for this toy" });
      }
      
      const requestData = {
        ...req.body,
        toyId,
        requesterId,
        ownerId,
        status: "pending"
      };

      const validatedData = insertToyRequestSchema.parse(requestData);
      const newRequest = await storage.createToyRequest(validatedData);
      
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create toy request" });
    }
  });

  // Update a toy request status
  app.patch("/api/requests/:id/status", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const request = await storage.getToyRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (request.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this request" });
      }
      
      const updatedRequest = await storage.updateToyRequestStatus(id, status);
      
      // If approved, update toy availability
      if (status === "approved") {
        await storage.updateToy(request.toyId, { isAvailable: false });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request status" });
    }
  });

  // FAVORITES ROUTES
  // Get favorites for current user
  app.get("/api/favorites", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const favorites = await storage.getFavoritesByUser(userId);
      
      // Get the toy details for each favorite
      const toyPromises = favorites.map(async favorite => {
        const toy = await storage.getToy(favorite.toyId);
        return { ...favorite, toy };
      });
      
      const favoritesWithToys = await Promise.all(toyPromises);
      res.json(favoritesWithToys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Toggle favorite status
  app.post("/api/toys/:toyId/favorite", ensureAuthenticated, async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      const userId = req.user!.id;
      
      const toy = await storage.getToy(toyId);
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      const existingFavorite = await storage.getFavoriteByUserAndToy(userId, toyId);
      
      if (existingFavorite) {
        // Remove from favorites
        await storage.deleteFavorite(existingFavorite.id);
        return res.status(200).json({ favorited: false });
      } else {
        // Add to favorites
        const favoriteData = { userId, toyId };
        const validatedData = insertFavoriteSchema.parse(favoriteData);
        const newFavorite = await storage.createFavorite(validatedData);
        return res.status(201).json({ favorited: true, favorite: newFavorite });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to toggle favorite status" });
    }
  });

  // Check if toy is favorited by current user
  app.get("/api/toys/:toyId/favorite", ensureAuthenticated, async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      const userId = req.user!.id;
      
      const favorite = await storage.getFavoriteByUserAndToy(userId, toyId);
      res.json({ favorited: !!favorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // USER ROUTES
  // Get user details (for profile viewing and sustainability badges)
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Do not send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });
  
  // Get reviews for a user (from completed toy requests)
  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get all toy requests where this user is the owner and the request was approved
      const requests = await storage.getToyRequestsByOwner(userId);
      const completedRequests = requests.filter(request => 
        request.status === "approved" && request.feedback && request.rating
      );
      
      res.json(completedRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });
  
  // Update user profile
  app.patch("/api/users/:userId", ensureAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only allow users to update their own profile
      if (userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this user" });
      }
      
      // Only allow updating certain fields
      const allowedUpdates = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        location: req.body.location,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture
      };
      
      // Remove undefined fields
      const filteredUpdates = Object.entries(allowedUpdates)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedUser = await storage.updateUser(userId, filteredUpdates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Do not send password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // CONTACT MESSAGE ROUTES
  // Submit a contact form message
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = req.body;
      
      const validatedData = insertContactMessageSchema.parse(contactData);
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // In a real implementation, this would also send an email to the support address
      // using the SendGrid API with the SENDGRID_API_KEY
      
      res.status(201).json({ 
        success: true, 
        message: "Your message has been received. We'll get back to you soon.",
        id: contactMessage.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "Failed to submit contact message" 
      });
    }
  });

  // Admin middleware to check if user is an admin
  const ensureAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.username === "adminsreyas") {
      return next();
    }
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  };

  // Admin routes
  // Get all users (admin only)
  app.get("/api/admin/users", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove sensitive information like passwords before sending
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Get all toys (admin only)
  app.get("/api/admin/toys", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const toys = await storage.getToys();
      res.json(toys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch toys" });
    }
  });
  
  // Get all reports (admin only)
  app.get("/api/admin/reports", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });
  
  // Delete toy (admin only)
  app.delete("/api/admin/toys/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const toyId = parseInt(req.params.id);
      const success = await storage.deleteToy(toyId);
      
      if (!success) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete toy" });
    }
  });
  
  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting the admin user or the currently logged in user
      if (req.user!.id === userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // Resolve report (admin only)
  app.patch("/api/admin/reports/:id/resolve", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const adminId = req.user!.id;
      
      const updatedReport = await storage.updateReportStatus(reportId, "resolved", adminId);
      
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to resolve report" });
    }
  });
  
  // Get all contact messages (admin only)
  app.get("/api/admin/contact-messages", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  // Get all contact messages (admin only) - keeping this for backward compatibility
  app.get("/api/contact-messages", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  // Get all toys (admin only)
  app.get("/api/toys/all", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
      const toys = await storage.getToys({});
      res.json(toys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all toys" });
    }
  });
  
  // Community metrics endpoint - GET
  app.get("/api/community-metrics", async (_req, res) => {
    try {
      const metrics = await storage.getCommunityMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching community metrics:", error);
      res.status(500).json({ error: "Failed to fetch community metrics" });
    }
  });
  
  // Update community metrics - PATCH
  app.patch("/api/community-metrics", ensureAuthenticated, async (req, res) => {
    try {
      const { toysSaved, familiesConnected, wasteReduced } = req.body;
      
      // Get current metrics
      const currentMetrics = await storage.getCommunityMetrics();
      
      // Calculate new values with increments
      const updatedMetrics = {
        toysSaved: toysSaved ? currentMetrics.toysSaved + parseInt(toysSaved) : currentMetrics.toysSaved,
        familiesConnected: familiesConnected ? currentMetrics.familiesConnected + parseInt(familiesConnected) : currentMetrics.familiesConnected,
        wasteReduced: wasteReduced ? currentMetrics.wasteReduced + parseInt(wasteReduced) : currentMetrics.wasteReduced
      };
      
      // Update metrics
      const metrics = await storage.updateCommunityMetrics(updatedMetrics);
      res.json(metrics);
    } catch (error) {
      console.error("Error updating community metrics:", error);
      res.status(500).json({ error: "Failed to update community metrics" });
    }
  });
  
  // Update user sustainability metrics
  app.patch("/api/users/:userId/sustainability", ensureAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const increments = req.body;
      
      // Only allow users to update their own sustainability metrics or admin user
      const isAdmin = req.user!.username === "adminsreyas";
      if (userId !== req.user!.id && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this user's metrics" });
      }
      
      // Get current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Calculate new metrics
      const updatedMetrics = {
        toysShared: (user.toysShared || 0) + (increments.toysShared || 0),
        successfulExchanges: (user.successfulExchanges || 0) + (increments.successfulExchanges || 0),
      };
      
      // Calculate sustainability score: toysShared * 10 + successfulExchanges * 5
      const newScore = updatedMetrics.toysShared * 10 + updatedMetrics.successfulExchanges * 5;
      
      // Determine badge level
      let newBadge = "ECO_STARTER";
      if (newScore >= 100) {
        newBadge = "PLANET_PROTECTOR";
      } else if (newScore >= 50) {
        newBadge = "SUSTAINABILITY_CHAMPION";
      } else if (newScore >= 25) {
        newBadge = "COMMUNITY_CONTRIBUTOR";
      }
      
      const finalUpdates = {
        ...updatedMetrics,
        sustainabilityScore: newScore,
        currentBadge: newBadge
      };
      
      // Update user
      const updatedUser = await storage.updateUser(userId, finalUpdates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Failed to update user" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user sustainability metrics:", error);
      res.status(500).json({ message: "Failed to update sustainability metrics" });
    }
  });

  // GROUPS ROUTES
  // Get all groups with optional filters
  app.get("/api/groups", async (req, res) => {
    try {
      const filters: Record<string, any> = {};
      
      // Parse query parameters
      if (req.query.name) filters.name = req.query.name as string;
      if (req.query.location) filters.location = req.query.location as string;
      if (req.query.isPublic) filters.isPublic = req.query.isPublic === "true";
      
      const groups = await storage.getGroups(filters);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  // Get a specific group
  app.get("/api/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getGroup(id);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  // Create a new group
  app.post("/api/groups", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const groupData = { ...req.body, creatorId: userId };
      
      const validatedData = insertGroupSchema.parse(groupData);
      const newGroup = await storage.createGroup(validatedData);
      
      res.status(201).json(newGroup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid group data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  // Update a group
  app.patch("/api/groups/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const group = await storage.getGroup(id);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      // Check if user is admin of the group
      const members = await storage.getGroupMembers(id);
      const userMembership = members.find(m => m.userId === req.user!.id && m.role === 'admin');
      
      if (!userMembership) {
        return res.status(403).json({ message: "Not authorized to update this group" });
      }
      
      const updatedGroup = await storage.updateGroup(id, req.body);
      res.json(updatedGroup);
    } catch (error) {
      res.status(500).json({ message: "Failed to update group" });
    }
  });

  // Join a group
  app.post("/api/groups/:id/join", ensureAuthenticated, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const group = await storage.getGroup(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      // Check if user is already a member
      const members = await storage.getGroupMembers(groupId);
      const isMember = members.some(m => m.userId === userId);
      
      if (isMember) {
        return res.status(400).json({ message: "Already a member of this group" });
      }
      
      const membership = await storage.joinGroup(userId, groupId);
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Leave a group
  app.delete("/api/groups/:id/leave", ensureAuthenticated, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const success = await storage.leaveGroup(userId, groupId);
      
      if (!success) {
        return res.status(404).json({ message: "Group membership not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to leave group" });
    }
  });

  // Get groups the current user is a member of
  app.get("/api/my-groups", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const groups = await storage.getGroupsByUser(userId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your groups" });
    }
  });

  // FOLLOW SYSTEM ROUTES
  // Follow a user
  app.post("/api/users/:userId/follow", ensureAuthenticated, async (req, res) => {
    try {
      const followerId = req.user!.id;
      const followingId = parseInt(req.params.userId);
      
      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }
      
      const userToFollow = await storage.getUser(followingId);
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const follow = await storage.followUser(followerId, followingId);
      res.status(201).json(follow);
    } catch (error) {
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  // Unfollow a user
  app.delete("/api/users/:userId/unfollow", ensureAuthenticated, async (req, res) => {
    try {
      const followerId = req.user!.id;
      const followingId = parseInt(req.params.userId);
      
      const success = await storage.unfollowUser(followerId, followingId);
      
      if (!success) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  // Get followers of a user
  app.get("/api/users/:userId/followers", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const follows = await storage.getFollowers(userId);
      
      // Get the follower user details
      const followerPromises = follows.map(async follow => {
        const follower = await storage.getUser(follow.followerId);
        if (follower) {
          const { password, ...followerWithoutPassword } = follower;
          return { follow, follower: followerWithoutPassword };
        }
        return null;
      });
      
      const followers = (await Promise.all(followerPromises)).filter(f => f !== null);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch followers" });
    }
  });

  // Get users followed by a user
  app.get("/api/users/:userId/following", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const follows = await storage.getFollowing(userId);
      
      // Get the followed user details
      const followingPromises = follows.map(async follow => {
        const following = await storage.getUser(follow.followingId);
        if (following) {
          const { password, ...followingWithoutPassword } = following;
          return { follow, following: followingWithoutPassword };
        }
        return null;
      });
      
      const following = (await Promise.all(followingPromises)).filter(f => f !== null);
      res.json(following);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch following" });
    }
  });

  // Check if a user is following another user
  app.get("/api/users/:userId/is-following/:targetId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const targetId = parseInt(req.params.targetId);
      
      const isFollowing = await storage.isFollowing(userId, targetId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  // REPORT SYSTEM ROUTES
  // Create a report
  app.post("/api/reports", ensureAuthenticated, async (req, res) => {
    try {
      const reporterId = req.user!.id;
      const reportData = { ...req.body, reporterId };
      
      const validatedData = insertReportSchema.parse(reportData);
      const newReport = await storage.createReport(validatedData);
      
      res.status(201).json(newReport);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Get reports (admin only)
  app.get("/api/reports", ensureAuthenticated, async (req, res) => {
    try {
      // Verify user is admin
      if (req.user!.username !== "adminsreyas") {
        return res.status(403).json({ message: "Not authorized to view reports" });
      }
      
      const status = req.query.status as string | undefined;
      const reports = await storage.getReports(status);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Update report status (admin only)
  app.patch("/api/reports/:id/status", ensureAuthenticated, async (req, res) => {
    try {
      // Verify user is admin
      if (req.user!.username !== "adminsreyas") {
        return res.status(403).json({ message: "Not authorized to update reports" });
      }
      
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "investigating", "resolved", "dismissed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      const updatedReport = await storage.updateReportStatus(id, status, req.user!.id);
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to update report status" });
    }
  });

  // MEETUP LOCATIONS ROUTES
  // Get all meetup locations with optional filters
  app.get("/api/meetup-locations", async (req, res) => {
    try {
      const filters: Record<string, any> = {};
      
      // Parse query parameters
      if (req.query.city) filters.city = req.query.city as string;
      if (req.query.state) filters.state = req.query.state as string;
      if (req.query.locationType) filters.locationType = req.query.locationType as string;
      if (req.query.isVerified) filters.isVerified = req.query.isVerified === "true";
      
      const locations = await storage.getMeetupLocations(filters);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetup locations" });
    }
  });

  // Get a specific meetup location
  app.get("/api/meetup-locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getMeetupLocation(id);
      
      if (!location) {
        return res.status(404).json({ message: "Meetup location not found" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetup location" });
    }
  });

  // Add a new meetup location
  app.post("/api/meetup-locations", ensureAuthenticated, async (req, res) => {
    try {
      const addedBy = req.user!.id;
      const locationData = { ...req.body, addedBy };
      
      const validatedData = insertMeetupLocationSchema.parse(locationData);
      const newLocation = await storage.createMeetupLocation(validatedData);
      
      res.status(201).json(newLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create meetup location" });
    }
  });

  // Verify a meetup location (admin only)
  app.patch("/api/meetup-locations/:id/verify", ensureAuthenticated, async (req, res) => {
    try {
      // Verify user is admin
      if (req.user!.username !== "adminsreyas") {
        return res.status(403).json({ message: "Not authorized to verify locations" });
      }
      
      const id = parseInt(req.params.id);
      const { isVerified } = req.body;
      
      if (typeof isVerified !== "boolean") {
        return res.status(400).json({ message: "Invalid verification status" });
      }
      
      const location = await storage.getMeetupLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Meetup location not found" });
      }
      
      const updatedLocation = await storage.verifyMeetupLocation(id, isVerified);
      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify meetup location" });
    }
  });

  // TOY HISTORY ROUTES
  // Get toy history
  app.get("/api/toys/:toyId/history", async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      
      const toy = await storage.getToy(toyId);
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      const history = await storage.getToyHistoryByToy(toyId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch toy history" });
    }
  });

  // Add toy history entry
  app.post("/api/toys/:toyId/history", ensureAuthenticated, async (req, res) => {
    try {
      const toyId = parseInt(req.params.toyId);
      const userId = req.user!.id;
      
      const toy = await storage.getToy(toyId);
      if (!toy) {
        return res.status(404).json({ message: "Toy not found" });
      }
      
      // Check if user is previous or current owner
      if (toy.userId !== userId) {
        const toyRequests = await storage.getToyRequestsByToy(toyId);
        const isRecipient = toyRequests.some(
          request => request.requesterId === userId && request.status === "approved"
        );
        
        if (!isRecipient) {
          return res.status(403).json({ message: "Not authorized to add to this toy's history" });
        }
      }
      
      const historyData = { ...req.body, toyId, addedByUserId: userId };
      
      const validatedData = insertToyHistorySchema.parse(historyData);
      const newHistoryEntry = await storage.createToyHistory(validatedData);
      
      res.status(201).json(newHistoryEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add toy history" });
    }
  });

  // Add a story to an existing history entry
  app.patch("/api/toy-history/:id/story", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { story, photos } = req.body;
      
      if (!story) {
        return res.status(400).json({ message: "Story is required" });
      }
      
      const historyEntry = await storage.addStoryToToyHistory(id, story, photos);
      
      if (!historyEntry) {
        return res.status(404).json({ message: "History entry not found" });
      }
      
      res.json(historyEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to add story to toy history" });
    }
  });

  // SAFETY TIPS ROUTES
  // Get all safety tips
  app.get("/api/safety-tips", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      let tips;
      if (category) {
        tips = await storage.getSafetyTipsByCategory(category);
      } else {
        tips = await storage.getAllSafetyTips();
      }
      
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety tips" });
    }
  });

  // Get a specific safety tip
  app.get("/api/safety-tips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tip = await storage.getSafetyTip(id);
      
      if (!tip) {
        return res.status(404).json({ message: "Safety tip not found" });
      }
      
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety tip" });
    }
  });

  // Create a safety tip (admin only)
  app.post("/api/safety-tips", ensureAuthenticated, async (req, res) => {
    try {
      // Verify user is admin
      if (req.user!.username !== "adminsreyas") {
        return res.status(403).json({ message: "Not authorized to create safety tips" });
      }
      
      const validatedData = insertSafetyTipSchema.parse(req.body);
      const newTip = await storage.createSafetyTip(validatedData);
      
      res.status(201).json(newTip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid safety tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create safety tip" });
    }
  });

  // Update a safety tip (admin only)
  app.patch("/api/safety-tips/:id", ensureAuthenticated, async (req, res) => {
    try {
      // Verify user is admin
      if (req.user!.username !== "adminsreyas") {
        return res.status(403).json({ message: "Not authorized to update safety tips" });
      }
      
      const id = parseInt(req.params.id);
      const tip = await storage.getSafetyTip(id);
      
      if (!tip) {
        return res.status(404).json({ message: "Safety tip not found" });
      }
      
      const updatedTip = await storage.updateSafetyTip(id, req.body);
      res.json(updatedTip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update safety tip" });
    }
  });

  // WISHES ROUTES
  // Get all wishes with optional filters
  app.get("/api/wishes", async (req, res) => {
    try {
      const filters: Record<string, any> = {};
      
      // Parse query parameters
      if (req.query.location) filters.location = req.query.location as string;
      if (req.query.ageRange) filters.ageRange = req.query.ageRange as string;
      if (req.query.category) filters.category = req.query.category as string;
      if (req.query.search) filters.search = req.query.search as string;
      
      // Handle location-based distance filtering
      if (req.query.latitude && req.query.longitude) {
        filters.latitude = parseFloat(req.query.latitude as string);
        filters.longitude = parseFloat(req.query.longitude as string);
        
        // Default distance is 10 miles if not specified
        filters.distance = req.query.distance ? 
          parseFloat(req.query.distance as string) : 
          10;
      }
      
      const wishes = await storage.getWishes(filters);
      res.json(wishes);
    } catch (error) {
      console.error("Error fetching wishes:", error);
      res.status(500).json({ message: "Failed to fetch wishes" });
    }
  });

  // Get a specific wish
  app.get("/api/wishes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const wish = await storage.getWish(id);
      
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }
      
      res.json(wish);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wish" });
    }
  });

  // Create a new wish
  app.post("/api/wishes", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const wishData = { ...req.body, userId };

      const validatedData = insertWishSchema.parse(wishData);
      const newWish = await storage.createWish(validatedData);
      
      res.status(201).json(newWish);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wish data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create wish" });
    }
  });

  // Update a wish
  app.patch("/api/wishes/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const wish = await storage.getWish(id);
      
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }
      
      if (wish.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this wish" });
      }
      
      const updatedWish = await storage.updateWish(id, req.body);
      res.json(updatedWish);
    } catch (error) {
      res.status(500).json({ message: "Failed to update wish" });
    }
  });

  // Delete a wish
  app.delete("/api/wishes/:id", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const wish = await storage.getWish(id);
      
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }
      
      if (wish.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to delete this wish" });
      }
      
      await storage.deleteWish(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete wish" });
    }
  });

  // Get wishes by user
  app.get("/api/users/:userId/wishes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const wishes = await storage.getWishesByUser(userId);
      res.json(wishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's wishes" });
    }
  });

  // WISH OFFERS ROUTES
  // Get offers for a wish
  app.get("/api/wishes/:wishId/offers", ensureAuthenticated, async (req, res) => {
    try {
      const wishId = parseInt(req.params.wishId);
      const wish = await storage.getWish(wishId);
      
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }
      
      // Only allow wish creator to see all offers
      if (wish.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to view these offers" });
      }
      
      const offers = await storage.getWishOffersByWish(wishId);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wish offers" });
    }
  });

  // Create a wish offer
  app.post("/api/wishes/:wishId/offer", ensureAuthenticated, async (req, res) => {
    try {
      const wishId = parseInt(req.params.wishId);
      const offererId = req.user!.id;
      
      const wish = await storage.getWish(wishId);
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }
      
      if (wish.userId === offererId) {
        return res.status(400).json({ message: "You cannot offer to your own wish" });
      }
      
      // Check if a pending offer already exists
      const existingOffers = await storage.getWishOffersByWish(wishId);
      const alreadyOffered = existingOffers.some(
        offer => offer.offererId === offererId && offer.status === "pending"
      );
      
      if (alreadyOffered) {
        return res.status(400).json({ message: "You already have a pending offer for this wish" });
      }
      
      const offerData = {
        ...req.body,
        wishId,
        offererId,
        status: "pending"
      };

      const validatedData = insertWishOfferSchema.parse(offerData);
      const newOffer = await storage.createWishOffer(validatedData);
      
      res.status(201).json(newOffer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid offer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  // Update a wish offer status
  app.patch("/api/wish-offers/:id/status", ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["accepted", "rejected", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const offer = await storage.getWishOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      
      const wish = await storage.getWish(offer.wishId);
      if (!wish || wish.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to update this offer" });
      }
      
      const updatedOffer = await storage.updateWishOfferStatus(id, status);
      
      // If accepted, update wish status to fulfilled
      if (status === "accepted") {
        await storage.updateWish(offer.wishId, { status: "fulfilled" });
      }
      
      res.json(updatedOffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
