import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export const getAccountId = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("token")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const { accountId } = await getSession(sessionId);
    return accountId;
  } catch {
    return null;
  }
});