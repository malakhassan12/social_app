interface User {
  email: string;
  id: string;
  name: string;
  image?: string | null;
  country?: string;
  bio?: string;
}

import { FollowStatus } from "@/generated/prisma/enums";

export interface Follower {
  id: string;

  followerId: string;
  followingId: string;

  follower: User;
  following: User;

  status: FollowStatus;

  createdAt: Date;
}
export type { User };
