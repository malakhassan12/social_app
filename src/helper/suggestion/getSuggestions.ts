import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { FollowRequestStatus } from "@/generated/prisma/enums";

export type PaginatedSuggestions = {
  suggestions: SuggestionAccount[];
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
export type SuggestionAccount = {
  id: string;
  username: string;
  name: string;
  image: string | null;
  country: string | null;
  type: string;
  email: {
    email: string;
  };
};
const getSuggestions = async (
  accountId: string,
  pageInput: string | number = 1,
): Promise<PaginatedSuggestions> => {
  if (!accountId) {
    return {
      suggestions: [],
      currentPage: 1,
      limit: 8,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const page = Math.max(1, Number(pageInput) || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const [currentAccount, sentRequests, receivedRequests] = await Promise.all([
    prisma.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        country: true,
      },
    }),

    prisma.followRequest.findMany({
      where: {
        requesterId: accountId,
        status: FollowRequestStatus.ACCEPTED,
      },
      select: {
        receiverId: true,
      },
    }),

    prisma.followRequest.findMany({
      where: {
        receiverId: accountId,
        status: FollowRequestStatus.ACCEPTED,
      },
      select: {
        requesterId: true,
      },
    }),
  ]);

  if (!currentAccount) {
    return {
      suggestions: [],
      currentPage: page,
      limit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: page > 1,
    };
  }

  const excludedIds = Array.from(
    new Set<string>([
      accountId,

      ...sentRequests.map((item) => item.receiverId),

      ...receivedRequests.map((item) => item.requesterId),
    ]),
  );

  const where = Prisma.sql`
    a.id NOT IN (${Prisma.join(excludedIds)})
  `;

  const [accounts, totalResult] = await Promise.all([
    prisma.$queryRaw<
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
      WHERE ${where}
      ORDER BY
        (a.country = ${currentAccount.country}) DESC,
        a.id ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `,

    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) AS count
      FROM "Account" a
      JOIN "UserEmail" e
        ON a."emailId" = e.id
      WHERE ${where}
    `,
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  const totalPages = Math.ceil(total / limit);

  return {
    suggestions: accounts,
    currentPage: page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default getSuggestions;
