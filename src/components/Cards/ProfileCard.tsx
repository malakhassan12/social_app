import { Card,  } from "@/components/ui/card";
import ProfileAvatar from "../Avatar/ProfileAvatar";
import { MapPin, Mail, Users, FileText } from "lucide-react";
import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";

const ProfileCard = async () => {
  const userId = (await getUserId()) as string;

  const [user, followers, followings, posts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        image: true,
        name: true,
        email: true,
        country: true,
        bio: true,
      },
    }),
    prisma.follower.count({ where: { followingId: userId } }),
    prisma.follower.count({ where: { followerId: userId } }),
    prisma.post.count({ where: { authorId: userId } }),
  ]);

  return (
    <Card className="w-full max-w-xs mx-auto shadow-md border border-gray-200 dark:border-gray-800 p-4">
      {/* Profile Info */}
      <div className="flex items-center gap-3">
        <ProfileAvatar
          name={user?.name}
          image={user?.image}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {user?.name || "User"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-0.5">
            <Mail className="h-3 w-3 shrink-0" />
            {user?.email}
          </p>
          {user?.country && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {user.country}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user?.bio && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
          {user.bio}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{posts}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <FileText className="h-2.5 w-2.5" />
            Posts
          </p>
        </div>
        <div className="text-center border-l border-r border-gray-100 dark:border-gray-800">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{followers}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            Followers
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{followings}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            Following
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;