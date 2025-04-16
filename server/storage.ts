import { users, type User, type InsertUser, toys, type Toy, type InsertToy, messages, type Message, type InsertMessage, toyRequests, type ToyRequest, type InsertToyRequest, favorites, type Favorite, type InsertFavorite, contactMessages, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
    const user: User = { ...insertUser, id, createdAt };
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
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        toys = toys.filter(toy => 
          toy.title.toLowerCase().includes(searchLower) || 
          toy.description.toLowerCase().includes(searchLower)
        );
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
    const toy: Toy = { ...insertToy, id, createdAt };
    this.toysMap.set(id, toy);
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
}

export const storage = new MemStorage();
