// "use server";

// import prisma from "@/lib/prisma";
// import { getAccountId } from "./getAccountId";
// import { FollowRequestStatus } from "@/generated/prisma/enums";

// const getProfile = async (accountId: string | undefined = undefined) => {
//   const finalAccountId = accountId
//     ? accountId
//     : ((await getAccountId()) as string);

//   if (!finalAccountId) {
//     return {
//       user: null,
//       followers: [],
//       followings: [],
//       requests: [],
//       posts: [],
//       shares: [],
//     };
//   }

//   const [user, followers, followings, requests, posts, shares] =
//     await Promise.all([
//       prisma.account.findUnique({
//         where: { id: finalAccountId },
//         select: {
//           id: true,
//           name: true,
//           email: {
//             select: {
//               email: true,
//             },
//           },
//           image: true,
//           country: true,
//           username: true,
//           bio: true,
//           website: true,
//           type: true,
//         },
//       }),
//       prisma.follower.findMany({
//         where: { followingId: finalAccountId },
//         select: {
//           follower: {
//             select: {
//               id: true,
//               name: true,
//               email: {
//                 select: {
//                   email: true,
//                 },
//               },
//               image: true,
//               country: true,
//               username: true,
//               bio: true,
//               website: true,
//               type: true,
//             },
//           },
//         },
//       }),
//       prisma.follower.findMany({
//         where: { followerId: finalAccountId },
//         select: {
//           following: {
//             select: {
//               id: true,
//               name: true,
//               email: {
//                 select: {
//                   email: true,
//                 },
//               },
//               image: true,
//               country: true,
//               username: true,
//               bio: true,
//               website: true,
//               type: true,
//             },
//           },
//         },
//       }),
//       prisma.followRequest.findMany({
//         where: {
//           OR: [
//             {
//               receiverId: finalAccountId,
//             },
//             {
//               requesterId: finalAccountId,
//             },
//           ],
//           status: FollowRequestStatus.ACCEPTED,
//         },
//         select: {
//           receiver: {
//             select: {
//               id: true,
//               name: true,
//               email: {
//                 select: {
//                   email: true,
//                 },
//               },
//               image: true,
//               country: true,
//               username: true,
//               bio: true,
//               website: true,
//               type: true,
//             },
//           },

//           requester: {
//             select: {
//               id: true,
//               name: true,
//               email: {
//                 select: {
//                   email: true,
//                 },
//               },
//               image: true,
//               country: true,
//               username: true,
//               bio: true,
//               website: true,
//               type: true,
//             },
//           },
//         },
//       }),
//       prisma.post.findMany({
//         where: { accountId: finalAccountId },
//         include: {
//           author: true,
//           likes: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),
//       prisma.share.findMany({
//         where: {
//           shareToId: finalAccountId,
//         },
//         include: {
//           shareFrom: {
//             select: {
//               id: true,
//               image: true,
//               name: true,
//               email: true,
//             },
//           },
//           shareTo: {
//             select: {
//               id: true,
//               image: true,
//               name: true,
//               email: true,
//             },
//           },
//           post: {
//             include: {
//               author: true,
//               likes: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),
//     ]);

//   const friends = requests.map((friendship) => {
//     return friendship.receiver.id === finalAccountId
//       ? friendship.requester
//       : friendship.receiver;
//   });

//   const followersAccounts = followers.map((item) => item.follower);

//   const followingAccounts = followings.map((item) => item.following);
//   return {
//     user,
//     followers: followersAccounts,
//     followings: followingAccounts,
//     friends,
//     posts,
//     shares,
//   };
// };

// export default getProfile;

"use server";

import prisma from "@/lib/prisma";
import { getAccountId } from "../account/getAccountId";
import { FollowRequestStatus } from "@/generated/prisma/enums";

const getProfile = async (accountId?: string) => {
  const finalAccountId = accountId ?? (await getAccountId());

  if (!finalAccountId) {
    return {
      user: null,
      followersTotal: 0,
      followingsTotal: 0,
      friendsTotal: 0,
      postsTotal: 0,
      sharesTotal: 0,
    };
  }

  const [
    user,
    followersTotal,
    followingsTotal,
    friendsTotal,
    postsTotal,
    sharesTotal,
  ] = await Promise.all([
    // User
    prisma.account.findUnique({
      where: {
        id: finalAccountId,
      },
      select: {
        id: true,
        name: true,
        email: {
          select: {
            email: true,
          },
        },
        image: true,
        country: true,
        username: true,
        bio: true,
        website: true,
        type: true,
      },
    }),

    // Followers
    prisma.follower.count({
      where: {
        followingId: finalAccountId,
      },
    }),

    // Followings
    prisma.follower.count({
      where: {
        followerId: finalAccountId,
      },
    }),

    // Friends
    prisma.followRequest.count({
      where: {
        OR: [
          {
            receiverId: finalAccountId,
          },
          {
            requesterId: finalAccountId,
          },
        ],
        status: FollowRequestStatus.ACCEPTED,
      },
    }),

    // Posts
    prisma.post.count({
      where: {
        accountId: finalAccountId,
      },
    }),

    // Shares
    prisma.share.count({
      where: {
        shareToId: finalAccountId,
      },
    }),
  ]);

  return {
    user,
    followersTotal,
    followingsTotal,
    friendsTotal,
    postsTotal,
    sharesTotal,
  };
};

export default getProfile;
