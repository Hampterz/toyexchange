import { users, type User, type InsertUser, toys, type Toy, type InsertToy, messages, type Message, type InsertMessage, toyRequests, type ToyRequest, type InsertToyRequest, favorites, type Favorite, type InsertFavorite, contactMessages, type ContactMessage, type InsertContactMessage, BADGES } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { hashPassword } from "./auth";

const MemoryStore = createMemoryStore(session);

// Utility function to calculate badge based on sustainability score
function calculateBadge(score: number): string {
  if (score >= BADGES.PLANET_PROTECTOR.minScore) {
    return BADGES.PLANET_PROTECTOR.name;
  } else if (score >= BADGES.EARTH_GUARDIAN.minScore) {
    return BADGES.EARTH_GUARDIAN.name;
  } else if (score >= BADGES.SUSTAINABILITY_HERO.minScore) {
    return BADGES.SUSTAINABILITY_HERO.name;
  } else if (score >= BADGES.ECO_FRIEND.minScore) {
    return BADGES.ECO_FRIEND.name;
  } else {
    return BADGES.NEWCOMER.name;
  }
}

// Utility function to update a user's sustainability metrics
async function updateUserSustainabilityMetrics(
  storage: IStorage, 
  userId: number, 
  { toysSharedIncrement = 0, successfulExchangesIncrement = 0 }:
  { toysSharedIncrement?: number, successfulExchangesIncrement?: number }
): Promise<User | undefined> {
  const user = await storage.getUser(userId);
  if (!user) return undefined;
  
  // Default values if they don't exist
  const currentToysShared = user.toysShared || 0;
  const currentExchanges = user.successfulExchanges || 0;
  
  // Calculate new values
  const newToysShared = currentToysShared + toysSharedIncrement;
  const newExchanges = currentExchanges + successfulExchangesIncrement;
  
  // Calculate sustainability score (toys shared * 5 + successful exchanges * 3)
  const newScore = (newToysShared * 5) + (newExchanges * 3);
  
  // Calculate the appropriate badge based on the score
  const newBadge = calculateBadge(newScore);
  
  // Update the user
  return storage.updateUser(userId, {
    toysShared: newToysShared,
    successfulExchanges: newExchanges,
    sustainabilityScore: newScore,
    currentBadge: newBadge
  });
}

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Toy CRUD
  getToy(id: number): Promise<Toy | undefined>;
  getToys(filters?: Record<string, any>): Promise<Toy[]>;
  getToysByUser(userId: number): Promise<Toy[]>;
  createToy(toy: InsertToy): Promise<Toy>;
  updateToy(id: number, toy: Partial<Toy>): Promise<Toy | undefined>;
  deleteToy(id: number): Promise<boolean>;

  // Message CRUD
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  getMessagesBetweenUsers(senderId: number, receiverId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageRead(id: number, read: boolean): Promise<Message | undefined>;

  // ToyRequest CRUD
  getToyRequest(id: number): Promise<ToyRequest | undefined>;
  getToyRequestsByToy(toyId: number): Promise<ToyRequest[]>;
  getToyRequestsByRequester(requesterId: number): Promise<ToyRequest[]>;
  getToyRequestsByOwner(ownerId: number): Promise<ToyRequest[]>;
  createToyRequest(toyRequest: InsertToyRequest): Promise<ToyRequest>;
  updateToyRequestStatus(id: number, status: string): Promise<ToyRequest | undefined>;

  // Favorite CRUD
  getFavorite(id: number): Promise<Favorite | undefined>;
  getFavoriteByUserAndToy(userId: number, toyId: number): Promise<Favorite | undefined>;
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;

  // ContactMessage CRUD
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private toysMap: Map<number, Toy>;
  private messagesMap: Map<number, Message>;
  private toyRequestsMap: Map<number, ToyRequest>;
  private favoritesMap: Map<number, Favorite>;
  private contactMessagesMap: Map<number, ContactMessage>;
  
  private userCurrentId: number = 1;
  private toyCurrentId: number = 1;
  private messageCurrentId: number = 1;
  private toyRequestCurrentId: number = 1;
  private favoriteCurrentId: number = 1;
  private contactMessageCurrentId: number = 1;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersMap = new Map();
    this.toysMap = new Map();
    this.messagesMap = new Map();
    this.toyRequestsMap = new Map();
    this.favoritesMap = new Map();
    this.contactMessagesMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Initialize admin user - will be created during first call to any method
    setTimeout(() => this.initAdminUser(), 100);
  }
  
  private async initAdminUser() {
    const adminExists = Array.from(this.usersMap.values()).some(
      user => user.username === "adminsreyas"
    );
    
    if (!adminExists) {
      console.log('Creating admin user: adminsreyas');
      // Password is Jell1boi!! - hash it properly first
      const hashedPassword = await hashPassword("Jell1boi!!");
      
      // Create admin user with Planet Protector badge by default
      await this.createUser({
        username: "adminsreyas",
        password: hashedPassword,
        email: "admin@toyshare.com",
        name: "ToyShare Admin",
        location: "Admin Headquarters",
        profilePicture: null
      });
      
      // Give admin the highest sustainability badge
      const admin = Array.from(this.usersMap.values()).find(
        user => user.username === "adminsreyas"
      );
      
      if (admin) {
        await this.updateUser(admin.id, {
          toysShared: 50,
          successfulExchanges: 20,
          sustainabilityScore: 130,
          currentBadge: BADGES.PLANET_PROTECTOR.name
        });
      }
      
      console.log('Admin user created successfully');
    }
  }

  // User CRUD methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    
    // Initialize sustainability metrics for new users
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      toysShared: 0,
      successfulExchanges: 0,
      sustainabilityScore: 0,
      currentBadge: BADGES.NEWCOMER.name
    };
    
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Toy CRUD methods
  async getToy(id: number): Promise<Toy | undefined> {
    return this.toysMap.get(id);
  }

  async getToys(filters?: Record<string, any>): Promise<Toy[]> {
    let toys = Array.from(this.toysMap.values());
    
    if (filters) {
      if (filters.location && filters.location !== "any") {
        toys = toys.filter(toy => toy.location === filters.location);
      }
      if (filters.ageRange && filters.ageRange !== "any") {
        toys = toys.filter(toy => toy.ageRange === filters.ageRange);
      }
      if (filters.category && filters.category !== "any") {
        toys = toys.filter(toy => toy.category === filters.category);
      }
      if (filters.condition && filters.condition !== "any") {
        toys = toys.filter(toy => toy.condition === filters.condition);
      }
      if (filters.isAvailable !== undefined) {
        toys = toys.filter(toy => toy.isAvailable === filters.isAvailable);
      }
      
      // Tags filter (supports multiple tags)
      if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
        toys = toys.filter(toy => {
          // If toy doesn't have tags property or it's not an array, treat as no tags
          const toyTags = Array.isArray(toy.tags) ? toy.tags : [];
          // Check if the toy has ALL the specified tags
          return filters.tags.every((tag: string) => 
            toyTags.includes(tag)
          );
        });
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        toys = toys.filter(toy => {
          const toyTags = Array.isArray(toy.tags) ? toy.tags : [];
          const matchInTags = toyTags.some(tag => 
            tag.toLowerCase().includes(searchLower)
          );
          
          return toy.title.toLowerCase().includes(searchLower) || 
                 toy.description.toLowerCase().includes(searchLower) ||
                 matchInTags;
        });
      }
    }
    
    // Sort by newest first (default)
    return toys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getToysByUser(userId: number): Promise<Toy[]> {
    return Array.from(this.toysMap.values())
      .filter(toy => toy.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createToy(insertToy: InsertToy): Promise<Toy> {
    const id = this.toyCurrentId++;
    const createdAt = new Date();
    
    // Ensure tags is an array
    const tags = Array.isArray(insertToy.tags) ? insertToy.tags : [];
    
    const toy: Toy = { 
      ...insertToy, 
      id, 
      createdAt,
      tags 
    };
    
    this.toysMap.set(id, toy);
    
    // Update the user's sustainability metrics when they share a toy
    await updateUserSustainabilityMetrics(this, insertToy.userId, { toysSharedIncrement: 1 });
    
    return toy;
  }

  async updateToy(id: number, updates: Partial<Toy>): Promise<Toy | undefined> {
    const toy = this.toysMap.get(id);
    if (!toy) return undefined;
    
    const updatedToy = { ...toy, ...updates };
    this.toysMap.set(id, updatedToy);
    return updatedToy;
  }

  async deleteToy(id: number): Promise<boolean> {
    return this.toysMap.delete(id);
  }

  // Message CRUD methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesMap.get(id);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMessagesBetweenUsers(senderId: number, receiverId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values())
      .filter(message => 
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messagesMap.set(id, message);
    return message;
  }

  async updateMessageRead(id: number, read: boolean): Promise<Message | undefined> {
    const message = this.messagesMap.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read };
    this.messagesMap.set(id, updatedMessage);
    return updatedMessage;
  }

  // ToyRequest CRUD methods
  async getToyRequest(id: number): Promise<ToyRequest | undefined> {
    return this.toyRequestsMap.get(id);
  }

  async getToyRequestsByToy(toyId: number): Promise<ToyRequest[]> {
    return Array.from(this.toyRequestsMap.values())
      .filter(request => request.toyId === toyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getToyRequestsByRequester(requesterId: number): Promise<ToyRequest[]> {
    return Array.from(this.toyRequestsMap.values())
      .filter(request => request.requesterId === requesterId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getToyRequestsByOwner(ownerId: number): Promise<ToyRequest[]> {
    return Array.from(this.toyRequestsMap.values())
      .filter(request => request.ownerId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createToyRequest(insertToyRequest: InsertToyRequest): Promise<ToyRequest> {
    const id = this.toyRequestCurrentId++;
    const createdAt = new Date();
    const toyRequest: ToyRequest = { ...insertToyRequest, id, createdAt };
    this.toyRequestsMap.set(id, toyRequest);
    return toyRequest;
  }

  async updateToyRequestStatus(id: number, status: string): Promise<ToyRequest | undefined> {
    const request = this.toyRequestsMap.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.toyRequestsMap.set(id, updatedRequest);
    
    // If the request is approved, increment the successful exchanges counter for both users
    if (status === 'approved') {
      // Update owner's sustainability metrics (shared a toy successfully)
      await updateUserSustainabilityMetrics(this, request.ownerId, { 
        successfulExchangesIncrement: 1 
      });
      
      // Update requester's sustainability metrics (received a toy)
      await updateUserSustainabilityMetrics(this, request.requesterId, { 
        successfulExchangesIncrement: 1 
      });
      
      // Update the toy to mark it as no longer available
      const toy = await this.getToy(request.toyId);
      if (toy) {
        await this.updateToy(toy.id, { isAvailable: false });
      }
    }
    
    return updatedRequest;
  }

  // Favorite CRUD methods
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favoritesMap.get(id);
  }

  async getFavoriteByUserAndToy(userId: number, toyId: number): Promise<Favorite | undefined> {
    return Array.from(this.favoritesMap.values())
      .find(favorite => favorite.userId === userId && favorite.toyId === toyId);
  }

  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return Array.from(this.favoritesMap.values())
      .filter(favorite => favorite.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteCurrentId++;
    const createdAt = new Date();
    const favorite: Favorite = { ...insertFavorite, id, createdAt };
    this.favoritesMap.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    return this.favoritesMap.delete(id);
  }

  // ContactMessage CRUD methods
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessagesMap.get(id);
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values())
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const createdAt = new Date();
    const contactMessage: ContactMessage = { ...insertContactMessage, id, createdAt };
    this.contactMessagesMap.set(id, contactMessage);
    return contactMessage;
  }
}

export const storage = new MemStorage();
