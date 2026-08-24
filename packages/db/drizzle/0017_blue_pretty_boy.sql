CREATE TABLE "domigo_v2"."ops_link_uses" (
	"nonce_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
