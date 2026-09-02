"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  count: number;
  children: ReactNode; // AccountCard list already rendered on the server
}

const FollowModal = ({ isOpen, onClose, title, count, children }: FollowModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              ({count})
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
          {count === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No {title.toLowerCase()} yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">{children}</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;