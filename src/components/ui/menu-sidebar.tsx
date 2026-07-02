"use client";
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

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import { sidebarData } from "@/constants/SideBar.constants";
import Link from "next/link";

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

const Menusidebar = () => {
  const pathname = usePathname();

  return (
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
              <Link href={item.path} className="flex items-center gap-3">
                {getIcon(item.icon)}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default Menusidebar;
