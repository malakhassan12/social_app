import Chat from "@/app/(user)/messages/_components/Chat";
import SendMessageModal from "./SendMessageModal";
import { Suspense } from "react";
import ChatSkeleton from "@/components/Skelton/ChatSkeleton";

type Props = {
  params: Promise<{
    conversationId: string | null | undefined;
  }>;

  searchParams: Promise<{
    accountId?: string;
  }>;
};

export default function SendMessage(props: Props) {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <SendMessageModal>
        <Chat {...props} />
      </SendMessageModal>
    </Suspense>
  );
}
