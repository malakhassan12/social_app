// "use server";
// import { FollowRequestStatus } from "@/generated/prisma/enums";

// import prisma from "@/lib/prisma";

// import { getAccountId } from "../account/getAccountId";

// const getPosts = async (pageInput: string | number, accountId?: string) => {
//   const finalAccountId = accountId ?? (await getAccountId());

//   const limit = 10;

//   if (!finalAccountId) {
//     return {
//       posts: [],
//       currentPage: 1,
//       limit,
//       total: 0,
//       totalPages: 0,
//       hasNextPage: false,
//       hasPreviousPage: false,
//     };
//   }

//   const page = Math.max(1, Number(pageInput) || 1);

//   const offset = (page - 1) * limit;

//   /*
//    * -------------------------------------------------------
//    * 1. Get people I follow
//    * -------------------------------------------------------
//    */

//   const [followings, friendships] = await Promise.all([
//     prisma.follower.findMany({
//       where: {
//         followerId: finalAccountId,
//       },
//       select: {
//         followingId: true,
//       },
//     }),
//     prisma.followRequest.findMany({
//       where: {
//         OR: [
//           {
//             requesterId: finalAccountId,
//           },
//           {
//             receiverId: finalAccountId,
//           },
//         ],
//         status: FollowRequestStatus.ACCEPTED,
//       },
//       select: {
//         requesterId: true,
//         receiverId: true,
//       },
//     }),
//   ]);

//   const followingIds = followings.map((follow) => follow.followingId);

//   const friendIds = friendships.map((friendship) =>
//     friendship.requesterId === finalAccountId
//       ? friendship.receiverId
//       : friendship.requesterId,
//   );

//   /*
//    * -------------------------------------------------------
//    * 3. Common post filter
//    * -------------------------------------------------------
//    *
//    * My posts       → public + private
//    * Friends' posts → public + private
//    * Following      → public only
//    */

//   const where = {
//     OR: [
//       // My posts
//       {
//         accountId: finalAccountId,
//       },

//       // Friends' posts
//       {
//         accountId: {
//           in: friendIds,
//         },
//       },

//       // Following's public posts
//       {
//         accountId: {
//           in: followingIds,
//         },
//         isPrivate: false,
//       },
//     ],
//   };

//   /*
//    * -------------------------------------------------------
//    * 4. Get paginated posts
//    * -------------------------------------------------------
//    */

//   const [posts, total] = await Promise.all([
//     prisma.post.findMany({
//       where,

//       orderBy: {
//         createdAt: "desc",
//       },

//       skip: offset,
//       take: limit,

//       include: {
//         author: {
//           select: {
//             id: true,
//             email: {
//               select: {
//                 email: true,
//               },
//             },
//             username: true,
//             name: true,
//             image: true,
//           },
//         },
//         likes: {
//           where: {
//             accountId: finalAccountId,
//           },
//           select: {
//             id: true,
//           },
//         },
//         shares: {
//           where: {
//             shareToId: finalAccountId,
//           },
//           select: {
//             id: true,
//           },
//         },
//         _count: {
//           select: {
//             comments: true,
//             likes: true,
//             shares: true,
//           },
//         },
//       },
//     }),
//     prisma.post.count({ where }),
//   ]);

//   const postsWithSocialState = posts.map(
//     ({ likes, shares, ...post }) => ({
//       ...post,
//       isLiked: likes.length > 0,
//       isShared: shares.length > 0,
//       sharedCount: post._count.shares,
//     }),
//   );

//   /*
//    * -------------------------------------------------------
//    * 5. Pagination information
//    * -------------------------------------------------------
//    */

//   const totalPages = Math.ceil(total / limit);

//   return {
//     posts: postsWithSocialState,
//     currentPage: page,
//     limit,
//     total,
//     totalPages,
//     hasNextPage: page < totalPages,
//     hasPreviousPage: page > 1,
//   };
// };

// export default getPosts;


"use server";

import { FollowRequestStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getAccountId } from "../account/getAccountId";

const getPosts = async (
  pageInput: string | number,
  accountId?: string,
) => {
  const finalAccountId = accountId ?? (await getAccountId());
  const limit = 10;

  if (!finalAccountId) {
    return {
      posts: [],
      currentPage: 1,
      limit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const page = Math.max(1, Number(pageInput) || 1);

  /*
   * -------------------------------------------------------
   * 1. Get following + friendships
   * -------------------------------------------------------
   */

  const [followings, friendships] = await Promise.all([
    prisma.follower.findMany({
      where: {
        followerId: finalAccountId,
      },
      select: {
        followingId: true,
      },
    }),

    prisma.followRequest.findMany({
      where: {
        OR: [
          {
            requesterId: finalAccountId,
          },
          {
            receiverId: finalAccountId,
          },
        ],
        status: FollowRequestStatus.ACCEPTED,
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    }),
  ]);

  const followingIds = followings.map(
    (follow) => follow.followingId,
  );

  const friendIds = friendships.map((friendship) =>
    friendship.requesterId === finalAccountId
      ? friendship.receiverId
      : friendship.requesterId,
  );

  /*
   * -------------------------------------------------------
   * 2. Accounts whose posts I can see
   * -------------------------------------------------------
   */

  const visibleAccountIds = [
    finalAccountId,
    ...friendIds,
    ...followingIds,
  ];

  /*
   * -------------------------------------------------------
   * 3. Get posts + shares
   * -------------------------------------------------------
   */

  const [posts, shares] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          // My posts
          {
            accountId: finalAccountId,
          },

          // Friends' posts
          {
            accountId: {
              in: friendIds,
            },
          },

          // Following's public posts
          {
            accountId: {
              in: followingIds,
            },
            isPrivate: false,
          },
        ],
      },

      include: {
        author: {
          select: {
            id: true,
            email: {
              select: {
                email: true,
              },
            },
            username: true,
            name: true,
            image: true,
          },
        },

        likes: {
          where: {
            accountId: finalAccountId,
          },
          select: {
            id: true,
          },
        },

        shares: {
          where: {
            shareToId: finalAccountId,
          },
          select: {
            id: true,
          },
        },

        _count: {
          select: {
            comments: true,
            likes: true,
            shares: true,
          },
        },
      },
    }),

    /*
     * Shares
     *
     * IMPORTANT:
     * shareFromId should be the person who created
     * the share.
     */
    prisma.share.findMany({
      where: {
        shareFromId: {
          in: visibleAccountIds,
        },

        post: {
          OR: [
            // Original post belongs to me
            {
              accountId: finalAccountId,
            },

            // Original post belongs to friend
            {
              accountId: {
                in: friendIds,
              },
            },

            // Original post belongs to following
            {
              accountId: {
                in: followingIds,
              },
              isPrivate: false,
            },
          ],
        },
      },

      include: {
        shareFrom: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },

        shareTo: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },

        post: {
          include: {
            author: {
              select: {
                id: true,
                email: {
                  select: {
                    email: true,
                  },
                },
                username: true,
                name: true,
                image: true,
              },
            },

            likes: {
              where: {
                accountId: finalAccountId,
              },
              select: {
                id: true,
              },
            },

            shares: {
              where: {
                shareToId: finalAccountId,
              },
              select: {
                id: true,
              },
            },

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
    }),
  ]);

  /*
   * -------------------------------------------------------
   * 4. Convert everything into activities
   * -------------------------------------------------------
   */

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

  /*
   * -------------------------------------------------------
   * 5. Sort Posts + Shares together
   * -------------------------------------------------------
   */

  activities.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  /*
   * -------------------------------------------------------
   * 6. Total + pagination
   * -------------------------------------------------------
   */

  const total = activities.length;
  const totalPages = Math.ceil(total / limit);

  const offset = (page - 1) * limit;

  const paginatedActivities = activities.slice(
    offset,
    offset + limit,
  );

  /*
   * -------------------------------------------------------
   * 7. Add social state
   * -------------------------------------------------------
   */

  const activitiesWithSocialState = paginatedActivities.map(
    (activity) => {
      const post =
        activity.type === "POST"
          ? activity.post
          : activity.share.post;

      const postWithSocialState = {
        ...post,

        isLiked: post.likes.length > 0,

        isShared: post.shares.length > 0,

        sharedCount: post._count.shares,
      };

      if (activity.type === "POST") {
        return {
          ...activity,
          post: postWithSocialState,
        };
      }

      return {
        ...activity,
        share: {
          ...activity.share,
          post: postWithSocialState,
        },
      };
    },
  );

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

export default getPosts;
