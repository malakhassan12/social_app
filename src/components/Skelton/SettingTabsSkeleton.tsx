import { ComponentType, FC } from "react";
import { Skeleton } from "../ui/skeleton";

const SettingTabsSkeleton: FC<{
  TABS: { value: string; label: string; icon: ComponentType }[];
}> = ({ TABS }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 animate-pulse">
      <div className="w-full gap-6 flex flex-col">
        {/* Tab list skeleton */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="w-max sm:w-full sm:justify-center gap-1 flex
                       bg-slate-100 dark:bg-slate-800 
                       p-1 rounded-xl"
          >
            {TABS.map(({ value }) => (
              <Skeleton
                key={value}
                className="h-9 w-24 sm:flex-1 rounded-lg 
                           bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        </div>

        {/* Content card skeleton */}
        <div
          className="rounded-xl border border-slate-200 dark:border-slate-800 
                     bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
        >
          <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-full max-w-md bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-3/4 max-w-sm bg-slate-200 dark:bg-slate-700" />

          <div className="pt-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-10 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingTabsSkeleton;
