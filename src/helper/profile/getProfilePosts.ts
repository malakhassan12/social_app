import prisma from "@/lib/prisma";
import { getAccountId } from "../account/getAccountId";

const getProfilePosts = async (
  accountId: string | undefined,
  pageInput: string | number,
) => {
  const viewerId = await getAccountId();
  const finalAccountId = accountId ?? viewerId;

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
      _count: {
        select: {
          comments: true,
          likes: true,
          shares: true,
        },
      },
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
          _count: {
            select: {
              comments: true,
              likes: true,
              shares: true,
            },
          },
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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Total of BOTH
  const total = activities.length;

  const totalPages = Math.ceil(total / limit);

  // Pagination happens AFTER collecting
  const offset = (page - 1) * limit;

  const paginatedActivities = activities.slice(offset, offset + limit);
  const activityPostIds = paginatedActivities.map((activity) =>
    activity.type === "POST" ? activity.post.id : activity.share.post.id,
  );
  const [viewerShares, shareCounts] = activityPostIds.length
    ? await Promise.all([
        viewerId
          ? prisma.share.findMany({
              where: {
                shareToId: viewerId,
                postId: { in: activityPostIds },
              },
              select: { postId: true },
            })
          : Promise.resolve([]),
        prisma.share.groupBy({
          by: ["postId"],
          where: { postId: { in: activityPostIds } },
          _count: { _all: true },
        }),
      ])
    : [[], []];
  const sharedPostIds = new Set(viewerShares.map((share) => share.postId));
  const sharedCounts = new Map(
    shareCounts.map((share) => [share.postId, share._count._all]),
  );
  const activitiesWithSocialState = paginatedActivities.map((activity) => {
    const post = activity.type === "POST" ? activity.post : activity.share.post;
    const postWithSocialState = {
      ...post,
      isLiked: post.likes.some((like) => like.accountId === viewerId),
      isShared: sharedPostIds.has(post.id),
      sharedCount: sharedCounts.get(post.id) ?? 0,
    };

    return activity.type === "POST"
      ? { ...activity, post: postWithSocialState }
      : {
          ...activity,
          share: { ...activity.share, post: postWithSocialState },
        };
  });

  return {
    posts: activitiesWithSocialState,

    currentPage: page,

    limit,

    total,

    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
};

export default getProfilePosts;
