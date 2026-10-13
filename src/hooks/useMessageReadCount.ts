"use client";

import getUnreadMessages from "@/helper/chat/getUnReadMessages";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 30_000; // set to 0 to disable polling

export default function useMessageReadCount(
  conversationId: string,
  initialUnreadCount: number,
  currentAccountId: string,
) {
  const pathname = usePathname();
  const isOpen = pathname?.split("/")[2] === conversationId;

  const [count, setCount] = useState(initialUnreadCount);
  const requestId = useRef(0);

  // Fetch the real count from the DB (ignores stale responses)
  const sync = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const res = await getUnreadMessages(conversationId, currentAccountId);
      if (id !== requestId.current) return; // an newer request exists
      if (res.success) setCount(res.count);
    } catch (e) {
      console.error("Failed to sync unread count:", e);
    }
  }, [conversationId, currentAccountId]);

  // 1) Open conversation => badge 0. Otherwise => ask the DB.
  useEffect(() => {
    if (isOpen) {
      requestId.current++; // cancel any in-flight request
      setCount(0);
      return;
    }
    sync();
  }, [pathname, isOpen, sync]);

  // 2) Refresh when the user comes back to the tab, plus optional polling
  useEffect(() => {
    if (isOpen) return;

    const onFocus = () => sync();
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    const timer =
      POLL_INTERVAL_MS > 0 ? setInterval(sync, POLL_INTERVAL_MS) : undefined;

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      if (timer) clearInterval(timer);
    };
  }, [isOpen, sync]);

  return count;
}