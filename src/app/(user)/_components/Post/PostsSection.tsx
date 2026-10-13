import getPosts from "@/helper/post/getPosts";

import PostsVirtuoso from "./PostsVirtuoso";
import type { FeedActivity } from "./PostsVirtuoso";
import getAccount from "@/helper/account/getAccount";
import { Account } from "@/types/account.Types";

async function PostsSection({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [postResult, account] = await Promise.all([
    getPosts(page ?? "1"),
    getAccount(),
  ]);
  const { posts, currentPage, hasNextPage } = postResult;

  return (
    <div className="h-screen">
      <PostsVirtuoso
        posts={posts as unknown as FeedActivity[]}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        account={account as unknown as Account}
        realtime
      />
    </div>
  );
}

export default PostsSection;
