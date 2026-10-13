"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import MessagesList from "./MessagesList";
import type { MessageWithSender } from "./MessageItem";
import useChatMessagesRealTime from "../../../../hooks/useChatMessagesRealTime";

type Props = {
  initialMessages: MessageWithSender[];
  conversationId: string;
  currentAccountId: string;
  isGroupConversation: boolean;
  initialHasMoreOlderMessages: boolean;
};

export default function ChatMessages(props: Props) {
  return (
    <ChatMessagesContent
      key={props.conversationId}
      {...props}
    />
  );
}

function ChatMessagesContent({
  initialMessages,
  conversationId,
  currentAccountId,
  isGroupConversation,
  initialHasMoreOlderMessages,
}: Props) {
  const [messages, setMessages] =
    useState<MessageWithSender[]>(initialMessages);


    console.log("Fro client" , messages)

  const [hasMoreOlderMessages, setHasMoreOlderMessages] =
    useState(initialHasMoreOlderMessages);

  const [isLoadingOlder, setIsLoadingOlder] =
    useState(false);

  const [isAtBottom, setIsAtBottom] =
    useState(true);

  const [newMessagesCount, setNewMessagesCount] =
    useState(0);

  const isAtBottomRef = useRef(true);

  /*
   * IMPORTANT:
   * Sync server data -> client state
   */
  const [previousInitialData, setPreviousInitialData] =
    useState({
      initialMessages,
      initialHasMoreOlderMessages,
    });

  if (
    previousInitialData.initialMessages !== initialMessages ||
    previousInitialData.initialHasMoreOlderMessages !==
      initialHasMoreOlderMessages
  ) {
    setPreviousInitialData({
      initialMessages,
      initialHasMoreOlderMessages,
    });
    setMessages(initialMessages);
    setHasMoreOlderMessages(initialHasMoreOlderMessages);
    setNewMessagesCount(0);
    setIsAtBottom(true);
  }

  useEffect(() => {
    isAtBottomRef.current = isAtBottom;
  }, [isAtBottom]);

  const loadOlderMessages = useCallback(async () => {
    if (
      isLoadingOlder ||
      !hasMoreOlderMessages
    ) {
      return 0;
    }

    const oldestMessage = messages[0];

    if (!oldestMessage) {
      return 0;
    }

    setIsLoadingOlder(true);

    try {
      const result = await fetch(
        `/api/messages/${conversationId}?before=${encodeURIComponent(
          new Date(
            oldestMessage.createdAt,
          ).toISOString(),
        )}&limit=10`,
      );

      if (!result.ok) {
        throw new Error(
          "Failed to load older messages",
        );
      }

      const data = await result.json();

      const olderMessages =
        data.messages as MessageWithSender[];

      if (olderMessages.length > 0) {
        setMessages((current) => [
          ...olderMessages,
          ...current,
        ]);
      }

      setHasMoreOlderMessages(data.hasMore);

      return olderMessages.length;
    } catch (error) {
      console.error(
        "loadOlderMessages error:",
        error,
      );

      return 0;
    } finally {
      setIsLoadingOlder(false);
    }
  }, [
    conversationId,
    messages,
    isLoadingOlder,
    hasMoreOlderMessages,
  ]);

  const handleNewMessage = useCallback(
    (message: MessageWithSender) => {
      setMessages((current) => {
        if (
          current.some(
            (item) => item.id === message.id,
          )
        ) {
          return current;
        }

        return [...current, message];
      });

      if (
        !isAtBottomRef.current &&
        message.senderId !== currentAccountId
      ) {
        setNewMessagesCount(
          (count) => count + 1,
        );
      }
    },
    [currentAccountId],
  );

  const handleAtBottomStateChange = useCallback(
    (atBottom: boolean) => {
      isAtBottomRef.current = atBottom;
      setIsAtBottom(atBottom);

      if (atBottom) {
        setNewMessagesCount(0);
      }
    },
    [],
  );

  const handleMessageRead = useCallback(
    ({
      messageId,
      accountId,
    }: {
      messageId: string;
      accountId: string;
    }) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== messageId) {
            return message;
          }

          const alreadyExists =
            message.messageReads?.some(
              (read) =>
                read.accountId === accountId,
            );

          if (alreadyExists) {
            return message;
          }

          return {
            ...message,
            messageReads: [
              ...(message.messageReads ?? []),
              {
                accountId,
              },
            ],
          };
        }),
      );
    },
    [],
  );

  useChatMessagesRealTime({
    conversationId,
    onNewMessage: handleNewMessage,
    onMessageRead: handleMessageRead,
  });

  return (
    <MessagesList
      messages={messages}
      currentAccountId={currentAccountId}
      conversationId={conversationId}
      isGroupConversation={isGroupConversation}
      onLoadOlder={loadOlderMessages}
      hasMoreOlderMessages={hasMoreOlderMessages}
      isLoadingOlder={isLoadingOlder}
      newMessagesCount={newMessagesCount}
      isAtBottom={isAtBottom}
      onAtBottomStateChange={
        handleAtBottomStateChange
      }
    />
  );
}