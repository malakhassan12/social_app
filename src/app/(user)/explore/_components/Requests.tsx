import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { getUserId } from "@/helper/getUserId";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import AcceptFollowBtn from "./AcceptFollowBtn";
import RejectFollowBtn from "./RejectFollowBtn";

const Requests = async ({
  rightPanel = false,
}: {
  rightPanel?: boolean;
}) => {
  const userId = (await getUserId()) as string;

  const requests = await prisma.follower.findMany({
    where: {
      followingId: userId,
      status: "PENDING",
    },
    include: {
      follower: true,
    },
  });

  const followers = requests || [];
  const requestCount = followers.length;

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-500" />
            Friend Requests
            {requestCount > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {requestCount}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {requestCount === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No friend requests
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              When someone sends you a request, it will appear here
            </p>
          </div>
        ) : (
          followers.map((follow) => (
            <div
              key={follow.id}
              className={" flex-wrap flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"}
            >
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  image={follow.follower.image}
                  name={follow.follower.name}
                />
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {follow.follower.name || "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {follow.follower.email}
                    </span>
                    {follow.follower.country && (
                      <>
                        <span className="text-xs text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {follow.follower.country}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <AcceptFollowBtn followerId={follow.follower?.id} />
                <RejectFollowBtn followerId={follow.follower?.id} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Requests;
