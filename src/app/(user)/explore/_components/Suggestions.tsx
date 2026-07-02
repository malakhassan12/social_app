import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import AddFriendBtn from "./AddFriendBtn";
import { getFollow } from "@/helper/getFollow";

const Suggestions = async ({
  rightPanel = false,
}: {
  rightPanel?: boolean;
}) => {
  const userId = (await getUserId()) as string;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      country: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      country: user?.country,
      NOT: {
        id: userId,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      country: true,
    },
  });

  // If no users from same country, show random users
  const suggestions =
    users.length > 0
      ? users
      : await prisma.user.findMany({
          where: {
            NOT: {
              id: userId,
            },
          },
          take: 6,
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            country: true,
          },
        });

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-500" />
          Suggested for You
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
            {suggestions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No suggestions available
            </p>
          </div>
        ) : (
          <div
            className={
              rightPanel
                ? "grid grid-cols-1 gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            }
          >
            {suggestions.map(async (suggestion) => {
              const followStatus = await getFollow(suggestion?.id);
              return (
                <div
                  key={suggestion.id}
                  className="flex flex-col items-center p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-purple-200 dark:hover:border-purple-900/50"
                >
                  <ProfileAvatar
                    image={suggestion.image}
                    name={suggestion.name}
                  />

                  <p className="font-medium text-sm mt-2 text-gray-900 dark:text-white">
                    {suggestion.name}
                  </p>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {suggestion.email}
                  </span>

                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {suggestion.country || "Unknown"}
                    </span>
                  </div>

                  <AddFriendBtn
                    followingId={suggestion.id}
                    followStatus={followStatus as "PENDING" | "ACCEPTED" | null}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Suggestions;
