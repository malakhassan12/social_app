import PostsRealtime from "./PostsRealTime";
import PostsSection from "./PostsSection";

const Posts = ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) => {
  return (
    <>
      <PostsRealtime />
      <PostsSection searchParams={searchParams} />
    </>
  );
};

export default Posts;
