"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type ImageModalProps = {
  imageId: string;
};

export default function ImageModal({
  imageId,
}: ImageModalProps) {
  const router = useRouter();
    const image = `https://res.cloudinary.com/dkfbhkxfb/image/upload/${imageId}.png`;


  const closeModal = () => {
    router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={closeModal}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-3 py-1 text-xl text-white"
        >
          ×
        </button>

        <Image
          src={image}
          alt="Image"
          width={1200}
          height={1200}
          className="max-h-[90vh] w-auto object-contain"
        />
      </div>
    </div>
  );
}