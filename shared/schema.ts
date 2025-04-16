import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  profilePicture: text("profile_picture"),
  toysShared: integer("toys_shared").default(0),
  successfulExchanges: integer("successful_exchanges").default(0),
  sustainabilityScore: integer("sustainability_score").default(0),
  currentBadge: text("current_badge").default("Newcomer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  location: true,
  profilePicture: true,
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

// Predefined common tags for toys
export const COMMON_TAGS = [
  "plush",
  "educational",
  "outdoor",
  "baby",
  "STEM",
  "books",
  "games",
  "like-new",
  "3-5yrs",
  "6-8yrs",
  "9-12yrs",
  "teen",
  "wooden",
  "electronic",
  "musical",
  "sports",
  "art",
  "puzzles",
  "seasonal",
  "building",
  "action-figures",
  "cars",
  "dolls",
  "pretend-play",
  "collectible"
];

// Toy model
export const toys = pgTable("toys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageRange: text("age_range").notNull(),
  condition: text("condition").notNull(),
  category: text("category").notNull(),
  images: jsonb("images").notNull().$type<string[]>(),
  location: text("location").notNull(),
  tags: jsonb("tags").notNull().$type<string[]>().default([]),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertToySchema = createInsertSchema(toys).pick({
  userId: true,
  title: true,
  description: true,
  ageRange: true,
  condition: true,
  category: true,
  images: true,
  location: true,
  tags: true,
  isAvailable: true,
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
});

export const insertToyRequestSchema = createInsertSchema(toyRequests).pick({
  toyId: true,
  requesterId: true,
  ownerId: true,
  message: true,
  status: true,
  preferredLocation: true,
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
