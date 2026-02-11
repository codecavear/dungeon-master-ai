/**
 * Dungeon Master AI - Database Schema
 * Drizzle ORM PostgreSQL Schema
 * 
 * @see SCHEMA.md for full documentation
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  jsonb,
  inet,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// 1. USERS
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  preferences: jsonb('preferences').default({}),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_username').on(table.username),
])

// ============================================================================
// 2. CAMPAIGNS
// ============================================================================

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  gameSystem: varchar('game_system', { length: 50 }).notNull().default('dnd5e'),
  worldInfo: jsonb('world_info').default({}),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  aiSettings: jsonb('ai_settings').default({}),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_campaigns_owner').on(table.ownerId),
  index('idx_campaigns_status').on(table.status),
  index('idx_campaigns_slug').on(table.slug),
])

// ============================================================================
// 3. CAMPAIGN MEMBERS
// ============================================================================

export const campaignMembers = pgTable('campaign_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 20 }).notNull().default('player'),
  nickname: varchar('nickname', { length: 50 }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  leftAt: timestamp('left_at', { withTimezone: true }),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('idx_campaign_members_unique').on(table.campaignId, table.userId),
  index('idx_campaign_members_campaign').on(table.campaignId),
  index('idx_campaign_members_user').on(table.userId),
])

// ============================================================================
// 4. CHARACTERS
// ============================================================================

export const characters = pgTable('characters', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id').references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  characterType: varchar('character_type', { length: 20 }).notNull().default('pc'),
  race: varchar('race', { length: 50 }),
  class: varchar('class', { length: 100 }),
  level: integer('level').default(1),
  background: varchar('background', { length: 50 }),
  alignment: varchar('alignment', { length: 20 }),
  avatarUrl: text('avatar_url'),
  tokenUrl: text('token_url'),
  stats: jsonb('stats').default({}),
  inventory: jsonb('inventory').default([]),
  abilities: jsonb('abilities').default({}),
  backstory: text('backstory'),
  personality: text('personality'),
  notes: text('notes'),
  aiBehavior: jsonb('ai_behavior').default({}),
  isActive: boolean('is_active').default(true),
  diedAt: timestamp('died_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_characters_campaign').on(table.campaignId),
  index('idx_characters_owner').on(table.ownerId),
  index('idx_characters_type').on(table.characterType),
  index('idx_characters_active').on(table.campaignId, table.isActive),
])

// ============================================================================
// 5. SESSIONS
// ============================================================================

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  sessionNumber: integer('session_number').notNull(),
  title: varchar('title', { length: 255 }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  durationMinutes: integer('duration_minutes'),
  summary: text('summary'),
  notes: text('notes'),
  highlights: jsonb('highlights').default([]),
  attendees: jsonb('attendees').default([]),
  rewards: jsonb('rewards').default({}),
  status: varchar('status', { length: 20 }).default('planned'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  uniqueIndex('idx_sessions_campaign_number').on(table.campaignId, table.sessionNumber),
  index('idx_sessions_campaign').on(table.campaignId),
  index('idx_sessions_status').on(table.status),
  index('idx_sessions_scheduled').on(table.scheduledAt),
])

// ============================================================================
// 6. MESSAGES (AI Conversation History)
// ============================================================================

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').references(() => sessions.id),
  senderType: varchar('sender_type', { length: 20 }).notNull(),
  senderId: uuid('sender_id').references(() => users.id),
  characterId: uuid('character_id').references(() => characters.id),
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 30 }).notNull().default('chat'),
  metadata: jsonb('metadata').default({}),
  aiModel: varchar('ai_model', { length: 50 }),
  aiContext: jsonb('ai_context'),
  tokensUsed: integer('tokens_used'),
  visibleTo: uuid('visible_to').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_messages_campaign').on(table.campaignId, table.createdAt),
  index('idx_messages_session').on(table.sessionId, table.createdAt),
  index('idx_messages_sender').on(table.senderId),
  index('idx_messages_type').on(table.campaignId, table.messageType),
])

// ============================================================================
// 7. WORLD ELEMENTS
// ============================================================================

export const worldElements = pgTable('world_elements', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references((): any => worldElements.id),
  elementType: varchar('element_type', { length: 30 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }),
  description: text('description'),
  imageUrl: text('image_url'),
  properties: jsonb('properties').default({}),
  tags: varchar('tags', { length: 50 }).array().default([]),
  isSecret: boolean('is_secret').default(false),
  revealedAt: timestamp('revealed_at', { withTimezone: true }),
  coordinates: jsonb('coordinates'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_world_elements_campaign').on(table.campaignId),
  index('idx_world_elements_type').on(table.campaignId, table.elementType),
  index('idx_world_elements_parent').on(table.parentId),
  index('idx_world_elements_secret').on(table.campaignId, table.isSecret),
])

// ============================================================================
// 8. DICE ROLLS
// ============================================================================

export const diceRolls = pgTable('dice_rolls', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id').references(() => sessions.id),
  messageId: uuid('message_id').references(() => messages.id),
  userId: uuid('user_id').references(() => users.id),
  characterId: uuid('character_id').references(() => characters.id),
  expression: varchar('expression', { length: 100 }).notNull(),
  results: integer('results').array().notNull(),
  modifier: integer('modifier').default(0),
  total: integer('total').notNull(),
  rollType: varchar('roll_type', { length: 30 }),
  context: jsonb('context').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_dice_rolls_campaign').on(table.campaignId, table.createdAt),
  index('idx_dice_rolls_session').on(table.sessionId),
  index('idx_dice_rolls_user').on(table.userId),
])

// ============================================================================
// 9. MEDIA / ATTACHMENTS
// ============================================================================

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  storagePath: text('storage_path').notNull(),
  cdnUrl: text('cdn_url'),
  mediaType: varchar('media_type', { length: 30 }).notNull().default('image'),
  metadata: jsonb('metadata').default({}),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_media_campaign').on(table.campaignId),
  index('idx_media_type').on(table.campaignId, table.mediaType),
])

// ============================================================================
// 10. AUDIT LOGS
// ============================================================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  action: varchar('action', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_audit_logs_user').on(table.userId, table.createdAt),
  index('idx_audit_logs_campaign').on(table.campaignId, table.createdAt),
  index('idx_audit_logs_entity').on(table.entityType, table.entityId),
  index('idx_audit_logs_action').on(table.action, table.createdAt),
])

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  campaignMemberships: many(campaignMembers),
  characters: many(characters),
  messages: many(messages),
  diceRolls: many(diceRolls),
  uploadedMedia: many(media),
  auditLogs: many(auditLogs),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  owner: one(users, {
    fields: [campaigns.ownerId],
    references: [users.id],
  }),
  members: many(campaignMembers),
  characters: many(characters),
  sessions: many(sessions),
  messages: many(messages),
  worldElements: many(worldElements),
  diceRolls: many(diceRolls),
  media: many(media),
  auditLogs: many(auditLogs),
}))

export const campaignMembersRelations = relations(campaignMembers, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignMembers.campaignId],
    references: [campaigns.id],
  }),
  user: one(users, {
    fields: [campaignMembers.userId],
    references: [users.id],
  }),
}))

export const charactersRelations = relations(characters, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [characters.campaignId],
    references: [campaigns.id],
  }),
  owner: one(users, {
    fields: [characters.ownerId],
    references: [users.id],
  }),
  messages: many(messages),
  diceRolls: many(diceRolls),
}))

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [sessions.campaignId],
    references: [campaigns.id],
  }),
  messages: many(messages),
  diceRolls: many(diceRolls),
}))

export const messagesRelations = relations(messages, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [messages.campaignId],
    references: [campaigns.id],
  }),
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [messages.characterId],
    references: [characters.id],
  }),
  diceRolls: many(diceRolls),
}))

export const worldElementsRelations = relations(worldElements, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [worldElements.campaignId],
    references: [campaigns.id],
  }),
  parent: one(worldElements, {
    fields: [worldElements.parentId],
    references: [worldElements.id],
    relationName: 'parent_child',
  }),
  children: many(worldElements, { relationName: 'parent_child' }),
}))

export const diceRollsRelations = relations(diceRolls, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [diceRolls.campaignId],
    references: [campaigns.id],
  }),
  session: one(sessions, {
    fields: [diceRolls.sessionId],
    references: [sessions.id],
  }),
  message: one(messages, {
    fields: [diceRolls.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [diceRolls.userId],
    references: [users.id],
  }),
  character: one(characters, {
    fields: [diceRolls.characterId],
    references: [characters.id],
  }),
}))

export const mediaRelations = relations(media, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [media.campaignId],
    references: [campaigns.id],
  }),
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [auditLogs.campaignId],
    references: [campaigns.id],
  }),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
export type CampaignMember = typeof campaignMembers.$inferSelect
export type NewCampaignMember = typeof campaignMembers.$inferInsert
export type Character = typeof characters.$inferSelect
export type NewCharacter = typeof characters.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type WorldElement = typeof worldElements.$inferSelect
export type NewWorldElement = typeof worldElements.$inferInsert
export type DiceRoll = typeof diceRolls.$inferSelect
export type NewDiceRoll = typeof diceRolls.$inferInsert
export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
