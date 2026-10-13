import prisma from "@/lib/prisma";
import { FollowRequestStatus } from "@/generated/prisma/enums";

// الحسابات اللي "المفروض تعرف" إن accountId ده online/offline
// (أصحابه + اللي بيتابعوه + اللي هو بيتابعهم + مشاركينه في محادثات)
export async function getRelevantAccountIds(accountId: string): Promise<string[]> {
  const [friendships, followers, following, conversations] = await Promise.all([
    prisma.followRequest.findMany({
      where: {
        OR: [{ requesterId: accountId }, { receiverId: accountId }],
        status: FollowRequestStatus.ACCEPTED,
      },
      select: { requesterId: true, receiverId: true },
    }),
    prisma.follower.findMany({
      where: { followingId: accountId },
      select: { followerId: true },
    }),
    prisma.follower.findMany({
      where: { followerId: accountId },
      select: { followingId: true },
    }),
    prisma.conversationParticipant.findMany({
      where: {
        conversation: {
          participants: { some: { accountId } },
        },
      },
      select: { accountId: true },
    }),
  ]);

  const friendIds = friendships.map((f) =>
    f.requesterId === accountId ? f.receiverId : f.requesterId,
  );
  const followerIds = followers.map((f) => f.followerId);
  const followingIds = following.map((f) => f.followingId);
  const conversationIds = conversations.map((c) => c.accountId);

  return Array.from(
    new Set([...friendIds, ...followerIds, ...followingIds, ...conversationIds]),
  );
}