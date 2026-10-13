export type ShareResponse = {
  success: boolean;
  shared: boolean;
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