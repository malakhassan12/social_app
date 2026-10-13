"use client";

import PostSkeleton from "./PostSkelton";

const PostsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div aria-hidden="true" role="status" aria-live="polite">
      <span className="sr-only">Loading posts…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-4 py-3">
          <PostSkeleton />
        </div>
      ))}
    </div>
  );
};

export default PostsSkeleton;
