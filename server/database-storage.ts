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
  BADGES 
} from "@shared/schema";
import session from "express-session";
import { IStorage, CommunityMetrics, MemStorage } from "./storage";
import { db, pool, initDatabase } from "./db";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { hashPassword } from "./auth";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);

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

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  private communityMetrics: CommunityMetrics = {
    toysSaved: 0,
    familiesConnected: 0,
    wasteReduced: 0
  };

  constructor() {
    // Check if we have a database connection
    if (pool) {
      // If we have a database connection, use PostgreSQL for session storage
      this.sessionStore = new PostgresSessionStore({ 
        pool, 
        createTableIfMissing: true,
        // Additional error handling
        errorLog: (error) => console.error('PostgreSQL session store error:', error)
      });
      
      // Initialize admin user in the database
      setTimeout(() => this.initAdminUser(), 100);
    } else {
      // If no database connection is available, fall back to memory store
      console.warn("No database connection available. Using in-memory session store instead.");
      const MemoryStore = createMemoryStore(session);
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000, // 24 hours
      });
    }
  }

  private async initAdminUser() {
    try {
      // Check if regular admin exists
      const adminSreyas = await this.getUserByUsername("adminsreyas");
      
      if (!adminSreyas) {
        console.log('Creating admin user: adminsreyas');
        
        // Hash password
        const hashedPassword = await hashPassword("Jell1boi!!");
        
        // Create admin user
        const adminUser = await this.createUser({
          username: "adminsreyas",
          password: hashedPassword,
          email: "admin@toyshare.com",
          name: "ToyShare Admin",
          location: "Admin Headquarters",
          profilePicture: null
        });
        
        // Update admin with sustainability data
        await this.updateUser(adminUser.id, {
          toysShared: 50,
          successfulExchanges: 20,
          sustainabilityScore: 130,
          currentBadge: BADGES.PLANET_PROTECTOR.name
        });
        
        console.log('Admin user (adminsreyas) created successfully');
      }
      
      // Check if konami code admin exists
      const konamiAdmin = await this.getUserByUsername("admin");
      
      if (!konamiAdmin) {
        console.log('Creating Konami code admin user: admin');
        
        // Hash password for Konami code admin
        const hashedPassword = await hashPassword("toyshare@admin");
        
        // Create Konami code admin user
        const adminUser = await this.createUser({
          username: "admin",
          password: hashedPassword,
          email: "konami@toyshare.com",
          name: "ToyShare Secret Admin",
          location: "Easter Egg Headquarters",
          profilePicture: null
        });
        
        // Update Konami admin with sustainability data
        await this.updateUser(adminUser.id, {
          toysShared: 100,
          successfulExchanges: 50,
          sustainabilityScore: 200,
          currentBadge: BADGES.PLANET_PROTECTOR.name
        });
        
        console.log('Konami code admin user created successfully');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }

  // ==================== User CRUD Methods ====================
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      createdAt: new Date(),
      toysShared: 0,
      successfulExchanges: 0,
      sustainabilityScore: 0,
      currentBadge: BADGES.NEWCOMER.name
    }).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // ==================== Toy CRUD Methods ====================
  async getToy(id: number): Promise<Toy | undefined> {
    const [toy] = await db.select().from(toys).where(eq(toys.id, id));
    return toy;
  }

  async getToys(filters?: Record<string, any>): Promise<Toy[]> {
    let query = db.select().from(toys).orderBy(desc(toys.createdAt));
    
    if (filters) {
      if (filters.location && filters.location !== "any") {
        query = query.where(eq(toys.location, filters.location));
      }
      
      if (filters.category && filters.category !== "all") {
        query = query.where(eq(toys.category, filters.category));
      }
      
      if (filters.condition && filters.condition !== "all") {
        query = query.where(eq(toys.condition, filters.condition));
      }
      
      if (filters.ageRange && filters.ageRange !== "all") {
        query = query.where(eq(toys.ageRange, filters.ageRange));
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // This is a simplification - for proper tag filtering you'd need a more sophisticated approach
        // Ideally with a JOIN if tags were in a separate table
        // For now, we're simulating an "OR" query across tags
        // Note: This won't work properly as-is and would need to be adjusted based on your schema
      }
    }
    
    return query;
  }

  async getToysByUser(userId: number): Promise<Toy[]> {
    return db.select()
      .from(toys)
      .where(eq(toys.userId, userId))
      .orderBy(desc(toys.createdAt));
  }

  async createToy(insertToy: InsertToy): Promise<Toy> {
    const [toy] = await db.insert(toys)
      .values({
        ...insertToy,
        createdAt: new Date(),
      })
      .returning();
    
    // Update user sustainability metrics when they share a toy
    await updateUserSustainabilityMetrics(this, insertToy.userId, { toysSharedIncrement: 1 });
    
    // Update community metrics
    const metrics = await this.getCommunityMetrics();
    await this.updateCommunityMetrics({
      toysSaved: metrics.toysSaved + 1,
      wasteReduced: metrics.wasteReduced + 0.5 // Assuming each toy saves 0.5kg of waste
    });
    
    return toy;
  }

  async updateToy(id: number, updates: Partial<Toy>): Promise<Toy | undefined> {
    const [updatedToy] = await db.update(toys)
      .set(updates)
      .where(eq(toys.id, id))
      .returning();
    return updatedToy;
  }

  async deleteToy(id: number): Promise<boolean> {
    const [deletedToy] = await db.delete(toys)
      .where(eq(toys.id, id))
      .returning();
    return !!deletedToy;
  }

  // ==================== Message CRUD Methods ====================
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(sql`${messages.senderId} = ${userId} OR ${messages.receiverId} = ${userId}`)
      .orderBy(desc(messages.createdAt));
  }

  async getMessagesBetweenUsers(senderId: number, receiverId: number): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(
        sql`(${messages.senderId} = ${senderId} AND ${messages.receiverId} = ${receiverId}) OR 
            (${messages.senderId} = ${receiverId} AND ${messages.receiverId} = ${senderId})`
      )
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
        read: false
      })
      .returning();
    return message;
  }

  async updateMessageRead(id: number, read: boolean): Promise<Message | undefined> {
    const [updatedMessage] = await db.update(messages)
      .set({ read })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  // ==================== ToyRequest CRUD Methods ====================
  async getToyRequest(id: number): Promise<ToyRequest | undefined> {
    const [request] = await db.select()
      .from(toyRequests)
      .where(eq(toyRequests.id, id));
    return request;
  }

  async getToyRequestsByToy(toyId: number): Promise<ToyRequest[]> {
    return db.select()
      .from(toyRequests)
      .where(eq(toyRequests.toyId, toyId))
      .orderBy(desc(toyRequests.createdAt));
  }

  async getToyRequestsByRequester(requesterId: number): Promise<ToyRequest[]> {
    return db.select()
      .from(toyRequests)
      .where(eq(toyRequests.requesterId, requesterId))
      .orderBy(desc(toyRequests.createdAt));
  }

  async getToyRequestsByOwner(ownerId: number): Promise<ToyRequest[]> {
    return db.select()
      .from(toyRequests)
      .where(eq(toyRequests.ownerId, ownerId))
      .orderBy(desc(toyRequests.createdAt));
  }

  async createToyRequest(insertToyRequest: InsertToyRequest): Promise<ToyRequest> {
    const [request] = await db.insert(toyRequests)
      .values({
        ...insertToyRequest,
        status: "pending",
        createdAt: new Date()
      })
      .returning();
    return request;
  }

  async updateToyRequestStatus(id: number, status: string): Promise<ToyRequest | undefined> {
    const [request] = await db.update(toyRequests)
      .set({ status })
      .where(eq(toyRequests.id, id))
      .returning();
    
    if (request && status === "completed") {
      // Update both users' sustainability metrics when a toy exchange is completed
      await updateUserSustainabilityMetrics(this, request.ownerId, { successfulExchangesIncrement: 1 });
      await updateUserSustainabilityMetrics(this, request.requesterId, { successfulExchangesIncrement: 1 });
      
      // Update community metrics
      const metrics = await this.getCommunityMetrics();
      await this.updateCommunityMetrics({
        familiesConnected: metrics.familiesConnected + 1
      });
    }
    
    return request;
  }

  // ==================== Favorite CRUD Methods ====================
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select()
      .from(favorites)
      .where(eq(favorites.id, id));
    return favorite;
  }

  async getFavoriteByUserAndToy(userId: number, toyId: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.toyId, toyId)
      ));
    return favorite;
  }

  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return db.select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites)
      .values({
        ...insertFavorite,
        createdAt: new Date()
      })
      .returning();
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const [deletedFavorite] = await db.delete(favorites)
      .where(eq(favorites.id, id))
      .returning();
    return !!deletedFavorite;
  }

  // ==================== ContactMessage CRUD Methods ====================
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages)
      .values({
        ...insertContactMessage,
        createdAt: new Date()
      })
      .returning();
    return message;
  }

  // ==================== Groups CRUD Methods ====================
  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select()
      .from(groups)
      .where(eq(groups.id, id));
    return group;
  }

  async getGroups(filters?: Record<string, any>): Promise<Group[]> {
    let query = db.select().from(groups);
    
    if (filters) {
      if (filters.category) {
        query = query.where(eq(groups.category, filters.category));
      }
      if (filters.location) {
        query = query.where(eq(groups.location, filters.location));
      }
    }
    
    return query.orderBy(desc(groups.createdAt));
  }

  async getGroupsByUser(userId: number): Promise<Group[]> {
    // This would need a join with groupMembers table
    const members = await db.select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    const groupIds = members.map(m => m.groupId);
    
    if (groupIds.length === 0) return [];
    
    return db.select()
      .from(groups)
      .where(sql`${groups.id} IN (${groupIds.join(',')})`);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups)
      .values({
        ...group,
        createdAt: new Date()
      })
      .returning();
    return newGroup;
  }

  async updateGroup(id: number, updates: Partial<Group>): Promise<Group | undefined> {
    const [updatedGroup] = await db.update(groups)
      .set(updates)
      .where(eq(groups.id, id))
      .returning();
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    // First delete all members
    await db.delete(groupMembers)
      .where(eq(groupMembers.groupId, id));
    
    // Then delete the group
    const [deletedGroup] = await db.delete(groups)
      .where(eq(groups.id, id))
      .returning();
    return !!deletedGroup;
  }

  async joinGroup(userId: number, groupId: number, role: string = "member"): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers)
      .values({
        userId,
        groupId,
        role,
        joinedAt: new Date()
      })
      .returning();
    return member;
  }

  async leaveGroup(userId: number, groupId: number): Promise<boolean> {
    const [deletedMember] = await db.delete(groupMembers)
      .where(and(
        eq(groupMembers.userId, userId),
        eq(groupMembers.groupId, groupId)
      ))
      .returning();
    return !!deletedMember;
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return db.select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
  }

  async updateGroupMemberRole(userId: number, groupId: number, role: string): Promise<GroupMember | undefined> {
    const [updatedMember] = await db.update(groupMembers)
      .set({ role })
      .where(and(
        eq(groupMembers.userId, userId),
        eq(groupMembers.groupId, groupId)
      ))
      .returning();
    return updatedMember;
  }

  // ==================== Follow System Methods ====================
  async followUser(followerId: number, followingId: number): Promise<Follow> {
    const [follow] = await db.insert(follows)
      .values({
        followerId,
        followingId,
        createdAt: new Date()
      })
      .returning();
    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const [deletedFollow] = await db.delete(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ))
      .returning();
    return !!deletedFollow;
  }

  async getFollowers(userId: number): Promise<Follow[]> {
    return db.select()
      .from(follows)
      .where(eq(follows.followingId, userId));
  }

  async getFollowing(userId: number): Promise<Follow[]> {
    return db.select()
      .from(follows)
      .where(eq(follows.followerId, userId));
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [follow] = await db.select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
    return !!follow;
  }

  // ==================== Report System Methods ====================
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports)
      .values({
        ...report,
        status: "pending",
        createdAt: new Date()
      })
      .returning();
    return newReport;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select()
      .from(reports)
      .where(eq(reports.id, id));
    return report;
  }

  async getReports(status?: string): Promise<Report[]> {
    let query = db.select().from(reports);
    
    if (status) {
      query = query.where(eq(reports.status, status));
    }
    
    return query.orderBy(desc(reports.createdAt));
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return db.select()
      .from(reports)
      .where(eq(reports.reportedBy, userId))
      .orderBy(desc(reports.createdAt));
  }

  async updateReportStatus(id: number, status: string, reviewedBy: number): Promise<Report | undefined> {
    const [updatedReport] = await db.update(reports)
      .set({ 
        status, 
        reviewedBy,
        reviewedAt: new Date()
      })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  // ==================== Meetup Location Methods ====================
  async createMeetupLocation(location: InsertMeetupLocation): Promise<MeetupLocation> {
    const [meetupLocation] = await db.insert(meetupLocations)
      .values({
        ...location,
        isVerified: false,
        createdAt: new Date()
      })
      .returning();
    return meetupLocation;
  }

  async getMeetupLocation(id: number): Promise<MeetupLocation | undefined> {
    const [location] = await db.select()
      .from(meetupLocations)
      .where(eq(meetupLocations.id, id));
    return location;
  }

  async getMeetupLocations(filters?: Record<string, any>): Promise<MeetupLocation[]> {
    let query = db.select().from(meetupLocations);
    
    if (filters) {
      if (filters.city) {
        query = query.where(eq(meetupLocations.city, filters.city));
      }
      if (filters.state) {
        query = query.where(eq(meetupLocations.state, filters.state));
      }
      if (filters.locationType) {
        query = query.where(eq(meetupLocations.locationType, filters.locationType));
      }
    }
    
    return query.orderBy(desc(meetupLocations.createdAt));
  }

  async getMeetupLocationsByUser(userId: number): Promise<MeetupLocation[]> {
    return db.select()
      .from(meetupLocations)
      .where(eq(meetupLocations.addedBy, userId))
      .orderBy(desc(meetupLocations.createdAt));
  }

  async updateMeetupLocation(id: number, updates: Partial<MeetupLocation>): Promise<MeetupLocation | undefined> {
    const [updatedLocation] = await db.update(meetupLocations)
      .set(updates)
      .where(eq(meetupLocations.id, id))
      .returning();
    return updatedLocation;
  }

  async verifyMeetupLocation(id: number, isVerified: boolean): Promise<MeetupLocation | undefined> {
    const [verifiedLocation] = await db.update(meetupLocations)
      .set({ isVerified })
      .where(eq(meetupLocations.id, id))
      .returning();
    return verifiedLocation;
  }

  // ==================== Toy History Methods ====================
  async createToyHistory(history: InsertToyHistory): Promise<ToyHistory> {
    const [toyHistory] = await db.insert(toyHistories)
      .values({
        ...history,
        createdAt: new Date()
      })
      .returning();
    return toyHistory;
  }

  async getToyHistoryByToy(toyId: number): Promise<ToyHistory[]> {
    return db.select()
      .from(toyHistories)
      .where(eq(toyHistories.toyId, toyId))
      .orderBy(desc(toyHistories.transferDate));
  }

  async addStoryToToyHistory(id: number, story: string, photos?: string[]): Promise<ToyHistory | undefined> {
    const [updatedHistory] = await db.update(toyHistories)
      .set({ 
        story,
        photos: photos || []
      })
      .where(eq(toyHistories.id, id))
      .returning();
    return updatedHistory;
  }

  // ==================== Safety Tips Methods ====================
  async createSafetyTip(tip: InsertSafetyTip): Promise<SafetyTip> {
    const [safetyTip] = await db.insert(safetyTips)
      .values({
        ...tip,
        createdAt: new Date()
      })
      .returning();
    return safetyTip;
  }

  async getSafetyTip(id: number): Promise<SafetyTip | undefined> {
    const [tip] = await db.select()
      .from(safetyTips)
      .where(eq(safetyTips.id, id));
    return tip;
  }

  async getSafetyTipsByCategory(category: string): Promise<SafetyTip[]> {
    return db.select()
      .from(safetyTips)
      .where(eq(safetyTips.category, category))
      .orderBy(desc(safetyTips.createdAt));
  }

  async getAllSafetyTips(): Promise<SafetyTip[]> {
    return db.select()
      .from(safetyTips)
      .orderBy(desc(safetyTips.createdAt));
  }

  async updateSafetyTip(id: number, updates: Partial<SafetyTip>): Promise<SafetyTip | undefined> {
    const [updatedTip] = await db.update(safetyTips)
      .set(updates)
      .where(eq(safetyTips.id, id))
      .returning();
    return updatedTip;
  }

  // ==================== Community Metrics Methods ====================
  async getCommunityMetrics(): Promise<CommunityMetrics> {
    return this.communityMetrics;
  }

  async updateCommunityMetrics(metrics: Partial<CommunityMetrics>): Promise<CommunityMetrics> {
    this.communityMetrics = {
      ...this.communityMetrics,
      ...metrics
    };
    return this.communityMetrics;
  }
}