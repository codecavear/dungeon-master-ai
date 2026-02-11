CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"campaign_id" uuid,
	"action" varchar(50) NOT NULL,
	"entity_type" varchar(50),
	"entity_id" uuid,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'player' NOT NULL,
	"nickname" varchar(50),
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100),
	"description" text,
	"cover_image_url" text,
	"game_system" varchar(50) DEFAULT 'dnd5e' NOT NULL,
	"world_info" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"ai_settings" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"owner_id" uuid,
	"name" varchar(100) NOT NULL,
	"character_type" varchar(20) DEFAULT 'pc' NOT NULL,
	"race" varchar(50),
	"class" varchar(100),
	"level" integer DEFAULT 1,
	"background" varchar(50),
	"alignment" varchar(20),
	"avatar_url" text,
	"token_url" text,
	"stats" jsonb DEFAULT '{}'::jsonb,
	"inventory" jsonb DEFAULT '[]'::jsonb,
	"abilities" jsonb DEFAULT '{}'::jsonb,
	"backstory" text,
	"personality" text,
	"notes" text,
	"ai_behavior" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"died_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dice_rolls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"session_id" uuid,
	"message_id" uuid,
	"user_id" uuid,
	"character_id" uuid,
	"expression" varchar(100) NOT NULL,
	"results" integer[] NOT NULL,
	"modifier" integer DEFAULT 0,
	"total" integer NOT NULL,
	"roll_type" varchar(30),
	"context" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"uploaded_by" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255),
	"mime_type" varchar(100) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"storage_path" text NOT NULL,
	"cdn_url" text,
	"media_type" varchar(30) DEFAULT 'image' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"session_id" uuid,
	"sender_type" varchar(20) NOT NULL,
	"sender_id" uuid,
	"character_id" uuid,
	"content" text NOT NULL,
	"message_type" varchar(30) DEFAULT 'chat' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"ai_model" varchar(50),
	"ai_context" jsonb,
	"tokens_used" integer,
	"visible_to" uuid[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"session_number" integer NOT NULL,
	"title" varchar(255),
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"duration_minutes" integer,
	"summary" text,
	"notes" text,
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"attendees" jsonb DEFAULT '[]'::jsonb,
	"rewards" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(20) DEFAULT 'planned',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"display_name" varchar(100),
	"password_hash" varchar(255) NOT NULL,
	"avatar_url" text,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"email_verified_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "world_elements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"parent_id" uuid,
	"element_type" varchar(30) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100),
	"description" text,
	"image_url" text,
	"properties" jsonb DEFAULT '{}'::jsonb,
	"tags" varchar(50)[] DEFAULT '{}',
	"is_secret" boolean DEFAULT false,
	"revealed_at" timestamp with time zone,
	"coordinates" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dice_rolls" ADD CONSTRAINT "dice_rolls_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dice_rolls" ADD CONSTRAINT "dice_rolls_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dice_rolls" ADD CONSTRAINT "dice_rolls_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dice_rolls" ADD CONSTRAINT "dice_rolls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dice_rolls" ADD CONSTRAINT "dice_rolls_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_elements" ADD CONSTRAINT "world_elements_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_elements" ADD CONSTRAINT "world_elements_parent_id_world_elements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."world_elements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_user" ON "audit_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_campaign" ON "audit_logs" USING btree ("campaign_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" USING btree ("action","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_campaign_members_unique" ON "campaign_members" USING btree ("campaign_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_campaign_members_campaign" ON "campaign_members" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_campaign_members_user" ON "campaign_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_campaigns_owner" ON "campaigns" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_campaigns_status" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_campaigns_slug" ON "campaigns" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_characters_campaign" ON "characters" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_characters_owner" ON "characters" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_characters_type" ON "characters" USING btree ("character_type");--> statement-breakpoint
CREATE INDEX "idx_characters_active" ON "characters" USING btree ("campaign_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_dice_rolls_campaign" ON "dice_rolls" USING btree ("campaign_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_dice_rolls_session" ON "dice_rolls" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_dice_rolls_user" ON "dice_rolls" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_media_campaign" ON "media" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_media_type" ON "media" USING btree ("campaign_id","media_type");--> statement-breakpoint
CREATE INDEX "idx_messages_campaign" ON "messages" USING btree ("campaign_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_session" ON "messages" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_sender" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_messages_type" ON "messages" USING btree ("campaign_id","message_type");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sessions_campaign_number" ON "sessions" USING btree ("campaign_id","session_number");--> statement-breakpoint
CREATE INDEX "idx_sessions_campaign" ON "sessions" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_status" ON "sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sessions_scheduled" ON "sessions" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_world_elements_campaign" ON "world_elements" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_world_elements_type" ON "world_elements" USING btree ("campaign_id","element_type");--> statement-breakpoint
CREATE INDEX "idx_world_elements_parent" ON "world_elements" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_world_elements_secret" ON "world_elements" USING btree ("campaign_id","is_secret");