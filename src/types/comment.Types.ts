import { Post } from "./post.Types";
import { User } from "./profile.Types";

export type Like = {
  id: string;

  userId: string;

  postId: string | null;
  commentId: string | null;

  createdAt: string | Date;

  user: User;

  post?: Post | null;

  comment?: Comment | null;
};

export type Comment = {
  id: string;

  content: string;

  likes: Like[];

  postId: string;

  authorId: string;

  createdAt: string | Date;

  author: User;

  post?: Post;
};
