import { Post } from "@/types/post.Types";
import PostCard from "../Post/Post";
import { FC } from "react";

const PostsProfileSection: FC<{ posts: Post[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 dark:text-gray-500">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </div>
  );
};

export default PostsProfileSection;