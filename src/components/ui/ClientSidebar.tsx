"use client";

import { useSyncExternalStore } from "react";
import { AppSidebar } from "./app-sidebar";

export default function ClientSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
