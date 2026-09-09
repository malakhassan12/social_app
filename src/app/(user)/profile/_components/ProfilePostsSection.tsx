import ShareCard from "./ShareCard";
import { FC } from "react";
import getProfilePosts from "@/helper/getProfilePosts";
import { Share } from "@/types/share.Types";
import { Post } from "@/types/post.Types";
import PostCard from "../../_components/Post/Post";
import PostsSection from "./PostsSection";

const ProfilePostsSection: FC<{
  searchParams: Promise<{
    pagePosts?: string | number;
  }>;
  profileId: string | undefined;
}> = async ({ searchParams, profileId }) => {
  const { pagePosts } = await searchParams;

  const {
    posts,
    currentPage,

    limit,

    total,

    totalPages,

    hasNextPage,

    hasPreviousPage,
  } = await getProfilePosts(profileId, pagePosts as string | number);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Activity
        </h3>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {posts.length} {posts.length === 1 ? "item" : "items"}
        </span>
      </div>

      <PostsSection
        currentPage={currentPage}
        limit={limit}
        total={total}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        profileId={profileId}
      />
      <br/>

      <div className="space-y-4">
        {posts.map((item) => {
          if (item.type === "POST") {
            return (
              <PostCard key={item.id} post={item.post as unknown as Post} />
            );
          } else {
            return (
              <ShareCard key={item.id} share={item.share as unknown as Share} />
            );
          }
        })}
      </div>
    </section>
  );
};

export default ProfilePostsSection;
