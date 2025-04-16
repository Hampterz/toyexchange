import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertToySchema,
  insertMessageSchema,
  insertToyRequestSchema,
  insertFavoriteSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
      
      const toys = await storage.getToys(filters);
      res.json(toys);
    } catch (error) {
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
      
      if (toy.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to delete this toy" });
      }
      
      await storage.deleteToy(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete toy" });
    }
  });

  // Get toys by user
  app.get("/api/users/:userId/toys", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const toys = await storage.getToysByUser(userId);
      res.json(toys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's toys" });
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

  // Get all contact messages (admin only - would have authorization in real app)
  app.get("/api/contact/messages", ensureAuthenticated, async (req, res) => {
    try {
      // In a real app, this would check for admin role
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
