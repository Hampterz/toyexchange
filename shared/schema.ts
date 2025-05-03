import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Common tags for toys and wishes

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  googleId: text("google_id").unique(),
  
  // Sustainability metrics
  toysShared: integer("toys_shared").default(0),
  successfulExchanges: integer("successful_exchanges").default(0),
  sustainabilityScore: integer("sustainability_score").default(0),
  currentBadge: text("current_badge").default("Newcomer"),
  
  // Additional user metrics for gamification
  points: integer("points").default(0),
  specialBadges: text("special_badges").array(),
  
  // Location & Safety preferences
  latitude: text("latitude"),
  longitude: text("longitude"),
  cityName: text("city_name"),
  locationPrivacy: text("location_privacy").default("city_only"), // "city_only", "exact_location", "private"
  preferredMeetupLocations: text("preferred_meetup_locations").array(),
  safetyPreferences: jsonb("safety_preferences"),
  
  // Child profiles for recommendations
  childProfiles: jsonb("child_profiles"),
  
  // Notification preferences
  notificationPreferences: jsonb("notification_preferences"),
  
  // Password reset functionality
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  location: true,
  bio: true,
  profilePicture: true,
  googleId: true,
  latitude: true,
  longitude: true,
  cityName: true,
  locationPrivacy: true,
  preferredMeetupLocations: true,
  safetyPreferences: true,
  childProfiles: true,
  notificationPreferences: true,
});

// Sustainability badge definitions
export const BADGES = {
  NEWCOMER: {
    name: "Newcomer",
    minScore: 0,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: "🌱"
  },
  ECO_FRIEND: {
    name: "Eco Friend",
    minScore: 10,
    color: "text-green-500",
    bgColor: "bg-green-100",
    icon: "🌿"
  },
  SUSTAINABILITY_HERO: {
    name: "Sustainability Hero",
    minScore: 25,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    icon: "🌊"
  },
  EARTH_GUARDIAN: {
    name: "Earth Guardian",
    minScore: 50,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
    icon: "🌍"
  },
  PLANET_PROTECTOR: {
    name: "Planet Protector",
    minScore: 100,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    icon: "⭐"
  }
};

// Predefined common tags/attributes for toys
export const COMMON_ATTRIBUTES = [
  // Educational categories
  "Educational",
  "STEM", 
  "Science Kit",
  "Math Skills",
  "Reading",
  "Language Development",
  "Geography",
  "History",
  "Coding",
  "Problem Solving",
  "Memory Skills",
  "Learning Tools",
  "Flash Cards",
  "Educational Games",
  
  // Types of activities
  "Outdoor", 
  "Indoor", 
  "Creative", 
  "Sports", 
  "Active Play",
  "Quiet Play",
  "Pretend Play",
  "Dress Up",
  "Imaginative Play",
  "Cooperative Play",
  "Dramatic Play",
  "Solo Play",
  "Group Activity",
  "Travel Friendly",
  "Water Play",
  "Sand Play",
  "Bath Toys",
  "Camping",
  
  // Materials
  "Wooden", 
  "Plastic",
  "Plush",
  "Fabric",
  "Metal",
  "Eco-Friendly",
  "Natural Materials",
  "Magnetic",
  "Foam",
  "Silicone",
  
  // Electronic features
  "Electronic", 
  "Battery Operated",
  "Rechargeable",
  "Lights",
  "Sounds",
  "Music",
  "Interactive",
  "Talking",
  "Remote Control",
  "Digital",
  "Screen-Free",
  
  // Arts and Creative
  "Musical", 
  "Art", 
  "Crafts",
  "Drawing",
  "Painting",
  "Coloring",
  "Musical Instruments",
  "Clay Modeling",
  "Beading",
  "Jewelry Making",
  "Knitting",
  "Sewing",
  
  // Toy types
  "Dolls", 
  "Action Figures",
  "Vehicles", 
  "Cars",
  "Trucks",
  "Trains",
  "Airplanes",
  "Building", 
  "Blocks",
  "Construction",
  "Lego Compatible",
  "Puzzles", 
  "Games", 
  "Board Games",
  "Card Games",
  "Strategy Games",
  "Family Games", 
  "Stuffed Animals",
  "Role Play", 
  "Collectibles", 
  "Sensory",
  "Tactile",
  "Fidget Toys",
  "Cause and Effect",
  
  // Age categories  
  "Preschool",
  "Baby",
  "Toddler",
  "School-Age",
  "Teens",
  
  // Special features
  "Popular Character",
  "Disney",
  "Marvel",
  "Star Wars",
  "Barbie",
  "Vintage",
  "Classic",
  "Handmade",
  "Multicultural",
  "Inclusive",
  "Special Needs Friendly",
  "Bilingual",
  "Limited Edition",
  "Sustainable"
];

// Toy model
export const toys = pgTable("toys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageRange: text("age_range").notNull(),
  condition: text("condition").notNull(),
  // Category field still exists in database but is no longer used in UI
  category: text("category").notNull(), // Keep this because the database requires it
  images: jsonb("images").notNull().$type<string[]>(),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  tags: jsonb("tags").notNull().$type<string[]>().default([]),
  isAvailable: boolean("is_available").default(true),
  status: text("status").notNull().default("active"), // active, traded, sold, deleted, archived (soft delete)
  soldDate: timestamp("sold_date"), // Date when the toy was marked as sold
  recommendedAges: jsonb("recommended_ages").$type<number[]>(),
  safetyNotes: text("safety_notes"),
  videos: jsonb("videos").default([]).$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create schema with soldDate explicitly excluded to fix validation issues
// Create schema with explicit handling for the category field that's still in the database
export const insertToySchema = createInsertSchema(toys)
  .pick({
    userId: true,
    title: true,
    description: true,
    ageRange: true,
    condition: true,
    images: true,
    location: true,
    latitude: true,
    longitude: true,
    tags: true,
    isAvailable: true,
    status: true,
    recommendedAges: true,
    safetyNotes: true,
    videos: true,
  })
  .extend({
    // Add category field that's still in database but no longer in UI
    category: z.string().default("Other"),
  });

// Message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  toyId: integer("toy_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  toyId: true,
  content: true,
  read: true,
});

// ToyRequest model
export const toyRequests = pgTable("toy_requests", {
  id: serial("id").primaryKey(),
  toyId: integer("toy_id").notNull(),
  requesterId: integer("requester_id").notNull(),
  ownerId: integer("owner_id").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  preferredLocation: text("preferred_location"),
  createdAt: timestamp("created_at").defaultNow(),
  feedback: text("feedback"), // Feedback after exchange is completed
  rating: integer("rating"), // Rating from 1-5 after exchange is completed
});

export const insertToyRequestSchema = createInsertSchema(toyRequests).pick({
  toyId: true,
  requesterId: true,
  ownerId: true,
  message: true,
  status: true,
  preferredLocation: true,
  feedback: true,
  rating: true,
});

// Favorite model
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  toyId: integer("toy_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  toyId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertToy = z.infer<typeof insertToySchema>;
export type Toy = typeof toys.$inferSelect;

// Extended Toy type with additional runtime properties
export interface ToyWithDistance extends Toy {
  distance?: number; // Distance in miles from the user's selected location
}

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertToyRequest = z.infer<typeof insertToyRequestSchema>;
export type ToyRequest = typeof toyRequests.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Contact Messages model
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// New models for additional features

// Groups for toy exchange communities
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  creatorId: integer("creator_id").notNull(),
  location: text("location"),
  image: text("image"),
  memberCount: integer("member_count").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGroupSchema = createInsertSchema(groups).pick({
  name: true,
  description: true,
  creatorId: true,
  location: true,
  image: true,
  isPublic: true,
});

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

// Group members
export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).pick({
  groupId: true,
  userId: true,
  role: true,
});

export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;

// Following system
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;

// Reports for suspicious listings/users
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").notNull(),
  targetType: text("target_type").notNull(), // user, toy, message
  targetId: integer("target_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").default("pending"), // pending, reviewed, resolved, dismissed
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by"),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  reporterId: true,
  targetType: true,
  targetId: true,
  reason: true,
  details: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Safe meetup locations
export const meetupLocations = pgTable("meetup_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  locationType: text("location_type").notNull(), // library, community center, police station, etc.
  latitude: text("latitude"),
  longitude: text("longitude"),
  isVerified: boolean("is_verified").default(false),
  addedBy: integer("added_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMeetupLocationSchema = createInsertSchema(meetupLocations).pick({
  name: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  locationType: true,
  latitude: true,
  longitude: true,
  addedBy: true,
});

export type InsertMeetupLocation = z.infer<typeof insertMeetupLocationSchema>;
export type MeetupLocation = typeof meetupLocations.$inferSelect;

// Toy history entries - for tracking a toy's journey
export const toyHistories = pgTable("toy_histories", {
  id: serial("id").primaryKey(),
  toyId: integer("toy_id").notNull(),
  previousOwnerId: integer("previous_owner_id").notNull(),
  newOwnerId: integer("new_owner_id").notNull(),
  transferDate: timestamp("transfer_date").defaultNow(),
  story: text("story"),
  photos: jsonb("photos").$type<string[]>(),
});

export const insertToyHistorySchema = createInsertSchema(toyHistories).pick({
  toyId: true,
  previousOwnerId: true,
  newOwnerId: true,
  story: true,
  photos: true,
});

export type InsertToyHistory = z.infer<typeof insertToyHistorySchema>;
export type ToyHistory = typeof toyHistories.$inferSelect;

// Safety tips by category
export const safetyTips = pgTable("safety_tips", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertSafetyTipSchema = createInsertSchema(safetyTips).pick({
  category: true,
  title: true,
  content: true,
});

export type InsertSafetyTip = z.infer<typeof insertSafetyTipSchema>;
export type SafetyTip = typeof safetyTips.$inferSelect;

// Community metrics type
export type CommunityMetrics = {
  toysSaved: number;
  familiesConnected: number;
  sustainabilityImpact: number;
  totalToys: number;
  activeUsers: number;
  successfulExchanges: number;
};

// Filter options for toy search
export type FilterOptions = {
  location: string[];
  ageRange: string[];
  condition: string[];
  tags: string[];
  search?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
};

// Community Challenge Board
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetCount: integer("target_count").notNull(), // Number of toys needed
  currentCount: integer("current_count").default(0), // Current progress
  category: text("category").notNull(), // e.g., "Summer toys", "Educational toys", "Baby toys"
  ageRange: text("age_range").notNull(), // Target age range for the toys
  beneficiary: text("beneficiary").notNull(), // Who will receive the toys
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("active"), // active, completed, canceled
  imageUrl: text("image_url"), // Optional image for the challenge
  createdBy: integer("created_by").notNull(), // Admin/moderator who created the challenge
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  targetCount: true,
  currentCount: true,
  category: true,
  ageRange: true,
  beneficiary: true,
  startDate: true,
  endDate: true,
  status: true,
  imageUrl: true,
  createdBy: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// Challenge Participants - Users who've contributed to a challenge
export const challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  userId: integer("user_id").notNull(),
  toyId: integer("toy_id").notNull(), // The toy that was donated
  dateJoined: timestamp("date_joined").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  contributionNotes: text("contribution_notes"), // Optional notes about the contribution
});

export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants).pick({
  challengeId: true,
  userId: true,
  toyId: true,
  status: true,
  contributionNotes: true,
});

export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;

// Saved Searches - for users to save and get notifications on search criteria
export const savedSearches = pgTable("saved_searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(), // User-friendly name for the search
  searchParams: jsonb("search_params").notNull().$type<FilterOptions>(), // Store the filter options
  notificationsEnabled: boolean("notifications_enabled").default(true),
  lastNotified: timestamp("last_notified"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedSearchSchema = createInsertSchema(savedSearches).pick({
  userId: true,
  name: true,
  searchParams: true,
  notificationsEnabled: true,
});

export type InsertSavedSearch = z.infer<typeof insertSavedSearchSchema>;
export type SavedSearch = typeof savedSearches.$inferSelect;

// User blocking table - to store user blocking relationships
export const userBlocks = pgTable("user_blocks", {
  id: serial("id").primaryKey(),
  blockerId: integer("blocker_id").notNull(), // User who initiated the block
  blockedId: integer("blocked_id").notNull(), // User who is blocked
  reason: text("reason"), // Optional reason for the block
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserBlockSchema = createInsertSchema(userBlocks).pick({
  blockerId: true,
  blockedId: true,
  reason: true,
});

export type InsertUserBlock = z.infer<typeof insertUserBlockSchema>;
export type UserBlock = typeof userBlocks.$inferSelect;

// User mutes for message notifications
export const userMutes = pgTable("user_mutes", {
  id: serial("id").primaryKey(),
  muterId: integer("muter_id").notNull(), // User who initiated the mute
  mutedId: integer("muted_id").notNull(), // User who is muted
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserMuteSchema = createInsertSchema(userMutes).pick({
  muterId: true,
  mutedId: true,
});

export type InsertUserMute = z.infer<typeof insertUserMuteSchema>;
export type UserMute = typeof userMutes.$inferSelect;

// Wish list model for toy requests
export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageRange: text("age_range").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status").notNull().default("active"), // active, fulfilled, deleted, archived
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertWishSchema = createInsertSchema(wishes).pick({
  userId: true,
  title: true,
  description: true,
  ageRange: true,
  images: true,
  location: true,
  latitude: true,
  longitude: true,
  tags: true,
  status: true,
  isPublic: true,
});

export type InsertWish = z.infer<typeof insertWishSchema>;
export type Wish = typeof wishes.$inferSelect;

// WishOffer model for users offering toys to fulfill wishes
export const wishOffers = pgTable("wish_offers", {
  id: serial("id").primaryKey(),
  wishId: integer("wish_id").notNull(),
  offererId: integer("offerer_id").notNull(), // User offering a toy
  toyId: integer("toy_id"), // Optional - can link to an existing toy
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishOfferSchema = createInsertSchema(wishOffers).pick({
  wishId: true,
  offererId: true,
  toyId: true,
  message: true,
  status: true,
});

export type InsertWishOffer = z.infer<typeof insertWishOfferSchema>;
export type WishOffer = typeof wishOffers.$inferSelect;
