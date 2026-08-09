-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('UPCOMING', 'ONLINE');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('PUBLISHED', 'HIDDEN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chronicles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chronicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "short_description" TEXT,
    "full_description" TEXT,
    "rate_exp" INTEGER NOT NULL,
    "rate_sp" INTEGER NOT NULL,
    "rate_adena" INTEGER NOT NULL,
    "rate_drop" INTEGER NOT NULL,
    "rate_spoil" INTEGER NOT NULL,
    "opening_date" DATE,
    "is_opening_soon" BOOLEAN NOT NULL DEFAULT false,
    "status" "ServerStatus" NOT NULL DEFAULT 'UPCOMING',
    "publication_status" "PublicationStatus" NOT NULL DEFAULT 'HIDDEN',
    "regular_position" INTEGER,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "og_image_url" TEXT,
    "archived_at" TIMESTAMP(3),
    "server_type_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_chronicles" (
    "server_id" UUID NOT NULL,
    "chronicle_id" UUID NOT NULL,

    CONSTRAINT "server_chronicles_pkey" PRIMARY KEY ("server_id","chronicle_id")
);

-- CreateTable
CREATE TABLE "server_links" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "server_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_blocks" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranking_promotions" (
    "id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ranking_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_positions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "location" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "ad_position_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "alt_text" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chronicles_name_key" ON "chronicles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "chronicles_slug_key" ON "chronicles"("slug");

-- CreateIndex
CREATE INDEX "chronicles_is_active_sort_order_idx" ON "chronicles"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "server_types_name_key" ON "server_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "server_types_slug_key" ON "server_types"("slug");

-- CreateIndex
CREATE INDEX "server_types_is_active_sort_order_idx" ON "server_types"("is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "servers_slug_key" ON "servers"("slug");

-- CreateIndex
CREATE INDEX "servers_publication_status_archived_at_idx" ON "servers"("publication_status", "archived_at");

-- CreateIndex
CREATE INDEX "servers_status_idx" ON "servers"("status");

-- CreateIndex
CREATE INDEX "servers_server_type_id_idx" ON "servers"("server_type_id");

-- BR-09: unique regular_position only among non-archived servers
CREATE UNIQUE INDEX "servers_regular_position_active_key"
ON "servers"("regular_position")
WHERE "archived_at" IS NULL AND "regular_position" IS NOT NULL;

-- CreateIndex
CREATE INDEX "server_chronicles_chronicle_id_idx" ON "server_chronicles"("chronicle_id");

-- CreateIndex
CREATE INDEX "server_links_server_id_sort_order_idx" ON "server_links"("server_id", "sort_order");

-- CreateIndex
CREATE INDEX "premium_blocks_is_active_start_at_end_at_idx" ON "premium_blocks"("is_active", "start_at", "end_at");

-- CreateIndex
CREATE INDEX "premium_blocks_server_id_idx" ON "premium_blocks"("server_id");

-- CreateIndex
CREATE INDEX "premium_blocks_position_idx" ON "premium_blocks"("position");

-- CreateIndex
CREATE INDEX "ranking_promotions_is_active_start_at_end_at_idx" ON "ranking_promotions"("is_active", "start_at", "end_at");

-- CreateIndex
CREATE INDEX "ranking_promotions_server_id_idx" ON "ranking_promotions"("server_id");

-- CreateIndex
CREATE INDEX "ranking_promotions_position_idx" ON "ranking_promotions"("position");

-- CreateIndex
CREATE UNIQUE INDEX "ad_positions_slug_key" ON "ad_positions"("slug");

-- CreateIndex
CREATE INDEX "ad_positions_is_active_sort_order_idx" ON "ad_positions"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "banners_ad_position_id_is_active_start_at_end_at_idx" ON "banners"("ad_position_id", "is_active", "start_at", "end_at");

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_server_type_id_fkey" FOREIGN KEY ("server_type_id") REFERENCES "server_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_chronicles" ADD CONSTRAINT "server_chronicles_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_chronicles" ADD CONSTRAINT "server_chronicles_chronicle_id_fkey" FOREIGN KEY ("chronicle_id") REFERENCES "chronicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_links" ADD CONSTRAINT "server_links_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_blocks" ADD CONSTRAINT "premium_blocks_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking_promotions" ADD CONSTRAINT "ranking_promotions_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_ad_position_id_fkey" FOREIGN KEY ("ad_position_id") REFERENCES "ad_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
