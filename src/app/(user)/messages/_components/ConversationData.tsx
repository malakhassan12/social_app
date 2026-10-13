import ImageCircle from "@/components/ImageCircle/ImageCircle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC } from "react";

const ConversationData: FC<{
  pending: boolean;
  groupName: string;
  setGroupName: (value: string) => void;
}> = ({ pending, setGroupName, groupName }) => {
  return (
    <div className="shrink-0 px-4 sm:px-5 md:px-6 pt-3 pb-2">
      <div className="flex items-center gap-3 sm:gap-4">
        <ImageCircle pending={pending} />
        <div className="flex-1 min-w-0">
          <Label
            htmlFor="group-name"
            className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block"
          >
            Group Name
          </Label>
          <Input
            id="group-name"
            name="name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            maxLength={50}
            required
            disabled={pending}
            className="h-9 sm:h-10 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationData;
