export type ShareResponse = {
  success: boolean;
  shared: boolean;
  sharedCount?: number;
  errors?: { message: string };
};
import { Account } from "./account.Types";
import { Post } from "./post.Types";

export type Share = {
  id: string;

  shareFromId: string;
  shareToId: string;

  postId: string;

  post?: Post;

  shareFrom?: Account;
  shareTo?: Account;

  createdAt: Date;
};