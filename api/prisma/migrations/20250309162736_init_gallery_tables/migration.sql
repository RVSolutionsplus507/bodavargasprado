/*
  Warnings:

  - You are about to drop the `GallerySection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_gallerySectionId_fkey";

-- DropTable
DROP TABLE "GallerySection";

-- DropTable
DROP TABLE "Media";

-- CreateTable
CREATE TABLE "gallery_sections" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_media" (
    "id" BIGSERIAL NOT NULL,
    "section_id" BIGINT NOT NULL,
    "file_path" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gallery_media" ADD CONSTRAINT "gallery_media_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "gallery_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
