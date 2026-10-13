import SendMessage from "../../(.)send-message/[conversationId]/page";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
  searchParams: Promise<{
    accountId?: string;
  }>;
};

export default function Page(props: Props) {
  return <SendMessage {...props} />;
}