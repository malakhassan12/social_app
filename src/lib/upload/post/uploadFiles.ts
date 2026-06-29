"use client";

import { useRef, useState } from "react";

export function useFilesUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const [previews, setPreviews] = useState<
    {
      url: string;
      type: "image" | "video";
      name: string;
    }[]
  >([]);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const validateFile = (file: File, type: "image" | "video") => {
    const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new Error(`${file.name} is too large`);
    }

    if (type === "image" && !file.type.startsWith("image")) {
      throw new Error("Invalid image");
    }

    if (type === "video" && !file.type.startsWith("video")) {
      throw new Error("Invalid video");
    }
  };

const handleFilesChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  type: "image" | "video",
) => {
  const input = e.target;

  const selected = Array.from(input.files ?? []);

  const validFiles: File[] = [];

  const newPreviews = selected.map((file) => {
    validateFile(file, type);

    validFiles.push(file);

    return {
      url: URL.createObjectURL(file),
      type,
      name: file.name,
    };
  });


  setFiles((prev) => {
    const updated = [...prev, ...validFiles];

    // update real input
    const dataTransfer = new DataTransfer();

    updated.forEach((file) => {
      dataTransfer.items.add(file);
    });

    input.files = dataTransfer.files;


    return updated;
  });


  setPreviews((prev) => [
    ...prev,
    ...newPreviews,
  ]);
};

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index].url);

    setFiles((prev) => prev.filter((_, i) => i !== index));

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    previews.forEach((file) => {
      URL.revokeObjectURL(file.url);
    });

    setFiles([]);

    setPreviews([]);

    if (imageRef.current) {
      imageRef.current.value = "";
    }

    if (videoRef.current) {
      videoRef.current.value = "";
    }
  };

  return {
    files,
    previews,
    imageRef,
    videoRef,
    handleFilesChange,
    removeFile,
    clearFiles,
  };
}
