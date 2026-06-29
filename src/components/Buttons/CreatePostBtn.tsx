import Link from "next/link";
import { Plus } from "lucide-react";

const CreatePostBtn = () => {
  return (
    <Link
      href="/create-post"
      className="inline-flex items-center rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-green-400 hover:bg-green-500 text-white font-medium text-sm sm:text-base ="
    >
      <Plus className="h-4 w-4 mr-2" />
      Create Post
    </Link>
  );
};

export default CreatePostBtn;
