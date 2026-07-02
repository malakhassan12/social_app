"use client";

import { FC, useRef, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatar } from "@/actions/profile/uploadAvatar";
import { toast } from "sonner";

interface ProfileImageProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfileImage: FC<ProfileImageProps> = ({ name, image, size = "lg" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pending, startTransition] = useTransition();

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
    xl: "h-24 w-24",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    startTransition(async () => {
      const res = await uploadAvatar(formData);

      if (!res.success) {
        toast.error(res.error, {
          position: "top-center",
        });
        return;
      }

      toast.success("Profile picture updated successfully!", {
        position: "top-center",
      });
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <button
        className="relative inline-block group cursor-pointer"
        onClick={() => inputRef.current?.click()}
        type="button"
        aria-label="Upload profile image"
      >
        <Avatar
          className={`${sizeClasses[size]} ring-4 ring-white dark:ring-[#1a1a2e] shadow-lg transition-opacity duration-300 group-hover:opacity-80`}
        >
          <AvatarImage src={image ?? undefined} alt={name} />

          <AvatarFallback className="bg-linear-to-br from-green-400 to-blue-500 text-white text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {pending ? (
            <Loader2 className={`${iconSizes[size]} text-white animate-spin`} />
          ) : (
            <Camera className={`${iconSizes[size]} text-white`} />
          )}
        </div>
      </button>
    </>
  );
};

export default ProfileImage;
