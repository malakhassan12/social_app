"use server";

import { cookies } from "next/headers";

import {
  deleteSession,
} from "@/lib/temp-session-for-select-account/session";

import { redirect } from "next/navigation";

export async function authLogout() {
  const cookieStore = await cookies();

  const sessionId =
    cookieStore.get("token")?.value;

  try {
    if (sessionId) {
      await deleteSession(sessionId);
    }
  } catch (error) {
    console.error(
      "authLogout delete session error:",
      error,
    );
  }

  // Always clear the browser cookie
  cookieStore.delete("token");

  redirect("/login");
}