import { FC } from "react";
import UpdateMessageModal from "./UpdateMessageModal";
import { Message } from "@/generated/prisma/browser";

const UpdateMsgBtn: FC<{
  message: Partial<Message>;
  conversationId: string;
  closeMenu: () => void;
}> = ({ message, conversationId }) => {
  if (!message) return null;

  const data: {
    content?: string;
    image?: string;
  } = {
    content: message.content,
    image: message.image ?? undefined,
  };

  return (
    <UpdateMessageModal
      messageId={message.id as string}
      data={data}
      conversationId={conversationId}
    />
  );
};

export default UpdateMsgBtn;
