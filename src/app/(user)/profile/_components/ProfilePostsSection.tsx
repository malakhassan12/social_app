import { FC } from "react";
import getProfilePosts from "@/helper/profile/getProfilePosts";
import { Post } from "@/types/post.Types";
import { Account } from "@/types/account.Types";
import PostsVirtuoso from "../../_components/Post/PostsVirtuoso";

const ProfilePostsSection: FC<{
  searchParams: Promise<{
    pagePosts?: string | number;
  }>;
  profileId: string | undefined;
  account: Account;
}> = async ({ searchParams, profileId, account }) => {
  const { pagePosts } = await searchParams;

  const {
    posts,
    currentPage,
    hasNextPage,
  } = await getProfilePosts(profileId, pagePosts as string | number);

  return (
    <section className="h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Activity
        </h3>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {posts.length} {posts.length === 1 ? "item" : "items"}
        </span>
      </div>

      <PostsVirtuoso
        posts={posts as unknown as Post[]}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        account={account as unknown as Account}
        profileMode
        profileId={profileId}
      />
    </section>
  );
};

export default ProfilePostsSection;
