"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket/socket";

export default function PostsRealtime() {
  const router = useRouter();

  useEffect(() => {
    const handlePostCreated = () => {
      console.log("📥 SOCKET EVENT RECEIVED");

      router.refresh();
    };

    socket.on("publish:post", handlePostCreated);

    return () => {
      socket.off("publish:post", handlePostCreated);
    };
  }, [router]);

  return null;
}
