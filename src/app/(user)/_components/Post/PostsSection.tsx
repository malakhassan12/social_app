import { Post } from "@/types/post.Types";
import PostCard from "./Post";
import { cookies } from "next/headers";

async function PostsSection() {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.API_V1}/api/post`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const data = await res.json();
  const posts = data?.posts;

  return (
    <>
      {posts?.map((post: Post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </>
  );
}

export default PostsSection;
