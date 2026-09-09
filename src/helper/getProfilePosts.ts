import prisma from "@/lib/prisma";
import { getAccountId } from "./getAccountId";



const getProfilePosts = async (
  accountId: string | undefined,
  pageInput: string | number,
) => {
  const finalAccountId = accountId ?? await getAccountId();

  if (!finalAccountId) {
    return {
      posts: [],
      currentPage: 1,
      limit: 8,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const page = Math.max(1, Number(pageInput) || 1);
  const limit = 8;

  // Get posts
  const posts = await prisma.post.findMany({
    where: {
      accountId: finalAccountId,
    },
    include: {
      author: true,
      likes: true,
    },
  });

  // Get shares
  const shares = await prisma.share.findMany({
    where: {
      shareToId: finalAccountId,
    },
    include: {
      shareFrom: {
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
        },
      },
      shareTo: {
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
        },
      },
      post: {
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });

  // Collect them into ONE array
  const activities = [
    ...posts.map((post) => ({
      type: "POST" as const,
      id: post.id,
      createdAt: post.createdAt,
      post,
    })),

    ...shares.map((share) => ({
      type: "SHARE" as const,
      id: share.id,
      createdAt: share.createdAt,
      share,
    })),
  ];

  // Sort posts + shares together
  activities.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  // Total of BOTH
  const total = activities.length;

  const totalPages = Math.ceil(total / limit);

  // Pagination happens AFTER collecting
  const offset = (page - 1) * limit;

  const paginatedActivities = activities.slice(
    offset,
    offset + limit,
  );

  return {
    posts: paginatedActivities,

    currentPage: page,

    limit,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
};

export default getProfilePosts;