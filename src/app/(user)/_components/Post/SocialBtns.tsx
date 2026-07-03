import { ButtonGroup } from "@/components/ui/button-group";
import SharePostBtn from "./SharePostBtn";
import LikePostBtn from "../Like/LikePostBtn";
import { Post } from "@/types/post.Types";
import { getShare } from "@/helper/getShare";
import { getLikePost } from "@/helper/getLikePost";
import CommentBtn from "../Comment/CommentBtn";

const SocialBtns = async ({
  post,
  showComment = true,
}: {
  post: Post;
  showComment?: boolean;
}) => {
  const shared = await getShare(post?.id);

  const liked = await getLikePost(post?.id);
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <LikePostBtn
          post={post}
          isLike={liked?.isLiked}
          likedCount={liked?.likedCount}
        />
        {showComment && <CommentBtn post={post} />}
        <SharePostBtn
          post={post}
          isShared={shared?.isShared}
          sharedCount={shared?.sharedCount}
        />
      </ButtonGroup>
    </div>
  );
};

export default SocialBtns;
