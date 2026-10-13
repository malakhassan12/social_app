"use client";

import { FC, useRef } from "react";

import Image from "next/image";

import { ImageIcon, XIcon } from "lucide-react";

import { toast } from "sonner";

interface AddImageBtnProps {
  disabled?: boolean;
  image?: string;
  onImageSelect: (file: File | undefined) => void;
}

const AddImageBtn: FC<AddImageBtnProps> = ({
  disabled = false,
  image,
  onImageSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      e.target.value = "";
      return;
    }

    onImageSelect(file);
  };

  const handleRemoveImage = () => {
    onImageSelect(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            fileInputRef.current?.click();
          }
        }}
        disabled={disabled}
        aria-label="Add image"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      {image && (
        <div className="relative mx-2 mt-1 mb-2">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Image
              src={image}
              alt="Selected image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </>
  );
};

export default AddImageBtn;