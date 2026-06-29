"use server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { FormState } from "@/types/form.Types";
import { validateLogin } from "@/utils/authValidation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function authLogin(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: FormState["errors"] = {};

  validateLogin(email, password, errors);

  if (errors.message) {
    return {
      errors,
      success: false,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      errors: {
        message: "User not found",
      },
      success: false,
    };
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return {
      errors: {
        message: "Password is wrong",
      },
    };
  }

  // create session id
  const sessionId = await createSession(user?.id);

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
