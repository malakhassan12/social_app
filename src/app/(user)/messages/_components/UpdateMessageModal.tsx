"use client";

import { FC, useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatInput from "./ChatInput";
import updateMessage from "@/actions/chat/updateMessage";

interface UpdateMessageModalProps {
  messageId: string;
  data?: {
    content?: string;
    image?: string;
  };
  conversationId: string;
}

const UpdateMessageModal: FC<UpdateMessageModalProps> = ({
  messageId,
  data,
  conversationId,
}) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateMessage({ messageId, formData });

      if (!res.success) {
        toast.error(res.errors?.content || "Failed to update message");
        return;
      }

      toast.success("Message updated");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setOpen(true);
          }}
          className="
            w-full justify-start gap-2
            text-gray-600 hover:text-gray-900
            hover:bg-gray-100 dark:hover:bg-gray-800
            rounded-md transition-colors
          "
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border-gray-200 dark:border-gray-800">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/25">
              <Pencil className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Edit Message
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                Make changes and save to update
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 sm:px-6 py-4">
          <ChatInput
            submit={submit}
            pending={pending}
            data={data}
            conversationId={conversationId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMessageModal;
