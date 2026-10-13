"use client";

import {
  useEffect,
  useRef,
} from "react";

type MessageVisibilityProps = {
  messageId: string;
  senderId: string;
  currentAccountId: string;
  isRead: boolean;

  onVisible: (messageId: string) => void;

  children: React.ReactNode;
};

const MessageVisibility = ({
  messageId,
  senderId,
  currentAccountId,
  isRead,
  onVisible,
  children,
}: MessageVisibilityProps) => {
  const ref =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    // My own message does not need to be
    // marked as read.
    if (senderId === currentAccountId) {
      return;
    }

    // Already read.
    if (isRead) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            document.visibilityState === "visible"
          ) {
            onVisible(messageId);

            observer.disconnect();
          }
        },
        {
          threshold: 0.5,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    messageId,
    senderId,
    currentAccountId,
    isRead,
    onVisible,
  ]);

  return <div ref={ref}>{children}</div>;
};

export default MessageVisibility;