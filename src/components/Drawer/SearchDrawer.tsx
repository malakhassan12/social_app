"use client";

import { useEffect, useState, FC } from "react";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Loader2, Search, X } from "lucide-react";

import { User } from "@/types/profile.Types";
import { Post } from "@/types/post.Types";
import UserCard from "../Cards/UserCard";
import PostCard from "../Cards/PostCard";

interface SearchResponse {
  users: User[];
  posts: Post[];
}

const SearchDrawer: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        setPosts([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `/api/search?search=${encodeURIComponent(searchQuery)}`,
          {
            signal: controller.signal,
          },
        );

        if (!res.ok)
          throw new Error(
            `Search request failed: ${res.status} ${res.statusText}`,
          );

        const data: SearchResponse = await res.json();

        setUsers(data.users);
        setPosts(data.posts);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-2xl p-4 flex flex-col h-full">
          {/* Header - Fixed */}
          <DrawerHeader className="px-0 pt-0 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  autoFocus
                  value={searchQuery}
                  placeholder="Search..."
                  className="pl-10 pr-10 rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="no-scrollbar overflow-y-auto px-4">
            <div className="mt-5 pb-2">
              {loading && (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
              )}

              {!loading &&
                searchQuery &&
                users.length === 0 &&
                posts.length === 0 && (
                  <div className="text-center py-10">
                    <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 mt-3">
                      No results found
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Try searching for something else
                    </p>
                  </div>
                )}

              {!loading && users.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Users
                    </h2>
                    <span className="text-xs text-gray-400">
                      {users.length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {users.map((user) => (
                      <UserCard key={user?.id} user={user} />
                    ))}
                  </div>
                </div>
              )}

              {!loading && posts.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Posts
                    </h2>
                    <span className="text-xs text-gray-400">
                      {posts.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <PostCard key={post?.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {!loading && !searchQuery && (
                <div className="text-center py-10">
                  <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 mt-3">
                    Search for users and posts
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Type something to start searching
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <DrawerFooter className="px-0 pt-4 shrink-0">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
