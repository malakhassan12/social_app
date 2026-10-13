-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isOpenGroup" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "isOpen" SET DEFAULT true;
