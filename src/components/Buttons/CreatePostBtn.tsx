import Link from "next/link";
import { Plus } from "lucide-react";

const CreatePostBtn = () => {
  return (
    <Link
      href="/create-post"
      aria-label="Create a new post"
      className=" inline-flex items-center justify-center gap-2 rounded-full bg-[#4ADE80] px-4 py-1.5 text-sm font-semibold text-green-950 shadow-sm transition-colors duration-200 hover:bg-[#3FCF71] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 active:bg-[#34C566] sm:px-6 sm:py-2 sm:text-base
      "
    >
      <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
      <span>Create Post</span>
    </Link>
  );
};

export default CreatePostBtn;