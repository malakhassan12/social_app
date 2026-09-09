import { Account } from "./account.Types";
import { Post } from "./post.Types";

export type Like = {
  id: string;

  userId: string;

  postId: string | null;
  commentId: string | null;

  createdAt: string | Date;

  account: Account;

  post?: Post | null;

  comment?: Comment | null;
};

export type Comment = {
  id: string;

  content: string;

  likes?: Like[];

  postId: string;

  accountId: string;

  createdAt: string | Date;

  author: Account;

  post?: Post;
};
