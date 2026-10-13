import Image from "next/image";
import { Post } from "@/types/post.Types";
import { Expand, Lock, Play } from "lucide-react";
import Link from "next/link";
import { getCloudinaryImageId } from "@/lib/upload/getCloudinaryImgId";

const PostContent = ({ post }: { post: Post }) => {
  const text = post?.desc || "";
  const shouldTruncate = text.length > 280;
  const displayText = shouldTruncate ? text.slice(0, 280) + "..." : text;

  const images = post?.image || [];
  const imageCount = images.length;
  const imageSizes =
    imageCount > 1
      ? "min(316px, calc((100vw - 56px) / 2))"
      : "min(632px, calc(100vw - 56px))";

  // Determine grid layout based on image count
  const getGridClasses = () => {
    if (imageCount === 0) return "";
    if (imageCount === 1) return "grid-cols-1";
    if (imageCount === 2) return "grid-cols-2";
    if (imageCount === 3) return "grid-cols-2";
    return "grid-cols-2"; // 4+ images
  };

  // Determine aspect ratio based on position and count
  const getAspectClass = (index: number) => {
    if (imageCount === 1) {
      return "aspect-video sm:aspect-[16/10]";
    }

    if (imageCount === 3 && index === 0) {
      return "aspect-[2/3] row-span-2";
    }

    return "aspect-square";
  };
  // Determine if image should span full height (for 3 images layout)
  const getRowSpan = (index: number) => {
    if (imageCount === 3 && index === 0) return "row-span-2";
    return "";
  };

  // Get images to display (max 4 for grid, but show count for remaining)
  const displayImages = imageCount >= 4 ? images.slice(0, 4) : images;
  const remainingCount = imageCount > 4 ? imageCount - 4 : 0;

  return (
    <div className="space-y-4">
      {/* Post Text */}
      {text && (
        <div className="relative">
          <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap wrap-break-words">
            {displayText}
            {shouldTruncate && (
              <span className="text-green-500 dark:text-green-400 font-medium ml-1 cursor-pointer hover:underline">
                Read more
              </span>
            )}
          </p>
        </div>
      )}

      {/* Images Grid */}
      {post?.image && post?.image?.length > 0 && (
        <div className="space-y-2">
          <div className={`grid ${getGridClasses()} gap-1.5`}>
            {displayImages.map((img: string, index: number) => {
              const imageId = getCloudinaryImageId(img);
              const isLastWithRemaining = index === 3 && remainingCount > 0;
              const aspectClass = getAspectClass(index);
              const rowSpan = getRowSpan(index);

              return (
                <div
                  key={img}
                  className={`relative ${aspectClass} ${rowSpan} rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group`}
                >
                  <Link href={`/image/${imageId}`}>
                    <div className="relative w-full h-full cursor-pointer">
                      <Image
                        src={img}
                        alt={`Post image ${index + 1}`}
                        fill
                        sizes={imageSizes}
                        className="object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Expand Badge (only for single image) */}
                      {imageCount === 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                          <Expand className="h-3.5 w-3.5" />
                          <span>Expand</span>
                        </div>
                      )}

                      {/* Remaining Count Overlay */}
                      {isLastWithRemaining && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white text-2xl sm:text-3xl font-bold">
                            +{remainingCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Videos */}
      {post?.video && post?.video?.length > 0 && (
        <div className="space-y-2">
          {post.video.map((vid: string, index: number) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 group"
            >
              <video
                src={vid}
                controls
                className="w-full rounded-xl max-h-100 sm:max-h-125"
                poster="/video-placeholder.jpg"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Play className="h-3 w-3" />
                Video {index + 1}
              </div>
              {post?.isPrivate && (
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Private
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent;
