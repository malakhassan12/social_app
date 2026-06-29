import CreatePostBar from "@/components/Bar/CreatePostBar";
import PostsSection from "./_components/Post/PostsSection";

export default async function Home() {
  return (
    <>
      <CreatePostBar />
      <br/>
      <PostsSection />
    </>
  );
}
