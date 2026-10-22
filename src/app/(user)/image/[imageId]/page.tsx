
import type { Metadata } from "next";
import { Suspense } from "react";

import ImageModal from "./ImageModel";
import ImageModalSkeleton from "@/components/Skelton/ImageModalSkeleton";

type Props = {
  params: Promise<{
    imageId: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { imageId } = await params;

  // TODO: Fetch the image record from your database
  // to get its owning post ID and visibility.
  // Cloudinary URL alone does not provide this information.

  return {
    title: "Photo | Circle",
    description: "View a photo shared on Circle.",

    robots: {
      index: false,
      follow: true,
    },

    // TODO: Add the canonical URL of the owning post
    // after retrieving its ID from the database.
  };
}

export default async function ImagePage({
  params,
}: Props) {
  return (
    <Suspense fallback={<ImageModalSkeleton />}>
      <ImageSuspense params={params} />
    </Suspense>
  );
}

async function ImageSuspense({
  params,
}: Props) {
  const { imageId } = await params;

  return <ImageModal imageId={imageId} />;
}
