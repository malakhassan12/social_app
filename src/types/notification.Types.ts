import { NotificationType } from "@/generated/prisma/enums";

type NOTIREQUEST = {
  title: string;
  content: string;
  notificationType: NotificationType;
  userId: string;
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

  user: {
    name: string;
    image: string | null;
  };

  creator: {
    name: string;
    image: string | null;
  };

  userId: string;
  creatorId: string;

  content: string;

  postId: string | null;

  createdAt: Date;
  read: boolean;
}
export type { NOTIRESPONSE, NOTIREQUEST, Notification };
