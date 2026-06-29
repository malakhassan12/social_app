import { LIKEPOST } from "./like.Types";

interface Post {
  id: string;
  desc: string;
  image?: string[];
  video?: string[];
  isPrivate: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: LIKEPOST[];
  author: {
    id: string;
    email: string;
    name: string;
    country: string;
    bio: string | null;
    image: string | null;
    website: string | null;
    phone: string;
  };
}

export type { Post };
