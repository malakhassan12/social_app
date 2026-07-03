"use server";

import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserId } from "@/helper/getUserId";

export async function authLogout() {
  const cookieStore = await cookies();

  const userid = await getUserId();

  const sessionId = cookieStore.get("token")?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  cookieStore.delete("token");

  console.log("noon");
  console.log(userid);
  redirect("/login");
}
