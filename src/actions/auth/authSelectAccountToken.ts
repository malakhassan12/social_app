"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createTempSession } from "@/lib/temp-session-for-select-account/session";

const authSelectAccountToken = async (userId: string, emailId: string) => {
  const cookieStore = await cookies();

  const selectionToken = await createTempSession(userId, emailId);

  if (!selectionToken) {
    throw new Error("Failed to create account selection token.");
  }

  cookieStore.set("account-selection", selectionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  redirect("/select-account");
};

export default authSelectAccountToken;
