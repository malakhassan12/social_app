export type LikeResponse = {
  success: boolean;
  liked: boolean;
  likesCount?: number;
  errors?: { message: string };
};

export type LIKEPOST = {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
};
