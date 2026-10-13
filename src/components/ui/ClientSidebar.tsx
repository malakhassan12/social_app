"use client";

import { useSyncExternalStore } from "react";

export default function ClientSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => true,
  );
  /*
  
  useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  
  */

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
