import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MapPin } from "lucide-react";
import ProfileAvatar from "@/components/Avatar/ProfileAvatar";
import AcceptFollowBtn from "./AcceptFollowBtn";
import RejectFollowBtn from "./RejectFollowBtn";
import getFollowRequest from "@/helper/friend/getFollowRequest";
import RequestsRealTime from "./RequestsRealTime";

const Requests = async ({ rightPanel = false }: { rightPanel?: boolean }) => {
  const requests = await getFollowRequest();

  const followers = requests || [];
  const requestCount = followers.length;

  return (
    <>
      <RequestsRealTime />
      <Card className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl shadow-black/[0.06] transition-shadow duration-300 dark:border-white/[0.06] dark:bg-[#0f0d18] dark:shadow-black/40">
        <CardHeader className="border-b border-black/[0.06] px-4 pb-3 pt-4 sm:px-6 sm:pt-5 dark:border-white/[0.08]">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold text-[#1a1e2b] sm:text-lg dark:text-[#f4ede4]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-400/10 text-rose-600 dark:bg-rose-300/10 dark:text-rose-300">
                <UserPlus className="h-4 w-4" />
              </span>
              <span className="truncate">Friend Requests</span>
              {requestCount > 0 && (
                <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:text-xs dark:bg-rose-400 dark:text-[#0b0a12]">
                  {requestCount}
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className={rightPanel ? "p-3 sm:p-4" : "p-4 sm:p-6"}>
          {requestCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
              <span className="mb-3 grid size-14 place-items-center rounded-full bg-rose-400/10 ring-1 ring-inset ring-rose-400/20 dark:bg-rose-300/10 dark:ring-rose-300/20">
                <UserPlus className="h-6 w-6 text-rose-500 dark:text-rose-300" />
              </span>
              <p className="text-sm font-semibold text-[#1a1e2b] dark:text-[#f4ede4]">
                No friend requests
              </p>
              <p className="mt-1 max-w-xs text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
                When someone sends you a request, it will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {followers.map((follow) => (
                <div
                  key={follow.id}
                  className="group flex flex-wrap items-center justify-between gap-2 rounded-xl border border-transparent p-2.5 transition-colors hover:border-black/[0.06] hover:bg-[#fdf9f3] dark:hover:border-white/[0.08] dark:hover:bg-[#171421] sm:gap-3 sm:p-3"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ProfileAvatar
                      image={follow.requester.image}
                      name={follow.requester.name}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1a1e2b] dark:text-[#f4ede4]">
                        {follow.requester.name || "Unknown"}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
                          {follow.requester.email.email}
                        </span>
                        {follow.requester.country && (
                          <>
                            <span className="text-[#1a1e2b]/30 dark:text-[#f4ede4]/30">
                              •
                            </span>
                            <div className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3 shrink-0 text-[#1a1e2b]/45 dark:text-[#f4ede4]/45" />
                              <span className="truncate text-xs text-[#1a1e2b]/55 dark:text-[#f4ede4]/55">
                                {follow.requester.country}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <AcceptFollowBtn followerId={follow.requester?.id} />
                    <RejectFollowBtn followerId={follow.requester?.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Requests;