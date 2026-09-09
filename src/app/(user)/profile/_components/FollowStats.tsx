// "use client";

// import { FC, ReactNode, useState } from "react";
// import { Users, UserPlus } from "lucide-react";
// import FollowModal from "./FollowModal";

// type FollowStatsProps = {
//   followersCount: number;
//   followingsCount: number;
//   friendsCount: number;
//   followersContent: ReactNode;
//   followingsContent: ReactNode;
//   friendsContent: ReactNode;
// };

// const FollowStats: FC<FollowStatsProps> = ({
//   followersCount,
//   followingsCount,
//   friendsCount,
//   followersContent,
//   followingsContent,
//   friendsContent,
// }) => {
//   const [isFollowersOpen, setIsFollowersOpen] = useState(false);
//   const [isFollowingsOpen, setIsFollowingsOpen] = useState(false);
//   const [isFriendsOpen, setIsFriendsOpen] = useState(false);

//   return (
//     <>
//       <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
//         <button
//           type="button"
//           onClick={() => setIsFollowersOpen(true)}
//           className="text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
//         >
//           <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
//             {followersCount}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
//             <Users className="h-3.5 w-3.5" />
//             Followers
//           </p>
//         </button>

//         <button
//           type="button"
//           onClick={() => setIsFollowingsOpen(true)}
//           className="text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
//         >
//           <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
//             {followingsCount}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
//             <Users className="h-3.5 w-3.5" />
//             Following
//           </p>
//         </button>

//         <button
//           type="button"
//           onClick={() => setIsFriendsOpen(true)}
//           className="text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
//         >
//           <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
//             {friendsCount}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
//             <UserPlus className="h-3.5 w-3.5" />
//             Friends
//           </p>
//         </button>
//       </div>

//       <FollowModal
//         isOpen={isFollowersOpen}
//         onClose={() => setIsFollowersOpen(false)}
//         title="Followers"
//         count={followersCount}
//       >
//         {followersContent}
//       </FollowModal>

//       <FollowModal
//         isOpen={isFollowingsOpen}
//         onClose={() => setIsFollowingsOpen(false)}
//         title="Following"
//         count={followingsCount}
//       >
//         {followingsContent}
//       </FollowModal>

//       <FollowModal
//         isOpen={isFriendsOpen}
//         onClose={() => setIsFriendsOpen(false)}
//         title="Friends"
//         count={friendsCount}
//       >
//         {friendsContent}
//       </FollowModal>
//     </>
//   );
// };

// export default FollowStats;