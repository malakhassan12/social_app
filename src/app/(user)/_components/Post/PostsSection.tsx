import { Post } from "@/types/post.Types";

import PostCard from "./Post";
import getPosts from "@/helper/getPosts";
import PostsPagination from "./PostsPagination";

async function PostsSection({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { page } = await searchParams;

  const {
    posts,
    currentPage,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await getPosts(page ?? "1");

  return (
    <>
      <PostsPagination
        currentPage={currentPage}
        limit={limit}
        total={total}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />

      <br />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post as unknown as Post}
        />
      ))}
    </>
  );
}

export default PostsSection;