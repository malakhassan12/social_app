ALTER TABLE "Conversation"
ADD COLUMN "ownerId" TEXT;

UPDATE "Conversation" c
SET "ownerId" = (
    SELECT cp."accountId"
    FROM "ConversationParticipant" cp
    WHERE cp."conversationId" = c."id"
      AND cp."isAdmin" = true
    ORDER BY cp."joinedAt" ASC, cp."id" ASC
    LIMIT 1
)
WHERE c."type" = 'GROUP';