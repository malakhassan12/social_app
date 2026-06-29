import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileAvatar: FC<{
  image?: string | null;
  name?: string;
}> = ({ image, name }) => {
  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={image || undefined} alt={name} />
      <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
