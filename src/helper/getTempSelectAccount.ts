"use server";

import { getTempSession } from "@/lib/session";
import { cookies } from "next/headers";

const getTempSelectAccount = async (): Promise<{
  emailId: string;
  userId: string;
} | null> => {
  const cookieStore = await cookies();

  const selectionToken = cookieStore.get("account-selection")?.value;
  if (!selectionToken) {
    return null;
  }

  const data = await getTempSession(selectionToken);

  return { emailId: data.emailId, userId: data.userId };
};

export default getTempSelectAccount;
