-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "shareFromId" TEXT NOT NULL,
    "shareToId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Share_shareFromId_idx" ON "Share"("shareFromId");

-- CreateIndex
CREATE INDEX "Share_shareToId_idx" ON "Share"("shareToId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_shareFromId_fkey" FOREIGN KEY ("shareFromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_shareToId_fkey" FOREIGN KEY ("shareToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
