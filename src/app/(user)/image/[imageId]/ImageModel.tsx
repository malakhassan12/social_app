"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft,  } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageModalProps = {
  imageId: string;
};

export default function ImageModal({
  imageId,
}: ImageModalProps) {
  const router = useRouter();
  const image = `https://res.cloudinary.com/dkfbhkxfb/image/upload/${imageId}.png`;

  const goBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10  backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="text-white hover:bg-white/10 rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          
        </div>
      </header>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl max-h-[80vh]">
          <Image
            src={image}
            alt="Image"
            width={1200}
            height={1200}
            className="w-full h-full object-contain rounded-lg"
            priority
            unoptimized
          />
        </div>
      </div>

     
    </div>
  );
}