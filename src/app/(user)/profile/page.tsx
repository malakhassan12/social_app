import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import { Post } from "@/types/post.Types";
import { FollowStatus } from "@/generated/prisma/enums";
import ShowFollow from "./_components/ShowFollow";
import { Follower, User } from "@/types/profile.Types";
import { Share } from "@/types/share.Types";
import PostCard from "../_components/Post/Post";
import ShareCard from "./_components/ShareCard";

const Page = async () => {
  const userId = (await getUserId()) as string;

  const [user, followers, followings, posts, shares] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        image: true,
        name: true,
        email: true,
        country: true,
        bio: true,
      },
    }),
    prisma.follower.findMany({
      where: { followingId: userId, status: FollowStatus.ACCEPTED },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.follower.findMany({
      where: { followerId: userId, status: FollowStatus.ACCEPTED },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.share.findMany({
      where: {
        shareToId: userId,
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
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  // Combine posts and shares into a single feed
  const feedItems = [
    ...posts.map((post) => ({ type: 'post' as const, data: post })),
    ...shares.map((share) => ({ type: 'share' as const, data: share })),
  ].sort((a, b) => {
    const dateA = new Date(a.data.createdAt).getTime();
    const dateB = new Date(b.data.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Card */}
      <ShowFollow
        user={user as unknown as User}
        followers={followers as unknown as Follower[]}
        followings={followings as unknown as Follower[]}
        posts={posts as unknown as Post[]}
      />

      {/* Posts & Shares Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Activity
          </h3>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {feedItems.length} {feedItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <div className="space-y-4">
          {feedItems.map((item) => {
            if (item.type === 'post') {
              return <PostCard key={item.data.id} post={item.data as unknown as Post} />;
            } else {
              return <ShareCard key={item.data.id} share={item.data as unknown as Share} />;
            }
          })}
        </div>
      </section>
    </div>
  );
};

export default Page;