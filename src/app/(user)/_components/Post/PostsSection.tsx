import { Post } from "@/types/post.Types";
import PostCard from "./Post";

async function PostsSection() {
  const res = await fetch(`${process.env.API_V1}/api/post`);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const data = await res.json();
  const posts = data?.posts;

  return (
    <div className="space-y-4  ">
      {posts?.map((post: Post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </div>
  );
}

export default PostsSection;
