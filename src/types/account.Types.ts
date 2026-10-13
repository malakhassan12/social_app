import { AccountStatus, AccountType } from "@/generated/prisma/enums";

export type Account = {
  id: string;

  // Owner
  emailId: string;
  email: {
    email: string;
  };

  // Profile
  username: string;
  name: string;
  bio: string | null;
  image: string | null;
  website: string | null;
  country: string;

  // Privacy
  type: AccountType;

  status :AccountStatus

  isOpenGroup?: boolean;
  isOpenMessages?: boolean;
  isOpenComments? : boolean
};
