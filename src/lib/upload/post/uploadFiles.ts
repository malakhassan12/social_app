"use client";

import { Post } from "@/types/post.Types";
import { useRef, useState } from "react";

export function useFilesUpload(post?: Post) {
  const [files, setFiles] = useState<File[]>([]);

  const [previews, setPreviews] = useState<
    {
      url: string;
      type: "image" | "video";
      name: string;
    }[]
  >(() => [
    ...(post?.image ?? []).map((url) => ({
      url,
      type: "image" as const,
      name: url,
    })),
    ...(post?.video ?? []).map((url) => ({
      url,
      type: "video" as const,
      name: url,
    })),
  ]);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File, type: "image" | "video") => {
    const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) throw new Error(`${file.name} is too large`);
    if (type === "image" && !file.type.startsWith("image/")) throw new Error("Invalid image");
    if (type === "video" && !file.type.startsWith("video/")) throw new Error("Invalid video");
  };

  const syncInputsWithState = (allFiles: File[]) => {
    const imageDataTransfer = new DataTransfer();
    const videoDataTransfer = new DataTransfer();

    allFiles.forEach((file) => {
      if (file.type.startsWith("image/")) imageDataTransfer.items.add(file);
      if (file.type.startsWith("video/")) videoDataTransfer.items.add(file);
    });

    if (imageRef.current) imageRef.current.files = imageDataTransfer.files;
    if (videoRef.current) videoRef.current.files = videoDataTransfer.files;
  };

  const handleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const input = e.target;
    const selected = Array.from(input.files ?? []);
    if (selected.length === 0) return;

    const validFiles: File[] = [];
    const newPreviews: typeof previews = [];

    try {
      selected.forEach((file) => {
        validateFile(file, type);
        validFiles.push(file);
        newPreviews.push({
          url: URL.createObjectURL(file),
          type,
          name: file.name,
        });
      });

      setFiles((prev) => {
        const updated = [...prev, ...validFiles];
        // 💡 بنزامن الإثنين Inputs مع الحالة الجديدة عشان مفيش واحد يمسح التاني
        syncInputsWithState(updated);
        return updated;
      });

      setPreviews((prev) => [...prev, ...newPreviews]);

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "خطأ في الملفات");
      // لو حصل خطأ رستر الـ input الحالي
      input.value = "";
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = previews[index];

    if (fileToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    const initialFilesCount = (post?.image?.length ?? 0) + (post?.video?.length ?? 0);
    let fileStateIndex = -1;

    if (index >= initialFilesCount) {
      fileStateIndex = index - initialFilesCount;
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));

    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== fileStateIndex);
      // بنزامن الـ Inputs بعد الحذف
      syncInputsWithState(updated);
      return updated;
    });
  };

  const clearFiles = () => {
    previews.forEach((file) => {
      if (file.url.startsWith("blob:")) URL.revokeObjectURL(file.url);
    });
    setFiles([]);
    setPreviews([]);
    if (imageRef.current) imageRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
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