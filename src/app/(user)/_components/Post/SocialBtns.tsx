import { Post } from "@/types/post.Types";
import { getShare } from "@/helper/share/getShare";
import { getLikePost } from "@/helper/like/getLikePost";
import { Account } from "@/types/account.Types";
import SocialBtnsClient from "./SocialBtnsClient";

const SocialBtns = async ({
  post,
  showComment = true,
  account,
}: {
  post: Post;
  showComment?: boolean;
  account: Account;
}) => {
  const shared = await getShare(post?.id, account?.id as string);

  const liked = await getLikePost(post?.id, account?.id as string);

  return (
    <SocialBtnsClient
      post={post}
      account={account}
      showComment={showComment}
      isLiked={liked?.isLiked ?? false}
      likedCount={liked?.likedCount ?? 0}
      isShared={shared?.isShared ?? false}
      sharedCount={shared?.sharedCount ?? 0}
    />
  );
};

export default SocialBtns;
