"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, User as Us } from "lucide-react";
import { authLogout } from "@/actions/auth/authLogout";
import Link from "next/link";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { User } from "@/types/profile.Types";

const ProfileBtn = ({ user }: { user: User }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ProfileAvatar name={user?.name} image={user?.image} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
        <Separator className="my-1" />
        <Link
          href="/profile"
          className="w-full flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg px-3 py-2.5 transition-all duration-200 group"
        >
          <Us className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Profile</span>
        </Link>
        <Separator className="my-1" />
        <form action={authLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>{" "}
      </PopoverContent>
    </Popover>
  );
};

export default ProfileBtn;
