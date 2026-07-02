import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import NavBtns from "../Buttons/NavBtns";
import ProfileCard from "../Cards/ProfileCard";
import { Separator } from "./separator";
import Menusidebar from "./menu-sidebar";

export function AppSidebar() {

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
            <Menusidebar/>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
