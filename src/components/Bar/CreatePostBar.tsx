"use client";

import CreatePostBtn from "../Buttons/CreatePostBtn";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Image,
  Smile,
  Video,
  Send,
  Loader2,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

import { createPost } from "@/actions/posts/createPost";
import { toast } from "sonner";
import { useTransition, useState, useEffect } from "react";
import isAccountPrivate from "@/helper/isAccountPrivate";

const CreatePostBar = () => {
  const [pending, startTransition] = useTransition();

  const [isPrivate, setIsPrivate] = useState(false);

  // هل الـ account نفسه Private؟
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);

  useEffect(() => {
    const checkAccountPrivacy = async () => {
      const result = await isAccountPrivate();

      // isAccountPrivate() ممكن ترجع boolean
      // أو object في حالة Unauthorized
      if (typeof result === "boolean") {
        setIsPrivateAccount(result);
      }
    };

    checkAccountPrivacy();
  }, []);

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const res = await createPost({}, formData);

      if (res.errors?.message) {
        toast.error(res.errors.message);
        return;
      }

      toast.success("Post created successfully!");
    });
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <form action={submit}>
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <Textarea
              placeholder="What's on your mind?..."
              className="flex-1 h-20 max-h-20 sm:h-15 m:max-h-15 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none overflow-y-auto text-sm sm:text-base scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500"
              autoFocus
              name="desc"
            />
          </div>

          <div className="mt-3 sm:mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 sm:px-3"
                aria-label="Add a photo"
              >
                <Image className="h-4 w-4 sm:mr-1.5" />
                <span className="text-xs font-medium hidden sm:inline">
                  Photo
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 sm:px-3"
              >
                <Video className="h-4 w-4 sm:mr-1.5" />
                <span className="text-xs font-medium hidden sm:inline">
                  Video
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-2 sm:px-3"
              >
                <Smile className="h-4 w-4 sm:mr-1.5" />
                <span className="text-xs font-medium hidden sm:inline">
                  Feeling
                </span>
              </Button>

              <div className="flex-1" />

              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                <span className="font-medium text-green-400">
                  0
                </span>{" "}
                /280
              </span>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-base transition-colors"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <CreatePostBtn />

            {!isPrivateAccount && (
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="private-switch"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Private
                </Label>

                <Switch
                  id="private-switch"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />

                <input
                  type="hidden"
                  name="isPrivate"
                  value={isPrivate ? "true" : "false"}
                />
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostBar;
