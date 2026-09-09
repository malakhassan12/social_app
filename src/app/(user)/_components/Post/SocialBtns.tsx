import { ButtonGroup } from "@/components/ui/button-group";
import SharePostBtn from "./SharePostBtn";
import LikePostBtn from "../Like/LikePostBtn";
import { Post } from "@/types/post.Types";
import { getShare } from "@/helper/getShare";
import { getLikePost } from "@/helper/getLikePost";
import CommentBtn from "../Comment/CommentBtn";
import { Account } from "@/types/account.Types";

const SocialBtns = async ({
  post,
  showComment = true,
  account 
}: {
  post: Post;
  showComment?: boolean;
  account : Account
}) => {
  const shared = await getShare(post?.id , account?.id as string);

  const liked = await getLikePost(post?.id , account?.id as string);

  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <LikePostBtn
          post={post}
          isLike={liked?.isLiked as boolean}
          likedCount={liked?.likedCount as number}
        />
        {showComment && <CommentBtn post={post} />}
        <SharePostBtn
          post={post}
          isShared={shared?.isShared as boolean}
          sharedCount={shared?.sharedCount as number}
        />
      </ButtonGroup>
    </div>
  );
};

export default SocialBtns;
