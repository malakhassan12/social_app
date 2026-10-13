import "server-only";

import { getSession } from "@/lib/temp-session-for-select-account/session";
import { cookies } from "next/headers";

export async function getUserId() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("token")?.value;

  if (!sessionId) {
    return null;
  }

  const { userId } = await getSession(sessionId);

  return userId;
}
