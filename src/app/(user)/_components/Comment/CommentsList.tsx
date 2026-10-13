"use client";

import { FC, ReactElement, cloneElement, useOptimistic } from "react";
import { Comment as CommentType } from "@/types/comment.Types";
import { Account } from "@/types/account.Types";
import CommentInput from "./CommentInput";

type CommentsListChildProps = {
  comments: CommentType[];
};

type CommentsListProps = {
  initialComments: CommentType[];
  postId: string;
  account: Account;
  children: ReactElement<CommentsListChildProps>;
};

const CommentsList: FC<CommentsListProps> = ({
  initialComments,
  postId,
  account,
  children,
}) => {
  // 2. إعداد الـ useOptimistic باستخدام الـ Prop المباشر الآمن
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: CommentType) => [...state, newComment],
  );

  const handelAddComment = (optimisticComment: CommentType) => {
    addOptimisticComment(optimisticComment);
  };

  // 3. حقن التحديثات الفورية داخل مكون السيرفر بشكل آمن
  const optimisticChildren = cloneElement(children, {
    comments: optimisticComments,
  });

  return (
    <>
      {/* عرض قائمة التعليقات الفورية */}
      {optimisticChildren}

      {/* حقل إدخال التعليق */}
      <CommentInput
        postId={postId}
        account={account}
        addOptimisticComment={handelAddComment}
      />
    </>
  );
};

export default CommentsList;
