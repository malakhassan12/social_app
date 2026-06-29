-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Follower" ADD COLUMN     "status" "FollowStatus" NOT NULL DEFAULT 'PENDING';
