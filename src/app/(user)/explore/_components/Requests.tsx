import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MapPin } from "lucide-react";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import AcceptFollowBtn from "./AcceptFollowBtn";
import RejectFollowBtn from "./RejectFollowBtn";
import getFollowRequest from "@/helper/getFollowRequest";
import RequestsRealTime from "./RequestsRealTime";

const Requests = async ({ rightPanel = false }: { rightPanel?: boolean }) => {
  const requests = await getFollowRequest();

  const followers = requests || [];
  const requestCount = followers.length;

  return (
    <>
      <RequestsRealTime />
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
                className={
                  " flex-wrap flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                }
              >
                <div className="flex items-center gap-3">
                  <ProfileAvatar
                    image={follow.requester.image}
                    name={follow.requester.name}
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {follow.requester.name || "Unknown"}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {follow.requester.email.email}
                      </span>
                      {follow.requester.country && (
                        <>
                          <span className="text-xs text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {follow.requester.country}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <AcceptFollowBtn followerId={follow.requester?.id} />
                  <RejectFollowBtn followerId={follow.requester?.id} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Requests;
