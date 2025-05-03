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
  userBlocks, type UserBlock, type InsertUserBlock,
  userMutes, type UserMute, type InsertUserMute,
  BADGES 
} from "@shared/schema";
import session from "express-session";
import { IStorage, CommunityMetrics, MemStorage } from "./storage";
import { db, pool, initDatabase } from "./db";
import { eq, and, desc, sql, asc, or, inArray, like, not } from "drizzle-orm";
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
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
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
  
  async deleteUser(id: number): Promise<boolean> {
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    return !!deletedUser;
  }

  // ==================== Toy CRUD Methods ====================
  async getToy(id: number): Promise<Toy | undefined> {
    const [toy] = await db.select().from(toys).where(eq(toys.id, id));
    return toy;
  }

  async getToys(filters?: Record<string, any>): Promise<Toy[]> {
    let query = db.select().from(toys).orderBy(desc(toys.createdAt));
    
    if (filters) {
      // We'll remove the direct location filtering by address/string
      // since we're moving to proper radius-based filtering instead
      // Location will now be filtered in post-processing using distance calculation
      
      // We'll keep this block commented for reference
      /*
      if (filters.location && Array.isArray(filters.location) && filters.location.length > 0) {
        console.log(`Filtering toys by multiple locations:`, filters.location);
        query = query.where(
          inArray(toys.location, filters.location)
        );
      } else if (filters.location && typeof filters.location === 'string' && filters.location !== "any") {
        console.log(`Filtering toys by single location:`, filters.location);
        query = query.where(eq(toys.location, filters.location));
      }
      */
      
      // Category filter with array support
      // Category filter removed
      
      // Condition filter with array support
      if (filters.condition && Array.isArray(filters.condition) && filters.condition.length > 0) {
        query = query.where(
          inArray(toys.condition, filters.condition)
        );
      } else if (filters.condition && typeof filters.condition === 'string' && filters.condition !== "all") {
        query = query.where(eq(toys.condition, filters.condition));
      }
      
      // Age range filter with array support
      if (filters.ageRange && Array.isArray(filters.ageRange) && filters.ageRange.length > 0) {
        query = query.where(
          inArray(toys.ageRange, filters.ageRange)
        );
      } else if (filters.ageRange && typeof filters.ageRange === 'string' && filters.ageRange !== "all") {
        query = query.where(eq(toys.ageRange, filters.ageRange));
      }
      
      // Search filter - enhanced to search title, description, and tags with scoring
      if (filters.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
        const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
        const searchTermExact = filters.search.trim().toLowerCase();
        const searchWords = searchTermExact.split(/\s+/).filter(word => word.length > 1);
        
        // Improved search that checks the title, description, and if the search term is in any tag
        query = query.where(
          or(
            // Check title with LIKE for partial and exact matches
            like(sql`LOWER(${toys.title})`, searchTerm),
            // Check if title has exact word matches for more accuracy
            ...searchWords.map(word => like(sql`LOWER(${toys.title})`, `%${word}%`)),
            
            // Check description with LIKE for partial matches
            like(sql`LOWER(${toys.description})`, searchTerm),
            
            // Category search removed
            
            // Check if any tag contains the search term or search words
            sql`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${toys.tags}::jsonb) tag 
              WHERE LOWER(tag) LIKE ${searchTerm} OR ${
                // Dynamically build an OR condition for each search word
                sql.raw(searchWords.map(word => `LOWER(tag) LIKE '%${word}%'`).join(' OR '))
              }
            )`
          )
        );
        
        // Ordering by relevance
        // This orders the results with exact title matches first, followed by tag matches, then description matches
        query = query.orderBy(
          sql`
            CASE
              WHEN LOWER(${toys.title}) = ${searchTermExact} THEN 1
              WHEN LOWER(${toys.title}) LIKE ${`${searchTermExact}%`} THEN 2
              WHEN EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(${toys.tags}::jsonb) tag 
                WHERE LOWER(tag) = ${searchTermExact}
              ) THEN 3
              WHEN LOWER(${toys.description}) LIKE ${`%${searchTermExact}%`} THEN 4
              ELSE 6
            END ASC,
            ${toys.createdAt} DESC
          `
        );
      }
      
      // Tags filter - we use OR logic for tags (any toy matching ANY of the tags)
      if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
        const tagConditions = filters.tags.map(tag => 
          sql`${toys.tags}::jsonb @> ${JSON.stringify([tag])}::jsonb`
        );
        
        if (tagConditions.length > 0) {
          query = query.where(or(...tagConditions));
        }
      }
      
      // Filter out toys from blocked users
      if (filters.excludeUserIds && Array.isArray(filters.excludeUserIds) && filters.excludeUserIds.length > 0) {
        query = query.where(
          not(inArray(toys.userId, filters.excludeUserIds))
        );
      }

      // Distance filter - we'll need to do post-processing for this
      // since it requires calculating distances between points
    }
    
    let result = await query;
    
    // If we need to filter by distance
    if (filters && 
        filters.distance && 
        filters.latitude && 
        filters.longitude && 
        typeof filters.distance === 'number' && 
        filters.distance > 0) {
      
      console.log(`Filtering by distance: ${filters.distance} miles from lat:${filters.latitude}, lng:${filters.longitude}`, { numToys: result.length });
      
      // Add distance property to each toy and filter by distance
      const toysWithDistance = result.map((toy: any) => {
        if (!toy.latitude || !toy.longitude) {
          console.log(`Toy ${toy.id} (${toy.title}) has no coordinates, skipping distance calculation`);
          return { ...toy, distance: null };
        }
        
        // Calculate the distance between the two points using the Haversine formula
        const distance = this.calculateDistance(
          parseFloat(filters.latitude), 
          parseFloat(filters.longitude),
          parseFloat(toy.latitude), 
          parseFloat(toy.longitude)
        );
        
        console.log(`Toy ${toy.id} (${toy.title}) is ${distance.toFixed(2)} miles from the reference point`);
        
        // Add the distance to the toy object
        return { ...toy, distance };
      });
      
      // Filter by distance
      result = toysWithDistance.filter((toy: any) => {
        // Since the toy database is new, many toys might not have coordinates yet
        // Since strict location filtering is required, toys without coordinates
        // should be excluded from location-based results
        if (toy.distance === null) {
          console.log(`Toy ${toy.id} (${toy.title}) has missing coordinates and will be excluded from location-based results`);
          
          // Never include toys without coordinates when filtering by location
          return false;
        }
        
        const withinRange = toy.distance <= filters.distance;
        if (!withinRange) {
          console.log(`Toy ${toy.id} (${toy.title}) excluded: ${toy.distance.toFixed(2)} miles > ${filters.distance} miles limit`);
        } else {
          console.log(`Toy ${toy.id} (${toy.title}) included: ${toy.distance.toFixed(2)} miles <= ${filters.distance} miles limit`);
        }
        
        return withinRange;
      });
    }
    
    return result;
  }
  
  // Helper function to calculate distance between two points using the Haversine formula
  private calculateDistance(lat1: number | string, lon1: number | string, lat2: number | string, lon2: number | string): number {
    // Convert all coordinates to numbers if they are strings
    const latUser = typeof lat1 === 'string' ? parseFloat(lat1) : lat1;
    const lonUser = typeof lon1 === 'string' ? parseFloat(lon1) : lon1;
    const latToy = typeof lat2 === 'string' ? parseFloat(lat2) : lat2;
    const lonToy = typeof lon2 === 'string' ? parseFloat(lon2) : lon2;
    
    // Check for null, undefined or NaN values
    if (latUser === null || lonUser === null || latToy === null || lonToy === null ||
        latUser === undefined || lonUser === undefined || latToy === undefined || lonToy === undefined ||
        isNaN(latUser) || isNaN(lonUser) || isNaN(latToy) || isNaN(lonToy)) {
      console.error("Invalid coordinate values:", { latUser, lonUser, latToy, lonToy });
      return Number.MAX_VALUE; // Return a very large distance so this toy won't be included in distance filters
    }
    
    // Validate coordinates are in reasonable ranges
    if (Math.abs(latUser) > 90 || Math.abs(latToy) > 90 || Math.abs(lonUser) > 180 || Math.abs(lonToy) > 180) {
      console.error("Coordinate values out of range:", { latUser, lonUser, latToy, lonToy });
      return Number.MAX_VALUE;
    }
    
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = this.deg2rad(latToy - latUser);
    const dLon = this.deg2rad(lonToy - lonUser);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(latUser)) * Math.cos(this.deg2rad(latToy)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in miles
    
    // A sanity check in case the calculation somehow produces NaN or Infinity
    if (isNaN(distance) || !isFinite(distance)) {
      console.error("Distance calculation failed:", { latUser, lonUser, latToy, lonToy, result: distance });
      return Number.MAX_VALUE;
    }
    
    console.log(`Distance calculation: ${distance.toFixed(2)} miles between [${latUser}, ${lonUser}] and [${latToy}, ${lonToy}]`);
    return distance;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  async getToysByUser(userId: number): Promise<Toy[]> {
    try {
      console.log(`Getting toys for user ID: ${userId}`);
      const result = await db.select()
        .from(toys)
        .where(eq(toys.userId, userId))
        .orderBy(desc(toys.createdAt));
      
      console.log(`Retrieved ${result.length} toys for user ${userId}`);
      return result;
    } catch (error) {
      console.error(`Error in getToysByUser(${userId}):`, error);
      // Return empty array instead of throwing to avoid breaking the client
      return [];
    }
  }

  async createToy(insertToy: InsertToy): Promise<Toy> {
    // Remove any potential soldDate field since it's causing validation issues
    const { soldDate, ...cleanToyData } = insertToy as any;

    // Ensure coordinates are stored as strings
    if (cleanToyData.latitude !== null && typeof cleanToyData.latitude !== 'string') {
      cleanToyData.latitude = String(cleanToyData.latitude);
    }
    if (cleanToyData.longitude !== null && typeof cleanToyData.longitude !== 'string') {
      cleanToyData.longitude = String(cleanToyData.longitude);
    }
    
    console.log("Creating toy with data:", cleanToyData);
    
    const [toy] = await db.insert(toys)
      .values({
        ...cleanToyData,
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
    // First get the toy to identify the owner
    const toy = await this.getToy(id);
    if (!toy) return false;
    
    const [deletedToy] = await db.delete(toys)
      .where(eq(toys.id, id))
      .returning();
    
    if (deletedToy) {
      // Decrement the user's toysShared count
      await updateUserSustainabilityMetrics(this, toy.userId, { toysSharedIncrement: -1 });
      
      // Update community metrics
      const metrics = await this.getCommunityMetrics();
      await this.updateCommunityMetrics({
        toysSaved: metrics.toysSaved - 1,
        wasteReduced: metrics.wasteReduced - 0.5 // Adjust waste reduction by same amount used when creating
      });
    }
    
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
  
  async deleteMessage(id: number): Promise<boolean> {
    try {
      const result = await db.delete(messages)
        .where(eq(messages.id, id));
      
      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }
  
  async deleteConversation(userId: number, otherUserId: number): Promise<boolean> {
    try {
      await db.delete(messages)
        .where(
          or(
            and(
              eq(messages.senderId, userId),
              eq(messages.receiverId, otherUserId)
            ),
            and(
              eq(messages.senderId, otherUserId),
              eq(messages.receiverId, userId)
            )
          )
        );
      
      return true;
    } catch (error) {
      console.error("Error deleting conversation:", error);
      return false;
    }
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
      // Group category filtering removed
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
    
    const groupIds = members.map((member: {groupId: number}) => member.groupId);
    
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
      .where(eq(reports.reporterId, userId))
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

  // ==================== Wish CRUD Methods ====================
  async getWish(id: number): Promise<Wish | undefined> {
    const [wish] = await db.select().from(wishes).where(eq(wishes.id, id));
    return wish;
  }

  async getWishes(filters?: Record<string, any>): Promise<Wish[]> {
    let query = db.select().from(wishes).orderBy(desc(wishes.createdAt));
    
    if (filters) {
      // Location filter with array support
      if (filters.location && Array.isArray(filters.location) && filters.location.length > 0) {
        query = query.where(inArray(wishes.location, filters.location));
      } else if (filters.location && typeof filters.location === 'string' && filters.location !== "any") {
        query = query.where(eq(wishes.location, filters.location));
      }
      
      // Category filter removed
      
      // Age range filter with array support
      if (filters.ageRange && Array.isArray(filters.ageRange) && filters.ageRange.length > 0) {
        query = query.where(inArray(wishes.ageRange, filters.ageRange));
      } else if (filters.ageRange && typeof filters.ageRange === 'string' && filters.ageRange !== "all") {
        query = query.where(eq(wishes.ageRange, filters.ageRange));
      }
      
      // Status filter
      if (filters.status) {
        query = query.where(eq(wishes.status, filters.status));
      } else {
        // By default, only return pending wishes
        query = query.where(eq(wishes.status, "pending"));
      }
      
      // Search filter - search title, description, and tags
      if (filters.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
        const searchTerm = `%${filters.search.trim().toLowerCase()}%`;
        const searchTermExact = filters.search.trim().toLowerCase();
        const searchWords = searchTermExact.split(/\s+/).filter(word => word.length > 1);
        
        query = query.where(
          or(
            // Check title with LIKE for partial and exact matches
            like(sql`LOWER(${wishes.title})`, searchTerm),
            // Check if title has exact word matches for more accuracy
            ...searchWords.map(word => like(sql`LOWER(${wishes.title})`, `%${word}%`)),
            
            // Check description with LIKE for partial matches
            like(sql`LOWER(${wishes.description})`, searchTerm),
            
            // Category search removed
            
            // Check if any tag contains the search term or search words
            sql`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${wishes.tags}::jsonb) tag 
              WHERE LOWER(tag) LIKE ${searchTerm} OR ${
                sql.raw(searchWords.map(word => `LOWER(tag) LIKE '%${word}%'`).join(' OR '))
              }
            )`
          )
        );
      }
    }
    
    return query;
  }

  async getWishesByUser(userId: number): Promise<Wish[]> {
    return db.select()
      .from(wishes)
      .where(eq(wishes.userId, userId))
      .orderBy(desc(wishes.createdAt));
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const [wish] = await db.insert(wishes).values({
      ...insertWish,
      createdAt: new Date(),
      status: insertWish.status || "pending",
      // Ensure tags is properly handled as JSON
      tags: Array.isArray(insertWish.tags) ? insertWish.tags : []
    }).returning();
    return wish;
  }

  async updateWish(id: number, updates: Partial<Wish>): Promise<Wish | undefined> {
    const [updatedWish] = await db.update(wishes)
      .set(updates)
      .where(eq(wishes.id, id))
      .returning();
    return updatedWish;
  }

  async deleteWish(id: number): Promise<boolean> {
    const result = await db.delete(wishes).where(eq(wishes.id, id));
    return result.rowCount > 0;
  }

  // ==================== Wish Offer CRUD Methods ====================
  async getWishOffer(id: number): Promise<WishOffer | undefined> {
    const [offer] = await db.select().from(wishOffers).where(eq(wishOffers.id, id));
    return offer;
  }

  async getWishOffersByWish(wishId: number): Promise<WishOffer[]> {
    return db.select()
      .from(wishOffers)
      .where(eq(wishOffers.wishId, wishId))
      .orderBy(desc(wishOffers.createdAt));
  }

  async createWishOffer(insertOffer: InsertWishOffer): Promise<WishOffer> {
    const [offer] = await db.insert(wishOffers).values({
      ...insertOffer,
      createdAt: new Date(),
      status: insertOffer.status || "pending"
    }).returning();
    
    return offer;
  }

  async updateWishOfferStatus(id: number, status: string): Promise<WishOffer | undefined> {
    // First, get the current offer
    const [offer] = await db.select().from(wishOffers).where(eq(wishOffers.id, id));
    if (!offer) return undefined;
    
    // Update the offer status
    const [updatedOffer] = await db.update(wishOffers)
      .set({ status })
      .where(eq(wishOffers.id, id))
      .returning();
    
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
        
        // Mark the wish as fulfilled
        await this.updateWish(wish.id, { status: "fulfilled" });
        
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
    try {
      const [user] = await db
        .update(users)
        .set({ 
          resetToken: token, 
          resetTokenExpiry: expiry 
        })
        .where(eq(users.id, userId))
        .returning();
      
      return user;
    } catch (error) {
      console.error("Error saving password reset token:", error);
      return undefined;
    }
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.resetToken, token));
      
      return user;
    } catch (error) {
      console.error("Error getting user by reset token:", error);
      return undefined;
    }
  }
  
  async updatePassword(userId: number, newPassword: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ 
          password: newPassword,
          resetToken: null, 
          resetTokenExpiry: null 
        })
        .where(eq(users.id, userId))
        .returning();
      
      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      return undefined;
    }
  }
  
  // User blocks
  async createUserBlock(blockData: InsertUserBlock): Promise<UserBlock> {
    try {
      const [block] = await db
        .insert(userBlocks)
        .values(blockData)
        .returning();
      
      return block;
    } catch (error) {
      console.error("Error creating user block:", error);
      throw error;
    }
  }
  
  async deleteUserBlock(blockerId: number, blockedId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(userBlocks)
        .where(
          and(
            eq(userBlocks.blockerId, blockerId),
            eq(userBlocks.blockedId, blockedId)
          )
        );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting user block:", error);
      return false;
    }
  }
  
  async getUserBlocks(blockerId: number): Promise<UserBlock[]> {
    try {
      const blocks = await db
        .select()
        .from(userBlocks)
        .where(eq(userBlocks.blockerId, blockerId));
      
      return blocks;
    } catch (error) {
      console.error("Error getting user blocks:", error);
      return [];
    }
  }
  
  async isUserBlocked(blockerId: number, blockedId: number): Promise<boolean> {
    try {
      const [block] = await db
        .select()
        .from(userBlocks)
        .where(
          and(
            eq(userBlocks.blockerId, blockerId),
            eq(userBlocks.blockedId, blockedId)
          )
        );
      
      return !!block;
    } catch (error) {
      console.error("Error checking if user is blocked:", error);
      return false;
    }
  }
  
  // User mutes
  async createUserMute(muteData: InsertUserMute): Promise<UserMute> {
    try {
      const [mute] = await db
        .insert(userMutes)
        .values(muteData)
        .returning();
      
      return mute;
    } catch (error) {
      console.error("Error creating user mute:", error);
      throw error;
    }
  }
  
  async deleteUserMute(muterId: number, mutedId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(userMutes)
        .where(
          and(
            eq(userMutes.muterId, muterId),
            eq(userMutes.mutedId, mutedId)
          )
        );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting user mute:", error);
      return false;
    }
  }
  
  async getUserMutes(muterId: number): Promise<UserMute[]> {
    try {
      const mutes = await db
        .select()
        .from(userMutes)
        .where(eq(userMutes.muterId, muterId));
      
      return mutes;
    } catch (error) {
      console.error("Error getting user mutes:", error);
      return [];
    }
  }
  
  async isUserMuted(muterId: number, mutedId: number): Promise<boolean> {
    try {
      const [mute] = await db
        .select()
        .from(userMutes)
        .where(
          and(
            eq(userMutes.muterId, muterId),
            eq(userMutes.mutedId, mutedId)
          )
        );
      
      return !!mute;
    } catch (error) {
      console.error("Error checking if user is muted:", error);
      return false;
    }
  }
}