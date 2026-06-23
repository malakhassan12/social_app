import { FC } from "react";
import Logo from "../Logo/Logo";
import NavSearch from "../Search/NavSearch";
import NavBtns from "../Buttons/NavBtns";

type PROPS = {
  children: React.ReactNode; // Sidebar trigger
};

const Nav: FC<PROPS> = ({ children }) => {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
      {/* Left Section: Sidebar Trigger + Logo */}
      <div className="flex items-center gap-3">
        {children} {/* Sidebar trigger (Menu icon) */}
        <Logo />
      </div>

      {/* Center Section: Search Bar */}
      <NavSearch />

      {/* Right Section: Action Buttons */}
      <div className="hidden md:flex items-center gap-1 sm:gap-2 ">
        <NavBtns />
      </div>
    </header>
  );
};

export default Nav;
