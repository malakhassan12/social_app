"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { Virtuoso } from "react-virtuoso";

import { Post } from "@/types/post.Types";
import getPosts from "@/helper/post/getPosts";
import PostView from "./PostView";
import { Account } from "@/types/account.Types";
import Loader from "@/components/loader/loader";
import EmptyPage from "@/components/Empty-Page/EmptyPage";
import { MailboxIcon } from "lucide-react";
import ShareCard from "../../profile/_components/ShareCard";
import { Share } from "@/types/share.Types";
import { getSocket } from "@/lib/socket/socket";
import getPostForFeed from "@/helper/post/getPostForFeed";
import getProfilePosts from "@/helper/profile/getProfilePosts";

export type FeedActivity =
  | { type: "POST"; id: string; createdAt: Date | string; post: Post }
  | { type: "SHARE"; id: string; createdAt: Date | string; share: Share };

type FeedItem = FeedActivity | Post;

// --------------------------------------------------
// Memoized Post Component
// --------------------------------------------------

const PostMemo = memo(({ post, account }: { post: Post; account: Account }) => {
  return <PostView post={post} account={account} />;
});

PostMemo.displayName = "PostMemo";

// --------------------------------------------------
// Footer
// --------------------------------------------------

const Footer = ({
  loading,
  hasNextPage,
}: {
  loading: boolean;
  hasNextPage: boolean;
}) => {
  // Loading more posts
  if (loading && hasNextPage) {
    return (
      <div className="flex w-full items-center justify-center gap-3 py-6">
        <Loader />
        <span className="text-sm text-muted-foreground">
          Loading more posts...
        </span>
      </div>
    );
  }

  // Reached the end of the feed
  if (!hasNextPage) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
        <div className="h-px w-16 bg-border" />
        <p className="text-sm font-medium text-muted-foreground">
          You&apos;re all caught up 🎉
        </p>
        <p className="text-xs text-muted-foreground">No more posts to show</p>
        <div className="h-px w-16 bg-border" />
      </div>
    );
  }

  return null;
};

// --------------------------------------------------
// PostsVirtuoso
// --------------------------------------------------

const PostsVirtuoso = ({
  posts,
  currentPage,
  hasNextPage: initialHasNextPage,
  account,
  realtime = false,
  profileMode = false,
  profileId,
}: {
  posts: FeedItem[];
  currentPage: number;
  hasNextPage: boolean;
  account: Account;
  realtime?: boolean;
  profileMode?: boolean;
  profileId?: string;
}) => {
  const [loadedPosts, setLoadedPosts] = useState<FeedItem[]>(posts);

  const [page, setPage] = useState(currentPage);

  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handlePostCreated = (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("action" in payload) ||
        typeof payload.action !== "string"
      ) {
        return;
      }

      if (payload.action === "disable-comments:posts") {
        if (
          !("accountId" in payload) ||
          typeof payload.accountId !== "string" ||
          !("isOpenComments" in payload) ||
          typeof payload.isOpenComments !== "boolean"
        ) {
          return;
        }

        const ownerAccountId = payload.accountId;
        const isOpenComments = payload.isOpenComments;
        setLoadedPosts((currentPosts) =>
          currentPosts.map((activity) => {
            if ("post" in activity && activity.type === "POST") {
              return activity.post.accountId === ownerAccountId
                ? {
                    ...activity,
                    post: {
                      ...activity.post,
                      isOpenComments,
                    },
                  }
                : activity;
            }
            if ("share" in activity && activity.type === "SHARE") {
              return activity.share.post?.accountId === ownerAccountId
                ? {
                    ...activity,
                    share: {
                      ...activity.share,
                      post: {
                        ...activity.share.post,
                        isOpenComments,
                      },
                    },
                  }
                : activity;
            }
            return activity.accountId === ownerAccountId
              ? { ...activity, isOpenComments }
              : activity;
          }),
        );
        return;
      }

      if (payload.action === "disable-comments:post") {
        if (
          !("postId" in payload) ||
          typeof payload.postId !== "string" ||
          !("isOpenComments" in payload) ||
          typeof payload.isOpenComments !== "boolean"
        ) {
          return;
        }

        const { postId, isOpenComments } = payload;
        setLoadedPosts((currentPosts) =>
          currentPosts.map((activity) => {
            if ("post" in activity && activity.type === "POST") {
              return activity.post.id === postId
                ? {
                    ...activity,
                    post: { ...activity.post, isOpenComments },
                  }
                : activity;
            }
            if ("share" in activity && activity.type === "SHARE") {
              return activity.share.post?.id === postId
                ? {
                    ...activity,
                    share: {
                      ...activity.share,
                      post: {
                        ...activity.share.post,
                        isOpenComments,
                      },
                    },
                  }
                : activity;
            }
            return activity.id === postId
              ? { ...activity, isOpenComments }
              : activity;
          }),
        );
        return;
      }

      if (
        !realtime ||
        !("postId" in payload) ||
        typeof payload.postId !== "string" ||
        (payload.action !== "created" &&
          payload.action !== "updated" &&
          payload.action !== "deleted" &&
          payload.action !== "liked" &&
          payload.action !== "shared")
      ) {
        return;
      }

      const postId = payload.postId;

      if (payload.action === "created") {
        void getPosts(1)
          .then((result) => {
            const newPost = result.posts.find(
              (activity) => activity.type === "POST" && activity.id === postId,
            ) as FeedActivity | undefined;

            if (!newPost || newPost.type !== "POST") return;

            setLoadedPosts((currentPosts) =>
              currentPosts.some((activity) => activity.id === newPost.id)
                ? currentPosts
                : [newPost, ...currentPosts],
            );
          })
          .catch((error: unknown) => {
            console.error("Failed to load newly created post:", error);
          });
        return;
      }

      if (payload.action === "deleted") {
        setLoadedPosts((currentPosts) =>
          currentPosts.filter((activity) => {
            if ("post" in activity && activity.type === "POST") {
              return activity.post.id !== postId;
            }
            if ("share" in activity && activity.type === "SHARE") {
              return activity.share.post?.id !== postId;
            }
            return activity.id !== postId;
          }),
        );
        return;
      }

      if (payload.action === "shared") {
        if (
          !("shareId" in payload) ||
          typeof payload.shareId !== "string" ||
          !("shared" in payload) ||
          typeof payload.shared !== "boolean" ||
          !("sharedCount" in payload) ||
          typeof payload.sharedCount !== "number" ||
          !("accountId" in payload) ||
          typeof payload.accountId !== "string"
        ) {
          return;
        }

        const shareId = payload.shareId;
        const shared = payload.shared;
        const sharedCount = payload.sharedCount;
        const actorAccountId = payload.accountId;

        setLoadedPosts((currentPosts) =>
          currentPosts.map((activity) => {
            const post =
              "post" in activity && activity.type === "POST"
                ? activity.post
                : "share" in activity && activity.type === "SHARE"
                  ? activity.share.post
                  : (activity as Post);

            if (!post || post.id !== postId) return activity;

            const updatedPost = {
              ...post,
              sharedCount,
              isShared: actorAccountId === account.id ? shared : post.isShared,
            };

            if ("post" in activity && activity.type === "POST") {
              return { ...activity, post: updatedPost };
            }
            if ("share" in activity && activity.type === "SHARE") {
              return {
                ...activity,
                share: { ...activity.share, post: updatedPost },
              };
            }
            return updatedPost;
          }),
        );

        if (!shared) {
          setLoadedPosts((currentPosts) =>
            currentPosts.filter(
              (activity) =>
                !("share" in activity && activity.share.id === shareId) &&
                activity.id !== shareId,
            ),
          );
          return;
        }

        void getPosts(1)
          .then((result) => {
            const newShare = result.posts.find(
              (activity) =>
                activity.type === "SHARE" && activity.share.id === shareId,
            ) as FeedActivity | undefined;

            if (!newShare || newShare.type !== "SHARE") return;

            setLoadedPosts((currentPosts) =>
              currentPosts.some((activity) => activity.id === shareId)
                ? currentPosts
                : [newShare, ...currentPosts],
            );
          })
          .catch((error: unknown) => {
            console.error("Failed to load newly shared post:", error);
          });
        return;
      }

      if (payload.action === "updated") {
        void getPostForFeed(postId)
          .then((updatedActivity) => {
            setLoadedPosts((currentPosts) => {
              if (!updatedActivity) {
                return currentPosts.filter((activity) => {
                  if ("post" in activity && activity.type === "POST") {
                    return activity.post.id !== postId;
                  }
                  if ("share" in activity && activity.type === "SHARE") {
                    return activity.share.post?.id !== postId;
                  }
                  return activity.id !== postId;
                });
              }

              return currentPosts.map((activity) => {
                if ("post" in activity && activity.type === "POST") {
                  return activity.post.id === postId
                    ? { ...activity, post: updatedActivity.post }
                    : activity;
                }
                if ("share" in activity && activity.type === "SHARE") {
                  return activity.share.post?.id === postId
                    ? {
                        ...activity,
                        share: {
                          ...activity.share,
                          post: updatedActivity.post,
                        },
                      }
                    : activity;
                }
                return activity.id === postId ? updatedActivity.post : activity;
              });
            });
          })
          .catch((error: unknown) => {
            console.error("Failed to load updated post:", error);
          });
        return;
      }

      if (
        !("accountId" in payload) ||
        typeof payload.accountId !== "string" ||
        !("liked" in payload) ||
        typeof payload.liked !== "boolean" ||
        !("likesCount" in payload) ||
        typeof payload.likesCount !== "number"
      ) {
        return;
      }

      const actorAccountId = payload.accountId;
      const liked = payload.liked;
      const likesCount = payload.likesCount;

      setLoadedPosts((currentPosts) =>
        currentPosts.map((activity) => {
          const post =
            "post" in activity && activity.type === "POST"
              ? activity.post
              : "share" in activity && activity.type === "SHARE"
                ? activity.share.post
                : (activity as Post);

          if (!post) return activity;

          if (post.id !== postId) return activity;

          const updatedPost = {
            ...post,
            isLiked: actorAccountId === account.id ? liked : post.isLiked,
            _count: {
              ...post._count,
              likes: likesCount,
            },
          };

          if ("post" in activity && activity.type === "POST") {
            return { ...activity, post: updatedPost };
          }
          if ("share" in activity && activity.type === "SHARE") {
            return {
              ...activity,
              share: { ...activity.share, post: updatedPost },
            };
          }
          return updatedPost;
        }),
      );
    };

    socket.on("publish:post", handlePostCreated);
    socket.connect();

    return () => {
      socket.off("publish:post", handlePostCreated);
    };
  }, [realtime, account.id]);

  // ------------------------------------------------
  // Load more posts
  // ------------------------------------------------

  const loadMore = useCallback(async () => {
    // Already loading
    if (loading) return;

    // No more posts
    if (!hasNextPage) return;

    setLoading(true);

    try {
      const nextPage = page + 1;

      const result = profileMode
        ? await getProfilePosts(profileId, nextPage)
        : await getPosts(nextPage);

      setLoadedPosts((currentPosts) => {
        const existingIds = new Set(
          currentPosts.map((activity) => activity.id),
        );
        const newActivities = (
          result.posts as unknown as FeedActivity[]
        ).filter((activity) => !existingIds.has(activity.id));

        return [...currentPosts, ...newActivities];
      });

      setPage(result.currentPage);

      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, page, profileMode, profileId]);

  // ------------------------------------------------
  // Empty state
  // ------------------------------------------------

  if (!loadedPosts || loadedPosts.length === 0) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <EmptyPage
          title="No posts yet"
          desc="When people you follow share something, it will show up here."
          icon={<MailboxIcon className="h-6 w-6" />}
        />
      </div>
    );
  }

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

  return (
    <div className="h-full w-full">
      <Virtuoso
        className="hide-scrollbar"
        style={{ height: "100%" }}
        data={loadedPosts}
        initialItemCount={1}
        endReached={loadMore}
        increaseViewportBy={0}
        itemContent={(_, item) => {
          if (!item) return null;

          const content = (() => {
            if ("post" in item && item.type === "POST") {
              return <PostView post={item.post} account={account} />;
            }
            if ("share" in item && item.type === "SHARE") {
              return <ShareCard share={item.share} account={account} />;
            }
            return <PostView post={item as Post} account={account} />;
          })();

          return (
            <div key={item.id} className=" py-2  sm:py-3 ">
              {content}
            </div>
          );
        }}
        components={{
          Footer: () => (
            <div className="px-3 pb-6 sm:px-4 lg:px-6">
              <Footer loading={loading} hasNextPage={hasNextPage} />
            </div>
          ),
        }}
      />
    </div>
  );
};

export default PostsVirtuoso;
