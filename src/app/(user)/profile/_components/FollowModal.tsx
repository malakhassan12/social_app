import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import { User } from "@/types/profile.Types";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  currentUserId: string;
}

const FollowModal = ({
  isOpen,
  onClose,
  title,
  users,
  currentUserId,
}: FollowModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              ({users.length})
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 overflow-y-auto p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-none]">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No {title.toLowerCase()} yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ProfileAvatar name={user.name} image={user.image} />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-37.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
