/*
  Warnings:

  - A unique constraint covering the columns `[accountId,messageId]` on the table `MessageReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MessageReaction_accountId_messageId_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_accountId_messageId_key" ON "MessageReaction"("accountId", "messageId");
