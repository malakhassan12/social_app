import Link from "next/link";
import { Plus } from "lucide-react";

const CreatePostBtn = () => {
  return (
    <Link
      href="/create-post"
      aria-label="Create a new post"
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-400 via-orange-400 to-amber-300 px-4 py-1.5 text-sm font-semibold text-[#1a1e2b] shadow-[0_8px_24px_-8px_rgba(251,113,133,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(251,146,60,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf9f3] active:translate-y-0 dark:text-[#0b0a12] dark:shadow-[0_8px_24px_-8px_rgba(251,113,133,0.7)] dark:hover:shadow-[0_12px_32px_-10px_rgba(251,146,60,0.85)] dark:focus-visible:ring-offset-[#0b0a12] sm:px-6 sm:py-2 sm:text-base"
    >
      <Plus
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-90"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span>Create Post</span>
    </Link>
  );
};

export default CreatePostBtn;