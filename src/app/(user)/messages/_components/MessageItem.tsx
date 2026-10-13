"use client";

import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message as PrismaMessage,
  Account,
  MessageReactionType,
} from "@/generated/prisma/client";
import { getTime } from "@/utils/getTime";
import MessageStatus from "./MessageStatus";
import useMessageReadStatus from "@/hooks/useMessageReadStatus";
import { getSocket } from "@/lib/socket/socket";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import MessageReactions from "./MessageReactions";

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

export type MessageWithSender = PrismaMessage & {
  sender: Account;
  messageReads?: { accountId: string }[];
  messageReactions?: {
    type: MessageReactionType;
    accountId: string;
  }[];
  replyToMessage?: {
    id: string;
    content: string | null;
    image: string | null;
    senderId: string;
    sender: Pick<Account, "id" | "username" | "image">;
  } | null;
};

interface MessageItemProps {
  message: MessageWithSender;
  currentAccountId: string;
  conversationId: string;
  isConsecutive?: boolean;
  isLastInGroup?: boolean;
  isGroup?: boolean;
  onJumpToMessage?: (messageId: string) => void;
  registerRef?: (messageId: string, node: HTMLDivElement | null) => void;
}

// ─────────────────────────────────────────────────────
// Reply Preview Sub-Component
// ─────────────────────────────────────────────────────

interface ReplyPreviewProps {
  replyTo: NonNullable<MessageWithSender["replyToMessage"]>;
  isOwn: boolean;
  currentAccountId: string;
  onJumpToMessage?: (messageId: string) => void;
}

const ReplyPreview = ({
  replyTo,
  isOwn,
  currentAccountId,
  onJumpToMessage,
}: ReplyPreviewProps) => {
  const isReplyToOwn = replyTo.senderId === currentAccountId;
  const label = isReplyToOwn ? "You" : replyTo.sender?.username ?? "User";

  const previewText = replyTo.content?.trim()
    ? replyTo.content
    : replyTo.image
      ? "📷 Photo"
      : "Message";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onJumpToMessage?.(replyTo.id);
      }}
      className={`
        mb-1.5 flex w-full max-w-full items-stretch gap-2
        rounded-lg border-l-[3px] px-2 py-1.5
        text-left transition-colors
        cursor-pointer
        ${
          isOwn
            ? "border-white/60 bg-white/15 hover:bg-white/25"
            : "border-emerald-500 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
        }
      `}
      aria-label={`Reply to ${label}: ${previewText}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`
            truncate text-[11px] font-semibold leading-tight
            ${
              isOwn
                ? "text-white/95"
                : "text-emerald-600 dark:text-emerald-400"
            }
          `}
        >
          {label}
        </span>
        <span
          className={`
            line-clamp-2 text-[11px] leading-snug
            ${isOwn ? "text-white/80" : "text-gray-600 dark:text-gray-400"}
          `}
        >
          {previewText}
        </span>
      </div>

      {replyTo.image && (
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
          <Image
            src={replyTo.image}
            alt="Reply thumbnail"
            fill
            sizes="36px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────
// Missing Reply Fallback
// ─────────────────────────────────────────────────────

const MissingReplyPreview = ({ isOwn }: { isOwn: boolean }) => (
  <div
    className={`
      mb-1.5 rounded-lg border-l-[3px] px-2 py-1.5
      text-[11px] italic leading-snug
      ${
        isOwn
          ? "border-white/40 bg-white/10 text-white/70"
          : "border-gray-400 bg-black/5 text-gray-500 dark:bg-white/5 dark:text-gray-400"
      }
    `}
  >
    Original message not available
  </div>
);

// ─────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────

const MessageItem = ({
  message,
  currentAccountId,
  conversationId,
  isConsecutive = false,
  isGroup = false,
  onJumpToMessage,
  registerRef,
}: MessageItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwn = message.senderId === currentAccountId;

  // ─── Content shape ────────────────────────────────
  const hasText = Boolean(message.content?.trim());
  const hasImage = Boolean(message.image);
  const hasReply = Boolean(message.replyToMessageId);
  const isImageOnly = hasImage && !hasText && !hasReply;

  // ─── Read receipts ────────────────────────────────
  const liveReaders = useMessageReadStatus();
  const liveReadersForMessage =
    liveReaders.get(message.id) ?? new Set<string>();
  const readFromServer = message.messageReads?.map((r) => r.accountId) ?? [];
  const allReaders = new Set([...readFromServer, ...liveReadersForMessage]);
  const hasBeenRead = isOwn && allReaders.size > 0;

  const messageRef = useRef<HTMLDivElement | null>(null);
  const readRequestedRef = useRef(false);

  // ─── Merge internal ref + external register ───────
  const setRefs = (node: HTMLDivElement | null) => {
    messageRef.current = node;
    registerRef?.(message.id, node);
  };

  // ─── Auto mark-as-read ────────────────────────────
  useEffect(() => {
    if (isOwn) return;
    if (!messageRef.current) return;

    const alreadyRead =
      message.messageReads?.some(
        (read) => read.accountId === currentAccountId,
      ) ?? false;

    if (alreadyRead) return;

    const socket = getSocket();
    readRequestedRef.current = false;

    const markAsRead = () => {
      if (readRequestedRef.current) return;
      readRequestedRef.current = true;
      socket.emit("message:read", { messageId: message.id });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (socket.connected) {
          markAsRead();
          return;
        }
        socket.once("connect", markAsRead);
        socket.connect();
      },
      { threshold: 0.5 },
    );

    observer.observe(messageRef.current);
    return () => {
      observer.disconnect();
      socket.off("connect", markAsRead);
    };
  }, [message.id, message.messageReads, currentAccountId, isOwn]);

  // ─── Layout flags ─────────────────────────────────
  const showAvatar = !isOwn && !isConsecutive;

  return (
    <Message
      ref={setRefs}
      align={isOwn ? "end" : "start"}
      className={`
        pl-2 group/message flex w-full gap-1.5 sm:gap-2
        px-2 sm:px-4
        animate-in fade-in slide-in-from-bottom-1 duration-200
        ${isConsecutive ? "mt-0.5" : "mt-2 sm:mt-3"}
        mb-4 sm:mb-5
      `}
    >
      <ContextMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
        <ContextMenuTrigger className="contents">
          {/* ─── Avatar column (received) ─────────────── */}
          {!isOwn && (
            <div className="flex w-8 shrink-0 flex-col items-center sm:w-9">
              {showAvatar ? (
                <MessageAvatar className="m-0! h-8 w-8 sm:h-9 sm:w-9">
                  <ProfileAvatar
                    image={message.sender?.image}
                    name={message.sender?.username ?? "User"}
                  />
                </MessageAvatar>
              ) : (
                <div className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden />
              )}
            </div>
          )}

          {/* ─── Bubble column ────────────────────────── */}
          <MessageContent
            className="
              flex min-w-0 max-w-[85%] flex-col
              sm:max-w-[75%]
              md:max-w-md
              lg:max-w-lg
            "
          >
            {/* Sender name (group chats, first in run) */}
            {isGroup && !isOwn && !isConsecutive && (
              <MessageHeader className="mb-0.5! px-1">
                <span className="text-[11px] font-semibold text-emerald-600 sm:text-xs dark:text-emerald-400">
                  {message.sender?.username}
                </span>
              </MessageHeader>
            )}

            <Bubble
              variant={null}
              className={`
                relative overflow-visible
                rounded-2xl!
                shadow-sm!
                transition-shadow duration-200
                hover:shadow-md!
                max-w-full
                ${
                  isOwn
                    ? "rounded-br-md! bg-emerald-600! text-white! dark:bg-emerald-700!"
                    : "rounded-bl-md! bg-gray-100! text-gray-900! dark:bg-gray-800! dark:text-gray-100!"
                }
                ${isImageOnly ? "p-1!" : "px-2.5! py-1.5! sm:px-3! sm:py-2!"}
              `}
            >
              {/* ═══════════════════════════════════════
                  REPLY PREVIEW
                  ═══════════════════════════════════════ */}
              {message.replyToMessage ? (
                <ReplyPreview
                  replyTo={message.replyToMessage}
                  isOwn={isOwn}
                  currentAccountId={currentAccountId}
                  onJumpToMessage={onJumpToMessage}
                />
              ) : hasReply ? (
                <MissingReplyPreview isOwn={isOwn} />
              ) : null}

              {/* ═══════════════════════════════════════
                  IMAGE
                  ═══════════════════════════════════════ */}
              {hasImage && (
                <div
                  className={`
                    relative overflow-hidden rounded-[14px]
                    -mt-0.5
                    ${hasText ? "mb-1" : "-mx-0.5 -mb-0.5"}
                  `}
                >
                  <Image
                    src={message.image!}
                    alt="Message image"
                    width={480}
                    height={480}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 320px"
                    className="
                      block h-auto w-full
                      min-w-45 max-w-65
                      object-cover
                      transition-transform duration-300
                      hover:scale-[1.02]
                      sm:max-w-[320px]
                    "
                    unoptimized
                  />

                  {/* Overlaid timestamp for image-only */}
                  {isImageOnly && (
                    <div
                      className="
                        absolute bottom-1.5 right-1.5
                        flex items-center gap-1
                        rounded-full
                        bg-black/45 px-2 py-0.5
                        backdrop-blur-[2px]
                      "
                    >
                      <span className="text-[10px] font-medium text-white/95">
                        {getTime({ time: message.createdAt })}
                      </span>
                      {isOwn && <MessageStatus hasBeenRead={hasBeenRead} />}
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════
                  TEXT + inline timestamp
                  ═══════════════════════════════════════ */}
              {hasText && (
                <BubbleContent
                  className="
                    p-0!
                    whitespace-pre-wrap [wrap-anywhere]
                    text-[13.5px] leading-[1.35rem]
                    sm:text-sm sm:leading-5
                    bg-transparent
                  "
                >
                  {message.content}

                  {/* Reserve space so the timestamp never overlaps the last line */}
                  <span
                    className="inline-block w-14 align-bottom sm:w-16"
                    aria-hidden
                  />

                  {/* Timestamp + status — bottom-right inside bubble */}
                  <span
                    className={`
                      absolute bottom-0.5 right-2
                      inline-flex items-center gap-0.5
                      text-[10px] leading-none
                      select-none pointer-events-none
                      sm:bottom-1 sm:text-[10.5px]
                      ${
                        isOwn
                          ? "text-white/70"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                  >
                    <span>{getTime({ time: message.createdAt })}</span>
                    {isOwn && <MessageStatus hasBeenRead={hasBeenRead} />}
                  </span>
                </BubbleContent>
              )}

              {/* ═══════════════════════════════════════
                  Reactions — floating on bubble tail
                  ═══════════════════════════════════════ */}
              <MessageReactions
                currentAccountId={currentAccountId}
                message={message}
                isOwn={isOwn}
                conversationId={conversationId}
                closeMenu={() => setMenuOpen(false)}
              />
            </Bubble>
          </MessageContent>
        </ContextMenuTrigger>
      </ContextMenu>
    </Message>
  );
};

export default MessageItem;