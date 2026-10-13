import PostsSection from "./PostsSection";

const Posts = ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) => {
  return <PostsSection searchParams={searchParams} />;
};

export default Posts;
