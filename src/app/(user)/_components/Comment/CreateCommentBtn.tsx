"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import { useFormStatus } from "react-dom";

const CreateCommentBtn = ({ disabled }: { disabled: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="icon"
      aria-label="Post comment"
      className="group absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full
             bg-linear-to-r from-rose-400 via-orange-400 to-amber-300
             text-[#1a1e2b] shadow-[0_4px_12px_-4px_rgba(251,113,133,0.6)]
             transition-all duration-300
             hover:-translate-y-1/2 hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.7)] hover:brightness-105
             active:scale-95
             disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-[0_4px_12px_-4px_rgba(251,113,133,0.6)]
             dark:text-[#0b0a12] dark:shadow-[0_4px_12px_-4px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_6px_16px_-6px_rgba(251,146,60,0.85)]"
      disabled={pending || disabled}
    >
      {pending ? (
        <Spinner aria-hidden="true" className="h-3.5 w-3.5" />
      ) : (
        <Send
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </Button>
  );
};

export default CreateCommentBtn;