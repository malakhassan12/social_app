-- CreateEnum
CREATE TYPE "ConversationParticipantType" AS ENUM ('REMOVED', 'EXIST');

-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "type" "ConversationParticipantType" NOT NULL DEFAULT 'EXIST';
