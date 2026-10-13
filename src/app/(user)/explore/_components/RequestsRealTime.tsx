"use client";

import { getSocket } from "@/lib/socket/socket";
// import { socket } from "@/lib/socket/socket";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RequestsRealTime = () => {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    const handleFollowCreated = () => {
      router.refresh();
    };

    socket.on("publish:explore", handleFollowCreated);

    return () => {
      socket.off("publish:explore", handleFollowCreated);
    };
  }, [router]);

  return null;
};

export default RequestsRealTime;
