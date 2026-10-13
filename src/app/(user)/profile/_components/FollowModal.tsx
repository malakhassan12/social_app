import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";
import { Users } from "lucide-react";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  count: number;
  pagination?: ReactNode;
  children: ReactNode; // AccountCard list already rendered on the server
}

const FollowModal = ({
  isOpen,
  onClose,
  title,
  count,
  children,
  pagination,
}: FollowModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 p-0 overflow-hidden max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {title}
              <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
                ({count})
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No {title.toLowerCase()} yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                They&lsquo;ll appear here when you have {title.toLowerCase()}.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">{children}</div>
          )}
        </ScrollArea>

        {/* Pagination Footer */}
        {pagination && (
          <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            {pagination}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
