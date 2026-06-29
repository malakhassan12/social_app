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
      className="absolute right-1 top-1/2 -translate-y-1/2 
             h-7 w-7 rounded-full
             bg-green-400 hover:bg-green-500
             text-white shadow-sm hover:shadow-md
             transition-all duration-300
             disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || disabled}
    >
      {pending ? (
        <Spinner className="h-3.5 w-3.5" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};

export default CreateCommentBtn;