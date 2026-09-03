"use client";

import Form from 'next/form'

import CreatePostBtn from "../Buttons/CreatePostBtn";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Image,
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
import isAccountPrivate from "@/helper/isAccountPrivate";
import { CreatePostActionState } from "@/lib/schema/Create-post.schema";
import ProfileAvatar from '../Avatar/ProfileAvatar';

const CreatePostBar : FC<{
  userName : string , 
  image : string
}> = ({userName , image}) => {
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
        // Reset form
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
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <Form action={submit} ref={formRef}>
          {/* Header */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
             <ProfileAvatar name={userName} image={image}/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Create Post
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Sparkles className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4 sm:px-6 pt-4 pb-2">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?..."
              className={`flex-1 h-20 max-h-20 sm:h-15 sm:max-h-15 rounded-xl 
            border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-900/50 
            focus:ring-2 focus:ring-green-400 focus:border-transparent 
            transition-all resize-none overflow-y-auto 
            text-sm sm:text-base 
            scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 
            scrollbar-track-transparent hover:scrollbar-thumb-gray-500 
            dark:hover:scrollbar-thumb-gray-500
            ${isOverLimit ? "border-red-500 dark:border-red-500 focus:ring-red-400" : ""}
            ${!isOverLimit && charCount > 0 ? "border-green-500 dark:border-green-500" : ""}`}
              autoFocus
              name="desc"
              onChange={handleTextChange}
            />
          </div>

          {/* Character count */}
          <div className="px-4 sm:px-6 pb-2">
            <div className="flex justify-end">
              <span
                className={`text-xs font-medium ${
                  isOverLimit
                    ? "text-red-500"
                    : isNearLimit
                      ? "text-yellow-500"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {charCount} / {maxChars}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 sm:px-6 pb-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 py-2 px-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 sm:px-3"
                aria-label="Add a photo"
                type="button"
              >
                <Image className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                
                <span className="text-xs font-medium hidden sm:inline">
                  Photo
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 sm:px-3"
                type="button"
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
                type="button"
              >
                <Smile className="h-4 w-4 sm:mr-1.5" />
                <span className="text-xs font-medium hidden sm:inline">
                  Feeling
                </span>
              </Button>

              <div className="flex-1" />

              <Button
                type="submit"
                disabled={pending || isOverLimit || charCount === 0}
                className={`inline-flex items-center rounded-full px-5 sm:px-7 py-1.5 sm:py-2 text-white font-medium text-sm sm:text-base transition-all duration-200 ${
                  pending || isOverLimit || charCount === 0
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-md hover:shadow-lg"
                }`}
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

          {/* Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CreatePostBtn />

              {!isPrivateAccount && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <Label
                    htmlFor="private-switch"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    Private
                  </Label>

                  <Switch
                    id="private-switch"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    className="data-[state=checked]:bg-emerald-500"
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
