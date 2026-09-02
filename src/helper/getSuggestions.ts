import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client"; // adjust import path to match your generated client
import { getAccountId } from "./getAccountId";
import { FollowRequestStatus } from "@/generated/prisma/enums";

const getSuggestions = async () => {
  const accountId = await getAccountId();

  if (!accountId) {
    return [];
  }

  // Run all independent lookups in parallel instead of sequentially
  const [currentAccount, following, followers, sentRequests, receivedRequests] =
    await Promise.all([
      prisma.account.findUnique({
        where: { id: accountId },
        select: { country: true },
      }),
      prisma.follower.findMany({
        where: { followerId: accountId },
        select: { followingId: true },
      }),
      prisma.follower.findMany({
        where: { followingId: accountId },
        select: { followerId: true },
      }),
      prisma.followRequest.findMany({
        where: { requesterId: accountId, status: FollowRequestStatus.ACCEPTED },
        select: { receiverId: true },
      }),
      prisma.followRequest.findMany({
        where: { receiverId: accountId, status: FollowRequestStatus.ACCEPTED },
        select: { requesterId: true },
      }),
    ]);

  if (!currentAccount) {
    return [];
  }

  // Dedupe excluded ids
  const excludedIds = Array.from(
    new Set<string>([
      accountId,
      ...following.map((item) => item.followingId),
      ...followers.map((item) => item.followerId),
      ...sentRequests.map((item) => item.receiverId),
      ...receivedRequests.map((item) => item.requesterId),
    ]),
  );

  // Single query: prioritize same-country accounts, fall back to others,
  // instead of two separate round trips
  const accounts = await prisma.$queryRaw<
    Array<{
      id: string;
      username: string;
      name: string;
      image: string | null;
      country: string | null;
      type: string;
      email: {
        email: string;
      };
    }>
  >`
  SELECT
    a.id,
    a.username,
    a.name,
    a.image,
    a.country,
    a.type,
    json_build_object(
      'email', e.email
    ) AS email
  FROM "Account" a
  JOIN "UserEmail" e
    ON a."emailId" = e.id
  WHERE a.id NOT IN (${Prisma.join(excludedIds)})
  ORDER BY (a.country = ${currentAccount.country}) DESC
  LIMIT 6
`;
  return accounts;
};

export default getSuggestions;
