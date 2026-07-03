import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SidebarSkeleton = () => {
  return (
    <Sidebar className="animate-pulse">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between flex-col gap-1.5">
          {/* Profile Card Skeleton */}
          <div className="w-full">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full ring-4 ring-white dark:ring-[#1a1a2e] bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
              <div className="flex gap-4 mt-3">
                <div className="text-center space-y-1">
                  <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  <div className="h-2 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                </div>
                <div className="text-center space-y-1">
                  <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  <div className="h-2 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                </div>
                <div className="text-center space-y-1">
                  <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  <div className="h-2 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mobile Navigation Buttons */}
          <div className="flex flex-wrap md:hidden items-center justify-center gap-1 sm:gap-2 mt-2">
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-2 w-full">
            <div className="h-9 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content - Navigation Links */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="flex items-center gap-3 px-3 py-2">
                  <div className="h-5 w-5 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarSkeleton;