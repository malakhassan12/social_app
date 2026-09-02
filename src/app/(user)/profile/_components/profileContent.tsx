import { Post } from "@/types/post.Types";
import ShowFollow from "../_components/ShowFollow";
import { Share } from "@/types/share.Types";
import PostCard from "../../_components/Post/Post";
import ShareCard from "../_components/ShareCard";
import getProfile from "@/helper/getProfile";
import { FC } from "react";
import { Friend } from "@/types/friend.Types";

type ProfileContentProps = {
    params: Promise<{
    accountId: string;
  }>;
};
const ProfileContent: FC<ProfileContentProps> = async ({ params }) => {

  const routeParams = await params
  const { user, followers, followings, friends, posts, shares } =
    await getProfile(routeParams.accountId);

  const feedItems = [
    ...posts.map((post) => ({ type: "post" as const, data: post })),
    ...shares.map((share) => ({ type: "share" as const, data: share })),
  ].sort((a, b) => {
    const dateA = new Date(a.data.createdAt).getTime();
    const dateB = new Date(b.data.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <>
      <ShowFollow
        user={user as unknown as Friend}
        followers={followers as unknown as Friend[]}
        followings={followings as unknown as Friend[]}
        posts={posts as unknown as Post[]}
        friends = {friends as unknown as Friend[] }
      />

      {/* Posts & Shares Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Activity
          </h3>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {feedItems.length} {feedItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-4">
          {feedItems.map((item) => {
            if (item.type === "post") {
              return (
                <PostCard
                  key={item.data.id}
                  post={item.data as unknown as Post}
                />
              );
            } else {
              return (
                <ShareCard
                  key={item.data.id}
                  share={item.data as unknown as Share}
                />
              );
            }
          })}
        </div>
      </section>
    </>
  );
};

export default ProfileContent;
