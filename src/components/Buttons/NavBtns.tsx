import { getUserId } from "@/helper/getUserId";
import { ModeToggle } from "./ModeToggleBtn";
import NotificationsBtn from "./NotificationsBtn";
import ProfileBtn from "./ProfileBtn";
import prisma from "@/lib/prisma";
import { User } from "@/types/profile.Types";

const NavBtns = async () => {
  const userId = (await getUserId()) as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      image: true,
      name: true,
      email: true,
      country: true,
      bio: true,
    },
  });

  return (
    <>
      {/* Mode Toggle (Dark/Light) */}
      <ModeToggle />

      {/* Notifications Button */}
      <NotificationsBtn />

      {/* Profile Popover (Settings, Logout, etc.) */}
      <ProfileBtn user={user as unknown as User} />
    </>
  );
};

export default NavBtns;
