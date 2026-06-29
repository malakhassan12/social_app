"use client";
// components/Sidebar/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Compass,
  Bell,
  Mail,
  Users,
  Video,
  User,
  Settings,
} from "lucide-react";
import NavBtns from "../Buttons/NavBtns";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sidebarData } from "@/constants/SideBar.constants";
import ProfileCard from "../Cards/ProfileCard";
import { Separator } from "./separator";

// Icon mapping object
const iconMap = {
  Home: Home,
  Compass: Compass,
  Bell: Bell,
  Mail: Mail,
  Users: Users,
  Video: Video,
  User: User,
  Settings: Settings,
} as const;

// Helper to get Lucide icon component by name
const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName as keyof typeof iconMap];
  return Icon ? <Icon className="h-5 w-5" /> : null;
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between flex-col gap-1.5">
          <ProfileCard />
        </div>

        <Separator/>

        {/* Mobile Navigation Buttons (ModeToggle, Profile, Notifications, Bookmark) */}
        <div className="flex  flex-wrap md:hidden items-center justify-center gap-1 sm:gap-2 mt-2">
          <NavBtns />
        </div>
      </SidebarHeader>

      {/* Sidebar Content - Navigation Links */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-10 px-3 mb-1.5"
                    >
                      <Link
                        href={item.path}
                        className="flex items-center gap-3"
                      >
                        {getIcon(item.icon)}
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
