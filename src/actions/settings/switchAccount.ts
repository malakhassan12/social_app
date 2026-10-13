"use server";

import prisma from "@/lib/prisma";

import { getSession, updateSessionAccount } from "@/lib/temp-session-for-select-account/session";

import { cookies } from "next/headers";

const switchAccount = async (accountId: string) => {
  try {
    // =====================================================
    // Validation
    // =====================================================

    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }

    // =====================================================
    // Get current token
    // =====================================================

    const cookieStore = await cookies();

    const sessionId = cookieStore.get("token")?.value;

    if (!sessionId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Get current session
    // =====================================================

    const session = await getSession(sessionId);

    const userId = session.userId;

    // =====================================================
    // Make sure selected account belongs to current user
    // =====================================================

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
        message: "Account does not belong to you",
      };
    }

    // =====================================================
    // Update current session
    // =====================================================
    await updateSessionAccount(sessionId, account.id);

    return {
      success: true,
      message: "Account switched successfully",
    };
  } catch (error) {
    console.error("switchAccount error:", error);

    return {
      success: false,
      message: "Failed to switch account",
    };
  }
};

export default switchAccount;
