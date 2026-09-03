import "server-only";

import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function getAccountId() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("token")?.value;

  if (!sessionId) {
    return null;
  }

  const { accountId } = await getSession(sessionId);

  return accountId;
}
