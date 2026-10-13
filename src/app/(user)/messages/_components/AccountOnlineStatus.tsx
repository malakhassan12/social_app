"use client";

import { getSocket } from "@/lib/socket/socket";
import { useEffect, useState } from "react";

type Props = {
  accountId: string;
  initialOnline: boolean;
};

export default function AccountOnlineStatus({
  accountId,
  initialOnline,
}: Props) {
  const [isOnline, setIsOnline] = useState(initialOnline);

  useEffect(() => {
    const socket = getSocket();

    // الاتصال هيحصل مرة واحدة فعليًا (getSocket بترجع نفس الـ instance)
    // حتى لو استُدعيت من كذا component في نفس الوقت
    socket.connect();

    const handleOnline = (onlineAccountId: string) => {
      if (onlineAccountId === accountId) {
        setIsOnline(true);
      }
    };

    const handleOffline = (offlineAccountId: string) => {
      if (offlineAccountId === accountId) {
        setIsOnline(false);
      }
    };

    socket.on("presence:online", handleOnline);
    socket.on("presence:offline", handleOffline);

    return () => {
      socket.off("presence:online", handleOnline);
      socket.off("presence:offline", handleOffline);
      // ملحوظة: متعملش socket.disconnect() هنا
      // لأن components تانية على الشاشة ممكن لسه محتاجة نفس الاتصال
    };
  }, [accountId]);

  if (!isOnline) {
    return null;
  }

  return (
    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
  );
}