import CreatePostBar from "@/components/Bar/CreatePostBar";
import { Metadata } from "next";
import { Suspense } from "react";
import PostsSkeleton from "@/components/Skelton/PostsSkeleton";
import Posts from "./_components/Post/Posts";

export const metadata: Metadata = {
  title: "Home Page",
};

export default async function Home() {
  return (
    <>
      <CreatePostBar />
      <br />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>{" "}
    </>
  );
}
