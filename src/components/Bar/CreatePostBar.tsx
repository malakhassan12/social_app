"use client";

import Form from "next/form";

import CreatePostBtn from "../Buttons/CreatePostBtn";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Image as ImageIcon,
  Smile,
  Video,
  Send,
  Loader2,
  Sparkles,
  Globe,
  Users,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

import { createPost } from "@/actions/posts/createPost";
import { toast } from "sonner";
import { useTransition, useState, useEffect, useRef, FC } from "react";
import isAccountPrivate from "@/helper/account/isAccountPrivate";
import { CreatePostActionState } from "@/lib/schema/Create-post.schema";
import ProfileAvatar from "../Avatar/ProfileAvatar";

const CreatePostBar: FC<{
  userName: string;
  image: string;
}> = ({ userName, image }) => {
  const [pending, startTransition] = useTransition();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkAccountPrivacy = async () => {
      const result = await isAccountPrivate();

      if (typeof result === "boolean") {
        setIsPrivateAccount(result);
      }
    };

    checkAccountPrivacy();
  }, []);

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const res = (await createPost({}, formData)) as CreatePostActionState;

      if (!res?.success) {
        const errors = res.errors;

        if (errors) {
          Object.values(errors)
            .flat()
            .forEach((error) => {
              toast.error(error);
            });
        }

        return;
      } else {
        formRef.current?.reset();
        setIsPrivate(false);
        setCharCount(0);

        if (textareaRef.current) {
          textareaRef.current.value = "";
        }

        toast.success("Post created successfully!");
      }
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const maxChars = 280;
  const isNearLimit = charCount > maxChars * 0.8;
  const isOverLimit = charCount > maxChars;

  return (
    <Card className="min-h-88 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl shadow-black/[0.06] transition-all duration-300 hover:shadow-black/[0.10] sm:min-h-76 dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40 dark:hover:shadow-black/60">
      <CardContent className="p-0">
        <Form action={submit} ref={formRef}>
          {/* Header */}
          <div className="border-b border-black/[0.06] px-4 pb-3 pt-4 sm:px-6 sm:pt-5 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <ProfileAvatar name={userName} image={image} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1a1e2b] dark:text-[#f4ede4]">
                  Create Post
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
                  <Globe aria-hidden="true" className="h-3 w-3" />
                  <span>Public</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="More post tools"
                className="h-8 w-8 rounded-full p-0 text-[#1a1e2b]/45 hover:bg-rose-400/10 hover:text-rose-600 dark:text-[#f4ede4]/45 dark:hover:bg-rose-300/10 dark:hover:text-rose-300"
              >
                <Sparkles aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4 pb-2 pt-4 sm:px-6">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?..."
              className={`h-20 max-h-20 flex-1 resize-none overflow-y-auto rounded-xl border-black/[0.08] bg-[#fdf9f3] text-sm text-[#1a1e2b] placeholder:text-[#1a1e2b]/35 transition-all focus:border-transparent focus:ring-2 focus:ring-rose-400/50 sm:h-15 sm:max-h-15 sm:text-base dark:border-white/[0.08] dark:bg-[#171421] dark:text-[#f4ede4] dark:placeholder:text-[#f4ede4]/35 dark:focus:ring-rose-300/50 scrollbar-thin scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-black/30 dark:hover:scrollbar-thumb-white/30${isOverLimit ? " border-red-500 focus:ring-red-400 dark:border-red-500" : ""}${!isOverLimit && charCount > 0 ? " border-rose-400/60 dark:border-rose-300/50" : ""}`}
              name="desc"
              onChange={handleTextChange}
            />
          </div>

          {/* Character count */}
          <div className="px-4 pb-2 sm:px-6">
            <div className="flex justify-end">
              <span
                className={`text-xs font-medium tabular-nums ${
                  isOverLimit
                    ? "text-red-500 dark:text-red-400"
                    : isNearLimit
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-[#1a1e2b]/55 dark:text-[#f4ede4]/55"
                }`}
              >
                {charCount} / {maxChars}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-4 pb-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-[#fdf9f3] px-2 py-2 sm:gap-2 dark:bg-[#171421]">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-2 text-[#1a1e2b]/55 hover:bg-rose-400/10 hover:text-rose-600 sm:px-3 dark:text-[#f4ede4]/55 dark:hover:bg-rose-300/10 dark:hover:text-rose-300"
                aria-label="Add a photo"
                type="button"
              >
                <ImageIcon className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden text-xs font-medium sm:inline">
                  Photo
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-2 text-[#1a1e2b]/55 hover:bg-amber-400/10 hover:text-amber-600 sm:px-3 dark:text-[#f4ede4]/55 dark:hover:bg-amber-300/10 dark:hover:text-amber-300"
                aria-label="Add a video"
                type="button"
              >
                <Video aria-hidden="true" className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden text-xs font-medium sm:inline">
                  Video
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-2 text-[#1a1e2b]/55 hover:bg-orange-400/10 hover:text-orange-600 sm:px-3 dark:text-[#f4ede4]/55 dark:hover:bg-orange-300/10 dark:hover:text-orange-300"
                aria-label="Add a feeling"
                type="button"
              >
                <Smile aria-hidden="true" className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden text-xs font-medium sm:inline">
                  Feeling
                </span>
              </Button>

              <div className="flex-1" />

              <Button
                type="submit"
                disabled={pending || isOverLimit || charCount === 0}
                className={`group inline-flex items-center rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-7 sm:py-2 sm:text-base ${
                  pending || isOverLimit || charCount === 0
                    ? "cursor-not-allowed border border-black/[0.06] bg-black/[0.04] text-[#1a1e2b]/40 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-[#f4ede4]/40"
                    : "bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 text-[#1a1e2b] shadow-[0_8px_24px_-8px_rgba(251,113,133,0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(251,146,60,0.7)] active:translate-y-0 dark:text-[#0b0a12] dark:shadow-[0_8px_24px_-8px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_12px_32px_-10px_rgba(251,146,60,0.85)]"
                }`}
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-1 h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:mr-2 sm:h-4 sm:w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-black/[0.06] px-4 pb-4 pt-3 sm:px-6 sm:pb-5 dark:border-white/[0.08]">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <CreatePostBtn />

              {!isPrivateAccount && (
                <div className="flex items-center gap-3 rounded-full border border-black/[0.06] bg-[#fdf9f3] px-3 py-1.5 dark:border-white/[0.08] dark:bg-[#171421]">
                  <Users
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#1a1e2b]/55 dark:text-[#f4ede4]/55"
                  />
                  <Label
                    htmlFor="private-switch"
                    className="cursor-pointer text-sm text-[#1a1e2b]/65 dark:text-[#f4ede4]/65"
                  >
                    Private
                  </Label>

                  <Switch
                    id="private-switch"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    className="data-[state=checked]:bg-rose-400 dark:data-[state=checked]:bg-rose-300"
                  />

                  <input
                    type="hidden"
                    name="isPrivate"
                    value={isPrivate ? "true" : "false"}
                  />
                </div>
              )}
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePostBar;