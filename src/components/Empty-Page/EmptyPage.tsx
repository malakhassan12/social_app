import { FC } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const EmptyPage: FC<{
  title: string;
  desc: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, desc, icon, action }) => {
  return (
    <Empty className="border-0 bg-transparent">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-green-50 dark:bg-green-900/20 text-green-500">
          {icon}
        </EmptyMedia>
        <EmptyTitle className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          {desc}
        </EmptyDescription>
      </EmptyHeader>

      {action && (
        <EmptyContent className="flex-row justify-center gap-2">
          {action}
        </EmptyContent>
      )}
    </Empty>
  );
};

export default EmptyPage;