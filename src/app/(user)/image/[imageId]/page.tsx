import { Suspense } from "react";

import ImageModal from "./ImageModel";
import ImageModalSkeleton from "@/components/Skelton/ImageModalSkeleton";

export default async function ImagePage({
  params,
}: {
  params: Promise<{ imageId: string }>;
}) {
  return (
    <Suspense fallback={<ImageModalSkeleton />}>
      <ImageSuspense params={params} />
    </Suspense>
  );
}

async function ImageSuspense({
  params,
}: {
  params: Promise<{ imageId: string }>;
}) {
  const { imageId } = await params;

  return <ImageModal imageId={imageId} />;
}
