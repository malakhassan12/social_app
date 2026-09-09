import { NotificationType } from "@/generated/prisma/enums";
import { Post } from "./post.Types";

type NOTIREQUEST = {
  title: string;
  content: string;
  notificationType: NotificationType;
  receiverId: string;
  creatorId: string;
  postId?: string;
};

type NOTIRESPONSE = {
  title: string;
  content: string;
  notificationType?: NotificationType;
};

interface Notification {
  id: string;
  notificationType: NotificationType;

  receiver: {
    id: string;
    name: string;
    image: string | null;
  };

  creator: {
    id: string;

    name: string;
    image: string | null;
  };

  receiverId: string;
  creatorId: string;

  content: string;
  title: string;

  postId: string | null;

  post?: Post;

  createdAt: Date;

  read: boolean;
}

export type { NOTIRESPONSE, NOTIREQUEST, Notification };
