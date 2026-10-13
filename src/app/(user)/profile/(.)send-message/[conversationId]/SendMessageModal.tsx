"use client";

import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default function SendMessageModal({
  children,
  title = "Send Message",
  subtitle = "Start a conversation",
}: Props) {
  const router = useRouter();

  const handleClose = () => router.back();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // 🔒 Lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
        flex items-end sm:items-center justify-center
        p-0 sm:p-4
        overscroll-contain
      "
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <Card
        className="
          /* ─── Layout ─────────────────────────────── */
          relative flex flex-col
          bg-white dark:bg-[#1a1a2e]
          w-full
          overflow-hidden
          shadow-2xl border border-gray-200 dark:border-gray-800

          /* ─── Mobile: FULL SCREEN ───────────────── */
          h-dvh max-h-dvh
          max-w-none
          rounded-none
          pb-[env(safe-area-inset-bottom)]

          /* ─── Desktop: centered dialog ──────────── */
          sm:h-[min(90vh,48rem)] sm:max-h-[95vh]
          sm:max-w-150 sm:rounded-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          aria-hidden
          className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 sm:hidden"
        />

        {/* Header */}
        <div
          className="
            flex items-center justify-between
            p-4 sm:p-5 pb-3
            bg-white dark:bg-[#1a1a2e]
            border-b border-gray-100 dark:border-gray-800
            shrink-0
          "
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">
                  💬 Direct
                </Badge>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  •
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {subtitle}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="
              p-2 sm:p-2.5 rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors
            "
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content — the ONLY scroll happens inside <Chat> */}
        {children}
      </Card>
    </div>
  );
}
