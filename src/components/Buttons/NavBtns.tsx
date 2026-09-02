import { ModeToggle } from "./ModeToggleBtn";
import NotificationsBtn from "./NotificationsBtn";
import ProfileBtn from "./ProfileBtn";
import getAccount from "@/helper/getAccount";
import { Account } from "@/types/account.Types";

const NavBtns = async () => {
  

  const account = await getAccount();

  return (
    <>
      {/* Mode Toggle (Dark/Light) */}
      <ModeToggle />

      {/* Notifications Button */}
      <NotificationsBtn />

      {/* Profile Popover (Settings, Logout, etc.) */}
      <ProfileBtn account={account as unknown as Account} />
    </>
  );
};

export default NavBtns;
