import { Suspense } from "react";
import Chat from "../../_components/Chat";
import ChatSkeleton from "../../../../../components/Skelton/ChatSkeleton";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;

  searchParams: Promise<{
    accountId?: string;
  }>;
};

export default function Page(props: Props) {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <Chat {...props} />
    </Suspense>
  );
}
