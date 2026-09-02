import Image from "next/image";
import { Post } from "@/types/post.Types";

const PostContent = ({ post }: { post: Post }) => {
  return (
    <div className="space-y-3">
      <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
        {post?.desc || "Moka"}
      </p>

      {/* Images */}
      {post?.image && post?.image?.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {post.image.map((img: string, index: number) => (
            <div
              key={img}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <Image
                src={img}
                alt={`Post image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Videos */}
      {post?.video && post?.video?.length > 0 && (
        <div className="space-y-1.5">
          {post?.video.map((vid: string, index: number) => (
            <video
              key={index}
              src={vid}
              controls
              className="w-full rounded-lg max-h-100 bg-black/5"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent;
