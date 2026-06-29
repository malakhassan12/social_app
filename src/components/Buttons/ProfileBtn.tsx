"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings, User } from "lucide-react";
import { authLogout } from "@/actions/auth/authLogout";

const ProfileBtn = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">
              john@example.com
            </span>
          </div>
        </div>
        <Separator className="my-1" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm"
          size="sm"
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm"
          size="sm"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Separator className="my-1" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          size="sm"
          onClick={() => authLogout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileBtn;
