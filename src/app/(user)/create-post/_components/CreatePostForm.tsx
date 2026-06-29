"use client";

import { createPost } from "@/actions/posts/createPost";
import CreatePostTabs from "@/components/Tabs/CreatePostTabs/CreatePostTabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { FormState } from "@/types/form.Types";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect,  } from "react";
import { toast } from "sonner";

const initialState: FormState = {
  errors: {},
};

const CreatePostForm = () => {
  const router = useRouter();


  const [state, formAction, pending] = useActionState(createPost, initialState);

  useEffect(() => {
    if (!state) return;

    const message = state.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      return;
    }

    if (state.success) {
      toast.success("Post created successfully!", { position: "top-center" });
      router.push("/");
    }
  }, [state, router]);

  return (
    <form className="p-4 sm:p-6 space-y-4" action={formAction}>
      {/* Description Textarea */}
      <div className="space-y-1">
        <label
          htmlFor="desc"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          What&lsquo;s on your mind?
        </label>
        <Textarea
          id="desc"
          name="desc"
          placeholder="Share your thoughts with the world..."
          className="w-full min-h-[120px] resize-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-green-400 focus:border-transparent rounded-xl p-4 transition-all"
          maxLength={500}
        />
      </div>

      {/* Media Upload Tabs */}
      <div className="pt-2">
        <CreatePostTabs />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500"></span>

        <Button
          type="submit"
          className="rounded-xl px-6 py-2.5 bg-green-400 hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pending}
        >
          {pending ? (
            <>
              <Spinner data-icon="inline-start" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Share Post
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
