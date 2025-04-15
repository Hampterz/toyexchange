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
