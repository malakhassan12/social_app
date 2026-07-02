"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Send, Lock, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Post } from "@/types/post.Types";
import CreatePostTabs from "@/components/Tabs/CreatePostTabs/CreatePostTabs";
import { updatePost } from "@/actions/posts/updatePost";
import { FormState } from "@/types/form.Types";
import { ScrollArea } from "@/components/ui/scroll-area";

const UpdatePostBtn = ({ post }: { post: Post }) => {
  const [desc, setDesc] = useState(post?.desc);
  const [isPrivate, setIsPrivate] = useState(post?.isPrivate ?? false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const initialState: FormState = {
    errors: {},
  };

  const updatePostWithId = updatePost.bind(null, post?.id);

  const [state, action, pending] = useActionState(
    updatePostWithId,
    initialState,
  );

  useEffect(() => {
    if (!state) return;

    const message = state.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      return;
    }

    if (state.success) {
      toast.success("Post Updated successfully!", { position: "top-center" });
      const t = setTimeout(() => setIsUpdateOpen(false), 0);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg px-3 py-2 h-9 text-sm font-medium transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 shadow-xl p-0 ">
        <form action={action}>
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Post
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content */}
          <ScrollArea className="h-[400px] w-full rounded-md">
            <div className="p-4 space-y-4 ">
              {/* Post ID (hidden) */}
              <input type="hidden" name="postId" value={post?.id} />

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="desc"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="desc"
                  name="desc"
                  placeholder="What's on your mind?"
                  className="w-full min-h-25 resize-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl p-4 text-sm"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    {desc.length}/500
                  </span>
                </div>
              </div>

              <CreatePostTabs post={post} />

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {isPrivate ? (
                    <Lock className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Globe className="h-4 w-4 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isPrivate ? "Private" : "Public"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isPrivate
                        ? "Only you can see this"
                        : "Everyone can see this"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  className="data-[state=checked]:bg-blue-500"
                />
                <input
                  type="hidden"
                  name="isPrivate"
                  value={isPrivate ? "true" : "false"}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
              <Button
                type="submit"
                size="sm"
                className="rounded-xl px-6 py-2.5 bg-green-400 hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pending || !desc.trim()}
              >
                {pending ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {/* */}
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </ScrollArea>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePostBtn;
