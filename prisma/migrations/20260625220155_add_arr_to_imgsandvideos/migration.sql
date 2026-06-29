/*
  Warnings:

  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - The `image` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `video` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "title",
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[],
DROP COLUMN "video",
ADD COLUMN     "video" TEXT[];
