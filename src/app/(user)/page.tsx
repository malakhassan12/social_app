import { Metadata } from "next";
import { Suspense } from "react";
import PostsSkeleton from "@/components/Skelton/PostsSkeleton";
import Posts from "./_components/Post/Posts";
import CreatePostBarContainer from "./_components/Post/CreatePostBarContainer";

export const metadata: Metadata = {
  title: "Home Page",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <CreatePostBarContainer />
      </Suspense>
      <br />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts searchParams={searchParams} />
      </Suspense>{" "}
    </>
  );
}
