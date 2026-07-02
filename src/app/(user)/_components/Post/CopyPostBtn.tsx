import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const CopyPostBtn = ({ postId }: { postId: string }) => {
  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href+`post/${postId}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg px-3 py-2 h-9 text-sm font-medium transition-colors"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
      Copy Link
    </Button>
  );
};

export default CopyPostBtn;
