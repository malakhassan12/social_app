-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isOpenMessages" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "ConversationType" NOT NULL DEFAULT 'DIRECT';

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Share" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Account_id_createdAt_idx" ON "Account"("id", "createdAt");

-- CreateIndex
CREATE INDEX "Post_accountId_createdAt_idx" ON "Post"("accountId", "createdAt");
