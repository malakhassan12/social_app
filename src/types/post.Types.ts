import { Account } from "./account.Types";
import { LIKEPOST } from "./like.Types";

interface Post {
  id: string;
  desc: string;
  image?: string[];
  video?: string[];
  isPrivate: boolean;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  likes: LIKEPOST[];
  author: Account
}

export type { Post };
