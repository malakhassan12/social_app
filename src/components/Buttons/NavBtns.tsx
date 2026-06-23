import { ModeToggle } from "./ModeToggleBtn";
import { BookmarkIcon } from "lucide-react";
import NotificationsBtn from "./NotificationsBtn";
import ProfileBtn from "./ProfileBtn";
import { Toggle } from "../ui/toggle";

const NavBtns = () => {
  return (
    <>
      {/* Mode Toggle (Dark/Light) */}
      <ModeToggle />

      {/* Bookmark Toggle Button */}
      <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
        <BookmarkIcon className="h-4 w-4 group-data-[state=on]/toggle:fill-foreground" />
        <span className="sr-only">Bookmark</span>
      </Toggle>

      {/* Notifications Button */}
      <NotificationsBtn />

      {/* Profile Popover (Settings, Logout, etc.) */}
      <ProfileBtn />
    </>
  );
};

export default NavBtns;
