import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const getAvatarImageUrl = (image?: string | null) => {
  if (!image) return undefined;

  const uploadPath = "/image/upload/";
  const uploadIndex = image.indexOf(uploadPath);

  if (uploadIndex === -1) return image;

  const suffix = image.slice(uploadIndex + uploadPath.length);
  const firstPathSegment = suffix.split("/")[0];
  const alreadyTransformed =
    /^[a-z]_[^/]+(?:,[a-z]_[^/]+)*$/.test(firstPathSegment);

  if (alreadyTransformed) return image;

  return `${image.slice(0, uploadIndex + uploadPath.length)}w_80,h_80,c_fill,q_auto,f_auto/${suffix}`;
};

const ProfileAvatar: FC<{
  image?: string | null;
  name?: string;
}> = ({ image, name }) => {
  return (
    <Avatar className="h-10 w-10 shrink-0">
      <AvatarImage
        src={getAvatarImageUrl(image)}
        alt={name ?? ""}
        className="h-10 w-10 object-cover"
      />
      <AvatarFallback className="h-10 w-10">
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
