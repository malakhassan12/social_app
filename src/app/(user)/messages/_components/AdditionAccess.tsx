"use client";

import type { ReactNode } from "react";
import useOpenCloseConversation from "@/hooks/useOpenCloseConversation";

export default function AdditionAccess({
  conversationId,
  initialValue,
  isAdmin,
  children,
}: {
  conversationId: string;
  initialValue: boolean;
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [isOpenAddition] = useOpenCloseConversation({
    conversationId,
    initialValue,
    type: "addition",
  });

  if (!isAdmin && !isOpenAddition) {
    return null;
  }

  return children;
}
