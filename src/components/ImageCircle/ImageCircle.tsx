"use client";

import { Camera, ImagePlus, X } from "lucide-react";

import Image from "next/image";

import { FC, useRef, useState } from "react";

import { toast } from "sonner";

const ImageCircle: FC<{
  pending: boolean;
  initialImage?: string;
}> = ({ pending, initialImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage ?? null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Image handling ─────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => setImagePreview(reader.result as string);

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={pending}
        className="group relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 transition-colors flex items-center justify-center"
        aria-label="Upload profile image"
      >
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt="Profile preview"
              fill
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </>
        ) : (
          <ImagePlus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        )}
      </button>

      {imagePreview && (
        <button
          type="button"
          onClick={removeImage}
          disabled={pending}
          className=" absolute -top-0.5 -right-0.5h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-sm
          "
          aria-label="Remove image"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        disabled={pending}
        className="hidden"
      />

      <input
        type="hidden"
        name="removeImage"
        value={imagePreview === null && initialImage ? "true" : "false"}
      />
    </div>
  );
};

export default ImageCircle;
