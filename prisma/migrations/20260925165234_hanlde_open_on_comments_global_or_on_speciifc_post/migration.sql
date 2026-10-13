/*
  Warnings:

  - You are about to drop the column `isOpen` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isOpenComments" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "isOpenMessages" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "isOpen";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isOpen",
ADD COLUMN     "isOpenComments" BOOLEAN NOT NULL DEFAULT true;
