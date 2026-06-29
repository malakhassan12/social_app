"use server";

import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function authLogout() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  cookieStore.delete("session");

  redirect("/login");
}
