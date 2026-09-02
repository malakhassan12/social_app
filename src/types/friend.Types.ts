import { AccountType } from "@/generated/prisma/enums";

export type Friend = {
  id: string;
  name: string;
  email: {
    email: string;
  };
  image: string | null;
  username: string;
  bio?: string;
  website?: string;
  country?: string;
  type?: AccountType;
};
