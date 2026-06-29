import { X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CreatePostForm from "../create-post/_components/CreatePostForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default async function CreatePostModal() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-[600px] max-h-[95vh] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-5 pb-3  border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a2e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold leading-tight">Create Post</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">
                  🌍 Public
                </Badge>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  •
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Share with everyone
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Link>
        </div>

        {/* Scrollable Content x */}
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="p-5 pt-3">
            <CreatePostForm/>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
