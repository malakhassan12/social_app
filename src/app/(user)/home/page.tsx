import { Metadata } from "next";
import { Suspense } from "react";
import PostsSkeleton from "@/components/Skelton/PostsSkeleton";
import Posts from "../_components/Post/Posts";
import CreatePostBarContainer from "../_components/Post/CreatePostBarContainer";
import CreatePostBarSkeleton from "@/components/Skelton/CreatePostBarSkeleton";

export const metadata: Metadata = {
  title: "Home | Circle",
  description: "Your personalized Circle feed.",
  robots: {
    index: false,
    follow: false,
  },
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
      <Suspense fallback={<CreatePostBarSkeleton />}>
        <CreatePostBarContainer />
      </Suspense>
      <div className="h-4" aria-hidden="true" />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts searchParams={searchParams} />
      </Suspense>
    </>
  );
}
