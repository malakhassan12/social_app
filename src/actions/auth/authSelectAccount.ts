"use server";

import prisma from "@/lib/prisma";

import { createSession } from "@/lib/temp-session-for-select-account/session";


import { FormState } from "@/types/form.Types";

import { cookies } from "next/headers";
import createDeviceSession from "../session-device/createDeviceSession";

export async function authSelectAccount(
  accountId: string,
  userId: string,
): Promise<FormState> {
  try {
    if (!accountId || !userId) {
      return {
        success: false,
        errors: {
          message: "Invalid account selection",
        },
      };
    }

    // ================================================
    // Make sure account belongs to this user
    // ================================================

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        email: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      return {
        success: false,
        errors: {
          message: "Invalid account selection",
        },
      };
    }

    // ================================================
    // Create device session in DB
    // ================================================

    const deviceSessionId = await createDeviceSession(userId, account.id);

    // ================================================
    // Create real authentication token
    // ================================================

    const token = await createSession(userId, account.id , deviceSessionId);

    // ================================================
    // Save real token in cookie
    // ================================================

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      data: {
        deviceSessionId,
      },
    };
  } catch (error) {
    console.error("authSelectAccount error:", error);

    return {
      success: false,
      errors: {
        message: "Failed to select account",
      },
    };
  }
}
