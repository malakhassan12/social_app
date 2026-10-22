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
  UserRoundPlus,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import { sidebarData } from "@/constants/SideBar.constants";
import { CurtainLink } from "../Curtain/CurtainLink";
import { CurtainOptions } from "@/hooks/useCurtainTransition";

const iconMap = {
  Home: Home,
  Compass: Compass,
  Bell: Bell,
  Mail: Mail,
  Users: Users,
  Video: Video,
  User: User,
  Settings: Settings,
  UserRoundPlus: UserRoundPlus,
} as const;

const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName as keyof typeof iconMap];

  return Icon ? <Icon className="h-5 w-5" /> : null;
};


const getTransitionOptions = (path: string): CurtainOptions => {
  switch (path) {
    case "/home":
      return {
        coverEffect: "iris",
        revealEffect: "wipe",
        // rose-500 → rose-600: warm arrival
        color: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
      };

    case "/explore":
      return {
        coverEffect: "doors",
        revealEffect: "clipWipe",
        // orange-400 → orange-500: warm discovery
        color: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
      };

    case "/notifications":
      return {
        coverEffect: "wipe",
        revealEffect: "iris",
        // amber-300 → amber-500: warm attention
        color: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
      };

    case "/messages":
      return {
        coverEffect: "iris",
        revealEffect: "clipWipe",
        // emerald-300 → emerald-500: private & connected
        color: "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
      };

    case "/profile":
      return {
        coverEffect: "doors",
        revealEffect: "iris",
        // rose-400 → orange-300: identity, subtle gradient
        color: "linear-gradient(135deg, #fb7185 0%, #fdba74 100%)",
      };

    case "/sign-up":
    case "/login":
      return {
        coverEffect: "doors",
        revealEffect: "iris",
        // Full brand gradient: rose → orange → amber
        color: "linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #fcd34d 100%)",
      };

    default:
      return {
        coverEffect: "iris",
        revealEffect: "wipe",
        // No explicit color — useCurtainTransition falls back to the
        // theme-aware default (rose→orange→amber light, pastel dark).
      };
  }
};

const Menusidebar = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {sidebarData.map((item) => {
        const isActive = pathname.includes(item.path);
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className="h-10 px-3 mb-1.5"
            >
              <CurtainLink
                href={item.path}
                transitionOptions={getTransitionOptions(item.path)}
                className="flex items-center gap-3"
              >
                {getIcon(item.icon)}
                <span className="text-sm font-medium">{item.title}</span>
              </CurtainLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default Menusidebar;
