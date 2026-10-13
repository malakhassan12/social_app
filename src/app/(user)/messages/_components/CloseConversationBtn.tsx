"use client";

import { ChevronLeft } from "lucide-react";
import { useCallback } from "react";

export default function CloseConversationBtn() {

  const handleClose = useCallback(() => {
    window.location.href = "/messages";
  },[]);

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Back to conversations"
      title="Back to conversations"
      className=" group inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm text-muted-foreground shadow-sm transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground hover:shadow active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background "
    >
      <ChevronLeft
        className="
          h-4.5 w-4.5 sm:h-5 sm:w-5
          transition-transform duration-200
          group-hover:-translate-x-0.5
        "
        strokeWidth={2.4}
        aria-hidden="true"
      />
      <span className="sr-only">Back to conversations</span>
    </button>
  );
}
