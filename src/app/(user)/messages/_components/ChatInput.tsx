"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { ArrowUpIcon, Loader2, XIcon } from "lucide-react";

import { FC, useMemo, useRef, useState, useEffect } from "react";

import Form from "next/form";

import AddImageBtn from "./AddImageBtn";

import { MessageWithSender } from "./MessageItem";
import { getSocket } from "@/lib/socket/socket";
import { Conversation,  } from "@/generated/prisma/client";
import { Account } from "@/types/account.Types";

const TYPING_HEARTBEAT_INTERVAL = 1500; // لازم يكون أقل من TYPING_TIMEOUT (2000ms)
const TYPING_STOP_DELAY = 1500; // بعد ما يوقف يكتب، استنى قبل ما تبعت "stop"

type ChatInputProps = {
  conversationId: string;
  submit: (formData: FormData) => void;
  pending: boolean;
  replyingTo?: MessageWithSender | null;
  onCancelReply?: () => void;
  data?: {
    content?: string;
    image?: string;
  };
  conversation?: Conversation;
  account?: Account;
};

const ChatInput: FC<ChatInputProps> = ({
  data,
  submit,
  pending,
  replyingTo,
  onCancelReply,
  conversationId,
  conversation,
  account,
}) => {
  console.log(conversation, account);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();

  const imagePreview = useMemo(() => {
    if (!imageFile) {
      return data?.image;
    }

    return URL.createObjectURL(imageFile);
  }, [imageFile, data?.image]);

  /*
   * Revoke the preview URL whenever
   * the selected File changes.
   */
  useEffect(() => {
    return () => {
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  const handleSubmit = (formData: FormData) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (imageFile) {
      formData.set("image", imageFile);
    } else {
      formData.delete("image");
    }

    stopTyping();
    submit(formData);

    setImageFile(undefined);
  };

  const handleImageSelect = (file: File | undefined) => {
    setImageFile(file);
  };
  const isTypingRef = useRef(false);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = () => {
    const socket = getSocket();

    if (!isTypingRef.current) {
      // أول مرة يبدأ يكتب: ابعت فورًا
      socket.emit("typing:start", { conversationId });
      isTypingRef.current = true;

      // ✅ ابدأ heartbeat: كرر إرسال typing:start كل 1.5 ثانية
      // طول ما المستخدم لسه بيكتب، عشان الـ timeout بتاع المستقبل يفضل يتجدد
      heartbeatIntervalRef.current = setInterval(() => {
        socket.emit("typing:start", { conversationId });
      }, TYPING_HEARTBEAT_INTERVAL);
    }

    // في كل مرة يكتب حرف، أجّل "stop" (نفس المنطق القديم)
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);

    stopTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_STOP_DELAY);
  };

  const stopTyping = () => {
    const socket = getSocket();

    if (isTypingRef.current) {
      socket.emit("typing:stop", { conversationId });
      isTypingRef.current = false;
    }

    // ✅ أوقف الـ heartbeat لما يبطل يكتب
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  };
  const handleChange = () => {
    startTyping();
  };

  return (
    <Form action={handleSubmit} className="w-full">
      {/* Reply preview */}
      {replyingTo && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-0 flex-1 border-l-2 border-purple-500 pl-2">
            <p className="text-xs font-medium text-purple-500">
              Replying to {replyingTo.sender?.username ?? "User"}
            </p>

            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {replyingTo.content || "Image"}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancelReply}
            disabled={pending}
            aria-label="Cancel reply"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Message input */}
      <InputGroup>
        <InputGroupTextarea
          name="content"
          placeholder="Type a message..."
          disabled={pending}
          rows={1}
          defaultValue={data?.content ?? ""}
          ref={textareaRef}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />

        <InputGroupAddon align="block-end">
          <AddImageBtn
            disabled={pending}
            image={imagePreview}
            onImageSelect={handleImageSelect}
          />

          <InputGroupButton type="submit" disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="h-4 w-4" />
            )}
          </InputGroupButton>

      
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};

export default ChatInput;
