import { FollowRequestStatus } from "@/generated/prisma/enums";
import { getAccountId } from "@/helper/getAccountId";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const finalAccountId = await getAccountId();


    // If user is not logged in
    if (!finalAccountId) {
      return Response.json({
        posts: [],
      });
    }

    /*
     * -------------------------------------------------------
     * 1. Get people I follow
     * -------------------------------------------------------
     *
     * followerId = me
     * followingId = person I follow
     */
    const followings = await prisma.follower.findMany({
      where: {
        followerId: finalAccountId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = followings.map((follow) => follow.followingId);

    /*
     * -------------------------------------------------------
     * 2. Get my accepted friends
     * -------------------------------------------------------
     *
     * A friendship can be stored in either direction:
     *
     * me -> friend
     * friend -> me
     *
     * So we check both requester and receiver.
     */
    const friendships = await prisma.followRequest.findMany({
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
    });

    const friendIds = friendships.map((friendship) =>
      friendship.requesterId === finalAccountId
        ? friendship.receiverId
        : friendship.requesterId,
    );

    /*
     * -------------------------------------------------------
     * 3. Combine:
     *
     * me
     * + following
     * + friends
     *
     * Set removes duplicates automatically.
     * -------------------------------------------------------
     */
    const visibleAccountIds = [
      ...new Set([finalAccountId, ...followingIds, ...friendIds]),
    ];

    /*
     * -------------------------------------------------------
     * 4. Get posts
     * -------------------------------------------------------
     *
     * Because the IDs already represent:
     *
     * - me
     * - people I follow
     * - my friends
     *
     * we don't need the public-account condition here.
     */

    const posts = await prisma.post.findMany({
      where: {
        accountId: {
          in: visibleAccountIds,
        },
      },

      orderBy: {
        createdAt: "desc",
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
            username : true,

            name: true,
            image: true,
          },
        },
      },
    });


    return Response.json({
      posts,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Database error",
      },
      {
        status: 500,
      },
    );
  }
}
