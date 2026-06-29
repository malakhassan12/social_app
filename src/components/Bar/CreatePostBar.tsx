import CreatePostBtn from "../Buttons/CreatePostBtn";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Image, Smile, Video, Send } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { createPost } from "@/actions/posts/createPost";
import { toast } from "sonner";

const CreatePostBar = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <form
          action={async (values) => {
            "use server";
            const res = await createPost({}, values);
            const message = res.errors?.message;

            /*I will solve it !!! */
            if (message) {
              toast.error(message, { position: "top-center" });
              return;
            }

            if (res.success) {
              toast.success("Post created successfully!", {
                position: "top-center",
              });
            }
          }}
        >
          {/* Avatar + Input Section */}
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <Textarea
              placeholder="What's on your mind?..."
              className="flex-1 h-20 max-h-[80px] sm:h-[60px] sm:max-h-[60px] rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none overflow-y-auto text-sm sm:text-base scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500"
              autoFocus
              name="desc"
            />
          </div>

          {/* Expanded Actions - Shows when textarea is focused */}
          <div className="mt-3 sm:mt-4 space-y-3">
            {/* Media Buttons */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 sm:px-3"
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

              {/* Character Counter */}
              <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                <span className="font-medium text-green-400"></span> /280
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  type="submit"
                  className="inline-flex items-center rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-green-400 hover:bg-green-500 text-white font-medium text-sm sm:text-base ="
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Bottom Section - Only show when not expanded */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <CreatePostBtn />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostBar;
