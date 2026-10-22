import { Metadata } from "next";
import SendMessage from "../../(.)send-message/[conversationId]/page";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
  searchParams: Promise<{
    accountId?: string;
  }>;
};


export const metadata: Metadata = {
  title: {
    absolute: "Send Message | Circle",
  },
  description: "Send messages and communicate with people on Circle.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function Page(props: Props) {
  return <SendMessage {...props} />;
}