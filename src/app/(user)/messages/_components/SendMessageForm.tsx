"use client";

import sendMessage from "@/actions/chat/sendMessage";

import { FC, useTransition } from "react";

import { toast } from "sonner";

import ChatInput from "./ChatInput";
import { Conversation } from "@/generated/prisma/client";
import { Account } from "@/types/account.Types";
import { useChatReply } from "../../../../context/ChatReplyContext";

const SendMessageForm: FC<{
  conversationId: string | null | undefined;
  accountId: string;
  selectedAccountId?: string;
  conversation?: Conversation;
  account?: Account;
}> = ({
  selectedAccountId,
  accountId,
  conversationId,
  conversation,
  account,
}) => {
  const [pending, startTransition] = useTransition();
  const { replyingTo, setReplyingTo } = useChatReply();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const res = await sendMessage({
        selectedAccountId,
        accountId,
        conversationId,
        formData,
        replyToMessageId: replyingTo?.id,
      });

      if (!res.success) {
        toast.error(
          res.errors?.content?.[0] ||
            res.errors?.image?.[0] ||
            res.message ||
            "Failed to send message",
        );

        return;
      }

      setReplyingTo(null);
      toast.success("Message sended successfully");
    });
  };

  return (
    <>
      <ChatInput
        submit={submit}
        pending={pending}
        conversationId={conversationId as string}
        conversation={conversation}
        account={account}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </>
  );
};

export default SendMessageForm;
