import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { FC } from "react";

const PreviewsFiles: FC<{
  previews: {
    url: string;
    type: "image" | "video";
    name: string;
  }[];
  removeFile: (index: number) => void;
}> = ({ previews, removeFile }) => {
  return (
    <>
      {previews.map((item, index) => (
        <div key={item.url} className="relative group">
          {item.type === "image" ? (
            <Image
              src={item.url}
              alt={`Preview ${index + 1}`}
              width={80}
              height={80}
              loading="lazy"
              className="
          w-20 h-20 
          object-cover 
          rounded-lg 
          border 
          border-gray-200 
          dark:border-gray-700
        "
            />
          ) : (
            <video
              src={item.url}
              preload="metadata"
              playsInline
              muted
              className="
          w-20 h-20 
          object-cover 
          rounded-lg 
          border 
          border-gray-200 
          dark:border-gray-700
        "
            />
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="
        absolute 
        -top-1 
        -right-1 
        h-5 
        w-5 
        rounded-full
        opacity-0
        group-hover:opacity-100
        transition-opacity
      "
            onClick={() => removeFile(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </>
  );
};

export default PreviewsFiles;
