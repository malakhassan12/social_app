"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import { Post } from "@/types/post.Types";
import { Account } from "@/types/account.Types";
import CommentBtn from "../Comment/CommentBtn";
import LikePostBtn from "../Like/LikePostBtn";
import SharePostBtn from "./SharePostBtn";

const SocialBtnsClient = ({
  post,
  account,
  isLiked,
  likedCount,
  isShared,
  sharedCount,
  showComment = true,
}: {
  post: Post;
  account: Account;
  isLiked: boolean;
  likedCount: number;
  isShared: boolean;
  sharedCount: number;
  showComment?: boolean;
}) => (
  <div className="flex flex-col gap-4">
    <ButtonGroup>
      <LikePostBtn post={post} isLike={isLiked} likedCount={likedCount} />
      {showComment &&
        ((post.isOpenComments && account.id !== post.accountId) ||
          account.id === post.accountId) && <CommentBtn post={post} />}
      <SharePostBtn
        post={post}
        isShared={isShared}
        sharedCount={sharedCount}
      />
    </ButtonGroup>
  </div>
);

export default SocialBtnsClient;
