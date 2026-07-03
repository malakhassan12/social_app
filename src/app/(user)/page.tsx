import CreatePostBar from "@/components/Bar/CreatePostBar";
import PostsSection from "./_components/Post/PostsSection";
import { Metadata } from "next";
import { Suspense } from "react";
import PostsSkeleton from "@/components/Skelton/PostsSkeleton";

export const metadata: Metadata = {
  title: "Home Page",
};

export default async function Home() {
  return (
    <>
      <CreatePostBar />
      <br />
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />
      </Suspense>{" "}
    </>
  );
}
