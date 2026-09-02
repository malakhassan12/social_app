"use server"

import { createSession } from "@/lib/session";
import { FormState } from "@/types/form.Types";
import { cookies } from "next/headers";

export async function authSelectAccount(
  accountId: string,
  userId: string,
): Promise<FormState> {
  // create session id
  const sessionId = await createSession(userId, accountId);

  // save session in cookie

  const cookieStore = await cookies();

  cookieStore.set("token", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return {
    success: true,
  };
}
