"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import formatDate from "@/utils/formatDate";

import MessageItem, { MessageWithSender } from "./MessageItem";

import EmptyPage from "@/components/Empty-Page/EmptyPage";

import { MailboxIcon } from "lucide-react";

import Loader from "@/components/loader/loader";
import useParticipantAdded from "@/hooks/useParticipantAdded";
import useParticipantRemoved from "@/hooks/useParticipantRemoved";

type ParticipantActivity = {
  id: string;
  occurredAt: number;
  text: string;
};

type TimelineItem =
  | {
      kind: "message";
      message: MessageWithSender;
      messageIndex: number;
      occurredAt: number;
    }
  | {
      kind: "activity";
      activity: ParticipantActivity;
      occurredAt: number;
    };

type MessagesListProps = {
  messages: MessageWithSender[];

  currentAccountId: string;

  conversationId: string;

  isGroupConversation: boolean;

  onLoadOlder: () => Promise<number>;

  hasMoreOlderMessages: boolean;

  isLoadingOlder: boolean;

  newMessagesCount: number;

  isAtBottom: boolean;

  onAtBottomStateChange: (atBottom: boolean) => void;
};

/*
 * =====================================================
 * Virtuoso logical start index
 * =====================================================
 *
 * This is NOT a database ID.
 * This is NOT a message ID.
 *
 * It is only a logical coordinate for Virtuoso.
 */

const START_INDEX = 100_000;

/*
 * =====================================================
 * Memoized message
 * =====================================================
 */

const MemoizedMessageItem = memo(MessageItem);

/*
 * =====================================================
 * Message row
 * =====================================================
 */

type MessageRowProps = {
  message: MessageWithSender;

  previousMessage?: MessageWithSender;

  nextMessage?: MessageWithSender;

  currentAccountId: string;

  conversationId: string;

  isGroupConversation: boolean;

  showDate: boolean;
};

const MessageRow = memo(function MessageRow({
  message,
  previousMessage,
  nextMessage,
  currentAccountId,
  conversationId,
  isGroupConversation,
  showDate,
}: MessageRowProps) {
  const isConsecutive =
    Boolean(previousMessage) && previousMessage!.senderId === message.senderId;

  const isLastInGroup =
    !nextMessage || nextMessage.senderId !== message.senderId;

  return (
    <div className="py-1.5">
      {showDate && (
        <div className="flex items-center justify-center py-2">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-wider">
            {formatDate(new Date(message.createdAt).toDateString())}
          </span>
        </div>
      )}

      <MemoizedMessageItem
        message={message}
        currentAccountId={currentAccountId}
        isConsecutive={isConsecutive}
        isLastInGroup={isLastInGroup}
        isGroup={isGroupConversation}
        conversationId={conversationId}
      />
    </div>
  );
});

/*
 * =====================================================
 * MessagesList
 * =====================================================
 */

export default function MessagesList({
  messages,
  currentAccountId,
  conversationId,
  isGroupConversation,
  onLoadOlder,
  hasMoreOlderMessages,
  isLoadingOlder,
  newMessagesCount,
  isAtBottom,
  onAtBottomStateChange,
}: MessagesListProps) {
  const [participantActivities, setParticipantActivities] = useState<
    ParticipantActivity[]
  >([]);
  const activityIdRef = useRef(0);

  const handleParticipantAdded = useCallback(
    (event: {
      name: string;
      participantNames: string[];
      createdAt?: string;
    }) => {
      const participantNames = event.participantNames.filter(Boolean);
      if (participantNames.length === 0) return;

      setParticipantActivities((current) => [
        ...current,
        {
          id: `added-${activityIdRef.current++}`,
          occurredAt: event.createdAt
            ? new Date(event.createdAt).getTime()
            : Date.now(),
          text: `${event.name || "A participant"} added ${participantNames.join(", ")}`,
        },
      ]);
    },
    [],
  );

  const handleParticipantRemoved = useCallback(
    (event: { name: string; participantName: string; createdAt?: string }) => {
      setParticipantActivities((current) => [
        ...current,
        {
          id: `removed-${activityIdRef.current++}`,
          occurredAt: event.createdAt
            ? new Date(event.createdAt).getTime()
            : Date.now(),
          text: `${event.name || "An admin"} removed ${event.participantName}`,
        },
      ]);
    },
    [],
  );

  useParticipantAdded({
    conversationId,
    onParticipantAdded: handleParticipantAdded,
  });
  useParticipantRemoved({
    conversationId,
    accountId: currentAccountId,
    onParticipantRemoved: handleParticipantRemoved,
  });

  const timelineItems = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = messages.map((message, messageIndex) => ({
      kind: "message",
      message,
      messageIndex,
      occurredAt: new Date(message.createdAt).getTime(),
    }));

    for (const activity of participantActivities) {
      items.push({
        kind: "activity",
        activity,
        occurredAt: activity.occurredAt,
      });
    }

    return items.sort((a, b) => a.occurredAt - b.occurredAt);
  }, [messages, participantActivities]);

  /*
   * =====================================================
   * Virtuoso ref
   * =====================================================
   */

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  /*
   * =====================================================
   * Prevent duplicate load requests
   * =====================================================
   */

  const loadingOlderRef = useRef(false);

  /*
   * =====================================================
   * firstItemIndex
   * =====================================================
   *
   * IMPORTANT:
   *
   * We keep this in STATE.
   *
   * We DO NOT calculate:
   *
   * START_INDEX - messages.length
   *
   * on every render.
   *
   * Why?
   *
   * Because realtime messages are appended
   * to the END of the array.
   *
   * Appending a message must NOT move the
   * logical first item.
   */

  const [firstItemIndex, setFirstItemIndex] = useState(
    () => START_INDEX - messages.length,
  );

  /*
   * =====================================================
   * Reset firstItemIndex when conversation changes
   * =====================================================
   */

  /*
   * =====================================================
   * Handle start reached
   * =====================================================
   */

  const handleStartReached = useCallback(async () => {
    if (!hasMoreOlderMessages) {
      return;
    }

    if (isLoadingOlder || loadingOlderRef.current) {
      return;
    }

    loadingOlderRef.current = true;

    try {
      const added = await onLoadOlder();

      /*
       * Older messages were prepended.
       *
       * Move the logical first item
       * backwards by the number of
       * newly-added messages.
       */
      if (added > 0) {
        setFirstItemIndex((current) => current - added);
      }
    } finally {
      loadingOlderRef.current = false;
    }
  }, [hasMoreOlderMessages, isLoadingOlder, onLoadOlder]);
  /*


  /*
   * =====================================================
   * IMPORTANT
   * =====================================================
   *
   * firstItemIndex must be decreased exactly
   * when older messages are prepended.
   *
   * The cleanest way is for parent to tell us
   * how many older messages were loaded.
   */

  /*
   * =====================================================
   * Follow output
   * =====================================================
   */

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? "smooth" : false;
  }, []);

  /*
   * =====================================================
   * Render one item
   * =====================================================
   */

  const itemContent = useCallback(
    (index: number, item: TimelineItem) => {
      if (item.kind === "activity") {
        return (
          <div className="flex justify-center py-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {item.activity.text}
            </span>
          </div>
        );
      }

      const message = item.message;
      const previousMessage = messages[item.messageIndex - 1];
      const nextMessage = messages[item.messageIndex + 1];

      const showDate =
        !previousMessage ||
        new Date(previousMessage.createdAt).toDateString() !==
          new Date(message.createdAt).toDateString();

      return (
        <MessageRow
          message={message}
          previousMessage={previousMessage}
          nextMessage={nextMessage}
          currentAccountId={currentAccountId}
          conversationId={conversationId}
          isGroupConversation={isGroupConversation}
          showDate={showDate}
        />
      );
    },
    [
      messages,
      currentAccountId,
      conversationId,
      isGroupConversation,
    ],
  );

  /*
   * =====================================================
   * Empty
   * =====================================================
   */

  if (messages.length === 0 && participantActivities.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <EmptyPage
          title="No Messages yet"
          desc=""
          icon={<MailboxIcon className="h-6 w-6" />}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="h-full min-h-full">
        <Virtuoso
          ref={virtuosoRef}
          className="hide-scrollbar"
          style={{
            height: "100%",
          }}
          data={timelineItems}
          startReached={handleStartReached}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={timelineItems.length - 1}
          followOutput={followOutput}
          atBottomStateChange={onAtBottomStateChange}
          atBottomThreshold={80}
          itemContent={itemContent}
          increaseViewportBy={{
            top: 300,
            bottom: 300,
          }}
          components={{
            Header: () =>
              isLoadingOlder ? (
                <div className="flex w-full items-center justify-center gap-3 py-6">
                  <Loader />

                  <span className="text-sm text-muted-foreground">
                    Loading older messages...
                  </span>
                </div>
              ) : null,
          }}
        />

        {!isAtBottom && newMessagesCount > 0 && (
          <button
            type="button"
            onClick={() => {
              virtuosoRef.current?.scrollToIndex({
                index: timelineItems.length - 1,
                align: "end",
                behavior: "smooth",
              });
            }}
            className=" absolute bottom-4 left-1/2 z-30 -translate-x-1/2
 flex items-center gap-2
 rounded-full border border-border/60 bg-background/95 px-3 py-2
 text-xs font-medium text-foreground
 shadow-lg backdrop-blur
 transition-all duration-200
 hover:scale-105
            "
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              ↓
            </span>

            <span>
              {newMessagesCount}{" "}
              {newMessagesCount === 1 ? "new message" : "new messages"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
