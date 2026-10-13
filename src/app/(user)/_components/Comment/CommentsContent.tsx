
import { Comment } from "@/types/comment.Types";
import { getLikeComment } from "@/helper/like/getLikeComment";
import CommentRealTime from "./CommentRealTime";

type Props = {
  comments: Comment[];
  accountId: string;
};

const CommentsContent = async ({
  comments,
  accountId,
}: Props) => {
  const commentsWithLikes = await Promise.all(
    comments.map(async (comment) => {
      const liked = await getLikeComment(
        comment.id,
        accountId,
      );

      return {
        comment,
        isLiked: liked?.isLiked ?? false,
        likedCount: liked?.likedCount ?? 0,
      };
    }),
  );

  return (
    <CommentRealTime
      initialComments={commentsWithLikes}
      accountId={accountId}
    />
  );
};

export default CommentsContent;
