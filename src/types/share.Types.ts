export type ShareResponse = {
  success: boolean;
  shared: boolean;
  errors?: { message: string };
};
import { Post } from "./post.Types";
import { User } from "./profile.Types";

export type Share = {
  id: string;

  shareFromId: string;
  shareToId: string;

  postId: string;

  post?: Post;

  shareFrom?: User;
  shareTo?: User;

  createdAt: Date;
};