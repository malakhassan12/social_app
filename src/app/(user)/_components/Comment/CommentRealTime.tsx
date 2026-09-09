"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket/socket";
// import { socket } from "@/lib/socket/socket";

export default function CommentRealTime() {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    console.log("🟢 CommentRealTime mounted");
    console.log("🟢 socket.connected:", socket.connected);
    console.log("🟢 socket.id:", socket.id);

    const handleComment = (data: unknown) => {
      console.log("🔥🔥 PUBLISH:COMMENT RECEIVED", data);

      router.refresh();

      console.log("🔄 router.refresh() called");
    };

    socket.on("publish:comment", handleComment);

    return () => {
      console.log("🔴 CommentRealTime cleanup");

      socket.off("publish:comment", handleComment);
    };
  }, [router]);

  return null;
}
