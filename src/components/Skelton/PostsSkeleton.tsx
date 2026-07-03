import PostSkelton from "./PostSkelton";

const PostsSkeleton = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {[1, 2, 3].map((index) => (
        <PostSkelton key={index} />
      ))}
    </div>
  );
};

export default PostsSkeleton;
