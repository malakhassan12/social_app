interface User {
  email: string;
  id: string;
  phone?: string;
}


export interface Follower {
  id: string;

  followerId: string;
  followingId: string;

  follower: User;
  following: User;

  createdAt: Date;
}
export type { User };
