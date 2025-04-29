import { 
  users, type User, type InsertUser, 
  toys, type Toy, type InsertToy, 
  messages, type Message, type InsertMessage, 
  toyRequests, type ToyRequest, type InsertToyRequest, 
  favorites, type Favorite, type InsertFavorite, 
  contactMessages, type ContactMessage, type InsertContactMessage,
  groups, type Group, type InsertGroup,
  groupMembers, type GroupMember, type InsertGroupMember,
  follows, type Follow, type InsertFollow,
  reports, type Report, type InsertReport,
  meetupLocations, type MeetupLocation, type InsertMeetupLocation,
  toyHistories, type ToyHistory, type InsertToyHistory,
  safetyTips, type SafetyTip, type InsertSafetyTip,
  wishes, type Wish, type InsertWish,
  wishOffers, type WishOffer, type InsertWishOffer,
  BADGES 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { hashPassword } from "./auth";
// Fix SessionStore typing
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
// Interface for community metrics
export interface CommunityMetrics {
  toysSaved: number;
  familiesConnected: number;
  wasteReduced: number; // in kg
}

export interface IStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

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

  // Group CRUD
  getGroup(id: number): Promise<Group | undefined>;
  getGroups(filters?: Record<string, any>): Promise<Group[]>;
  getGroupsByUser(userId: number): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, group: Partial<Group>): Promise<Group | undefined>;
  deleteGroup(id: number): Promise<boolean>;
  joinGroup(userId: number, groupId: number, role?: string): Promise<GroupMember>;
  leaveGroup(userId: number, groupId: number): Promise<boolean>;
  getGroupMembers(groupId: number): Promise<GroupMember[]>;
  updateGroupMemberRole(userId: number, groupId: number, role: string): Promise<GroupMember | undefined>;

  // Follow system
  followUser(followerId: number, followingId: number): Promise<Follow>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number): Promise<Follow[]>;
  getFollowing(userId: number): Promise<Follow[]>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;

  // Report system
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReports(status?: string): Promise<Report[]>;
  getReportsByUser(userId: number): Promise<Report[]>;
  updateReportStatus(id: number, status: string, reviewedBy: number): Promise<Report | undefined>;

  // Meetup locations
  createMeetupLocation(location: InsertMeetupLocation): Promise<MeetupLocation>;
  getMeetupLocation(id: number): Promise<MeetupLocation | undefined>;
  getMeetupLocations(filters?: Record<string, any>): Promise<MeetupLocation[]>;
  getMeetupLocationsByUser(userId: number): Promise<MeetupLocation[]>;
  updateMeetupLocation(id: number, location: Partial<MeetupLocation>): Promise<MeetupLocation | undefined>;
  verifyMeetupLocation(id: number, isVerified: boolean): Promise<MeetupLocation | undefined>;

  // Toy history
  createToyHistory(history: InsertToyHistory): Promise<ToyHistory>;
  getToyHistoryByToy(toyId: number): Promise<ToyHistory[]>;
  addStoryToToyHistory(id: number, story: string, photos?: string[]): Promise<ToyHistory | undefined>;

  // Safety tips
  createSafetyTip(tip: InsertSafetyTip): Promise<SafetyTip>;
  getSafetyTip(id: number): Promise<SafetyTip | undefined>;
  getSafetyTipsByCategory(category: string): Promise<SafetyTip[]>;
  getAllSafetyTips(): Promise<SafetyTip[]>;
  updateSafetyTip(id: number, tip: Partial<SafetyTip>): Promise<SafetyTip | undefined>;

  // Community metrics
  getCommunityMetrics(): Promise<CommunityMetrics>;
  updateCommunityMetrics(metrics: Partial<CommunityMetrics>): Promise<CommunityMetrics>;

  // Wishes system
  getWish(id: number): Promise<Wish | undefined>;
  getWishes(filters?: Record<string, any>): Promise<Wish[]>;
  getWishesByUser(userId: number): Promise<Wish[]>;
  createWish(wish: InsertWish): Promise<Wish>;
  updateWish(id: number, wish: Partial<Wish>): Promise<Wish | undefined>;
  deleteWish(id: number): Promise<boolean>;

  // Wish offers system
  getWishOffer(id: number): Promise<WishOffer | undefined>;
  getWishOffersByWish(wishId: number): Promise<WishOffer[]>;
  createWishOffer(offer: InsertWishOffer): Promise<WishOffer>;
  updateWishOfferStatus(id: number, status: string): Promise<WishOffer | undefined>;
  
  // Password reset functionality
  savePasswordResetToken(userId: number, token: string, expiry: Date): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  updatePassword(userId: number, newPassword: string): Promise<User | undefined>;

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
  private communityMetrics: CommunityMetrics;
  
  // New storage maps for additional features
  private groupsMap: Map<number, Group>;
  private groupMembersMap: Map<number, GroupMember>;
  private followsMap: Map<number, Follow>;
  private reportsMap: Map<number, Report>;
  private meetupLocationsMap: Map<number, MeetupLocation>;
  private toyHistoriesMap: Map<number, ToyHistory>;
  private safetyTipsMap: Map<number, SafetyTip>;
  
  // Wish system storage maps
  private wishesMap: Map<number, Wish>;
  private wishOffersMap: Map<number, WishOffer>;
  
  private userCurrentId: number = 1;
  private toyCurrentId: number = 1;
  private messageCurrentId: number = 1;
  private toyRequestCurrentId: number = 1;
  private favoriteCurrentId: number = 1;
  private contactMessageCurrentId: number = 1;
  
  // New IDs for additional features
  private groupCurrentId: number = 1;
  private groupMemberCurrentId: number = 1;
  private followCurrentId: number = 1;
  private reportCurrentId: number = 1;
  private meetupLocationCurrentId: number = 1;
  private toyHistoryCurrentId: number = 1;
  private safetyTipCurrentId: number = 1;
  
  // Wish system IDs
  private wishCurrentId: number = 1;
  private wishOfferCurrentId: number = 1;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersMap = new Map();
    this.toysMap = new Map();
    this.messagesMap = new Map();
    this.toyRequestsMap = new Map();
    this.favoritesMap = new Map();
    this.contactMessagesMap = new Map();
    
    // Initialize new storage maps
    this.groupsMap = new Map();
    this.groupMembersMap = new Map();
    this.followsMap = new Map();
    this.reportsMap = new Map();
    this.meetupLocationsMap = new Map();
    this.toyHistoriesMap = new Map();
    this.safetyTipsMap = new Map();
    
    // Initialize wish system maps
    this.wishesMap = new Map();
    this.wishOffersMap = new Map();
    
    // Initialize community metrics
    this.communityMetrics = {
      toysSaved: 0,
      familiesConnected: 0,
      wasteReduced: 0
    };
    
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
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.googleId === googleId,
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
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
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
          // Check if the toy has ANY of the specified tags (OR logic)
          return filters.tags.some((tag: string) => 
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
        
        // Update community metrics
        await this.updateCommunityMetrics({
          toysSaved: this.communityMetrics.toysSaved + 1,
          familiesConnected: this.communityMetrics.familiesConnected + 1,
          wasteReduced: this.communityMetrics.wasteReduced + 2 // Assuming each toy is ~2kg of waste saved
        });
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
  
  // Meetup locations methods
  async createMeetupLocation(location: InsertMeetupLocation): Promise<MeetupLocation> {
    const id = this.meetupLocationCurrentId++;
    const createdAt = new Date();
    
    const newLocation: MeetupLocation = {
      ...location,
      id,
      createdAt,
      isVerified: false
    };
    
    this.meetupLocationsMap.set(id, newLocation);
    return newLocation;
  }
  
  async getMeetupLocation(id: number): Promise<MeetupLocation | undefined> {
    return this.meetupLocationsMap.get(id);
  }
  
  async getMeetupLocations(filters?: Record<string, any>): Promise<MeetupLocation[]> {
    let locations = Array.from(this.meetupLocationsMap.values());
    
    if (filters) {
      if (filters.city) {
        const searchCity = filters.city.toLowerCase();
        locations = locations.filter(location => 
          location.city.toLowerCase().includes(searchCity)
        );
      }
      
      if (filters.state) {
        const searchState = filters.state.toLowerCase();
        locations = locations.filter(location => 
          location.state.toLowerCase().includes(searchState)
        );
      }
      
      if (filters.locationType) {
        const searchType = filters.locationType.toLowerCase();
        locations = locations.filter(location => 
          location.locationType.toLowerCase().includes(searchType)
        );
      }
      
      if (filters.isVerified !== undefined) {
        locations = locations.filter(location => 
          location.isVerified === filters.isVerified
        );
      }
    }
    
    return locations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getMeetupLocationsByUser(userId: number): Promise<MeetupLocation[]> {
    return Array.from(this.meetupLocationsMap.values())
      .filter(location => location.addedBy === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateMeetupLocation(id: number, updates: Partial<MeetupLocation>): Promise<MeetupLocation | undefined> {
    const location = this.meetupLocationsMap.get(id);
    if (!location) return undefined;
    
    const updatedLocation = { ...location, ...updates };
    this.meetupLocationsMap.set(id, updatedLocation);
    return updatedLocation;
  }
  
  async verifyMeetupLocation(id: number, isVerified: boolean): Promise<MeetupLocation | undefined> {
    const location = this.meetupLocationsMap.get(id);
    if (!location) return undefined;
    
    const updatedLocation = { ...location, isVerified };
    this.meetupLocationsMap.set(id, updatedLocation);
    return updatedLocation;
  }
  
  // Toy history methods
  async createToyHistory(history: InsertToyHistory): Promise<ToyHistory> {
    const id = this.toyHistoryCurrentId++;
    const transferDate = new Date();
    
    const newHistory: ToyHistory = {
      ...history,
      id,
      transferDate,
      photos: history.photos || []
    };
    
    this.toyHistoriesMap.set(id, newHistory);
    return newHistory;
  }
  
  async getToyHistoryByToy(toyId: number): Promise<ToyHistory[]> {
    return Array.from(this.toyHistoriesMap.values())
      .filter(history => history.toyId === toyId)
      .sort((a, b) => b.transferDate.getTime() - a.transferDate.getTime());
  }
  
  async addStoryToToyHistory(id: number, story: string, photos?: string[]): Promise<ToyHistory | undefined> {
    const history = this.toyHistoriesMap.get(id);
    if (!history) return undefined;
    
    const updatedPhotos = [...(history.photos || [])];
    if (photos && photos.length > 0) {
      updatedPhotos.push(...photos);
    }
    
    const updatedHistory = { ...history, story, photos: updatedPhotos };
    this.toyHistoriesMap.set(id, updatedHistory);
    return updatedHistory;
  }
  
  // Safety tips methods
  async createSafetyTip(tip: InsertSafetyTip): Promise<SafetyTip> {
    const id = this.safetyTipCurrentId++;
    const createdAt = new Date();
    
    const newTip: SafetyTip = {
      ...tip,
      id,
      createdAt,
      updatedAt: createdAt
    };
    
    this.safetyTipsMap.set(id, newTip);
    return newTip;
  }
  
  async getSafetyTip(id: number): Promise<SafetyTip | undefined> {
    return this.safetyTipsMap.get(id);
  }
  
  async getSafetyTipsByCategory(category: string): Promise<SafetyTip[]> {
    return Array.from(this.safetyTipsMap.values())
      .filter(tip => tip.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getAllSafetyTips(): Promise<SafetyTip[]> {
    return Array.from(this.safetyTipsMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateSafetyTip(id: number, updates: Partial<SafetyTip>): Promise<SafetyTip | undefined> {
    const tip = this.safetyTipsMap.get(id);
    if (!tip) return undefined;
    
    const updatedTip = { 
      ...tip, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.safetyTipsMap.set(id, updatedTip);
    return updatedTip;
  }
  
  // Community metrics methods
  async getCommunityMetrics(): Promise<CommunityMetrics> {
    return { ...this.communityMetrics };
  }
  
  async updateCommunityMetrics(metrics: Partial<CommunityMetrics>): Promise<CommunityMetrics> {
    this.communityMetrics = {
      ...this.communityMetrics,
      ...metrics
    };
    return this.communityMetrics;
  }

  // Wish CRUD methods
  async getWish(id: number): Promise<Wish | undefined> {
    return this.wishesMap.get(id);
  }

  async getWishes(filters?: Record<string, any>): Promise<Wish[]> {
    let wishes = Array.from(this.wishesMap.values());
    
    if (filters) {
      if (filters.location && filters.location !== "any") {
        wishes = wishes.filter(wish => wish.location === filters.location);
      }
      if (filters.ageRange && filters.ageRange !== "any") {
        wishes = wishes.filter(wish => wish.ageRange === filters.ageRange);
      }
      if (filters.category && filters.category !== "any") {
        wishes = wishes.filter(wish => wish.category === filters.category);
      }
      
      // Filter by status (pending, fulfilled, etc.)
      if (filters.status) {
        wishes = wishes.filter(wish => wish.status === filters.status);
      } else {
        // By default, only return pending wishes
        wishes = wishes.filter(wish => wish.status === "pending");
      }
      
      // Filter by search term (title, description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        wishes = wishes.filter(wish => {
          const wishTags = Array.isArray(wish.tags) ? wish.tags : [];
          const matchInTags = wishTags.some(tag => 
            tag.toLowerCase().includes(searchLower)
          );
          
          return wish.title.toLowerCase().includes(searchLower) || 
                 wish.description.toLowerCase().includes(searchLower) ||
                 matchInTags;
        });
      }
    }
    
    // Sort by newest first (default)
    return wishes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getWishesByUser(userId: number): Promise<Wish[]> {
    return Array.from(this.wishesMap.values())
      .filter(wish => wish.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const id = this.wishCurrentId++;
    const createdAt = new Date();
    
    // Ensure tags is an array
    const tags = Array.isArray(insertWish.tags) ? insertWish.tags : [];
    
    // Set default status to pending
    const status = insertWish.status || "pending";
    
    const wish: Wish = { 
      ...insertWish, 
      id, 
      createdAt,
      tags,
      status
    };
    
    this.wishesMap.set(id, wish);
    return wish;
  }

  async updateWish(id: number, updates: Partial<Wish>): Promise<Wish | undefined> {
    const wish = this.wishesMap.get(id);
    if (!wish) return undefined;
    
    const updatedWish = { ...wish, ...updates };
    this.wishesMap.set(id, updatedWish);
    return updatedWish;
  }

  async deleteWish(id: number): Promise<boolean> {
    return this.wishesMap.delete(id);
  }

  // Wish Offer CRUD methods
  async getWishOffer(id: number): Promise<WishOffer | undefined> {
    return this.wishOffersMap.get(id);
  }

  async getWishOffersByWish(wishId: number): Promise<WishOffer[]> {
    return Array.from(this.wishOffersMap.values())
      .filter(offer => offer.wishId === wishId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createWishOffer(insertOffer: InsertWishOffer): Promise<WishOffer> {
    const id = this.wishOfferCurrentId++;
    const createdAt = new Date();
    
    // Ensure status is set (default to pending if not provided)
    const status = insertOffer.status || "pending";
    
    const offer: WishOffer = { 
      ...insertOffer, 
      id, 
      createdAt,
      status
    };
    
    this.wishOffersMap.set(id, offer);
    return offer;
  }

  async updateWishOfferStatus(id: number, status: string): Promise<WishOffer | undefined> {
    const offer = this.wishOffersMap.get(id);
    if (!offer) return undefined;
    
    const updatedOffer = { ...offer, status };
    this.wishOffersMap.set(id, updatedOffer);
    
    // If the offer is accepted, update the user's sustainability metrics
    if (status === 'accepted') {
      // Update offerer's sustainability metrics (shared a toy for a wish)
      await updateUserSustainabilityMetrics(this, offer.offererId, { 
        toysSharedIncrement: 1,
        successfulExchangesIncrement: 1 
      });
      
      // Update wish creator's sustainability metrics (received a toy)
      const wish = await this.getWish(offer.wishId);
      if (wish) {
        await updateUserSustainabilityMetrics(this, wish.userId, { 
          successfulExchangesIncrement: 1 
        });
        
        // Update community metrics
        await this.updateCommunityMetrics({
          toysSaved: this.communityMetrics.toysSaved + 1,
          familiesConnected: this.communityMetrics.familiesConnected + 1,
          wasteReduced: this.communityMetrics.wasteReduced + 2 // Assuming each toy is ~2kg of waste saved
        });
      }
    }
    
    return updatedOffer;
  }
  
  // Password reset functionality
  async savePasswordResetToken(userId: number, token: string, expiry: Date): Promise<User | undefined> {
    const user = this.usersMap.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      resetToken: token, 
      resetTokenExpiry: expiry 
    };
    
    this.usersMap.set(userId, updatedUser);
    return updatedUser;
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.resetToken === token
    );
  }
  
  async updatePassword(userId: number, newPassword: string): Promise<User | undefined> {
    const user = this.usersMap.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      password: newPassword,
      // Clear the reset token and expiry
      resetToken: null,
      resetTokenExpiry: null
    };
    
    this.usersMap.set(userId, updatedUser);
    return updatedUser;
  }
}

// Import DatabaseStorage from new file
import { DatabaseStorage } from "./database-storage";
import { db, pool } from "./db";

// Choose the appropriate storage implementation based on database availability
let storage: IStorage;

// If we have a database connection, use DatabaseStorage, otherwise fall back to MemStorage
if (pool) {
  console.log("Using persistent database storage");
  storage = new DatabaseStorage();
} else {
  console.warn("DATABASE_URL not found or invalid. Using in-memory storage.");
  storage = new MemStorage();
}

export { storage };
