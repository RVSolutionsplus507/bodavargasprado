-- AlterTable
ALTER TABLE "public"."gallery_sections" ADD COLUMN     "allow_upload" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
