"use server";

import prisma from "@/lib/prisma";

import { AccountStatus } from "@/generated/prisma/enums";

const changeAccountStatus = async (
  accountId: string,
  status: AccountStatus,
) => {
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
    // Validate status
    // =====================================================

    if (
      status !== AccountStatus.ACTIVE &&
      status !== AccountStatus.DEACTIVATED &&
      status !== AccountStatus.SUSPENDED
    ) {
      return {
        success: false,
        message: "Invalid account status",
      };
    }

    // =====================================================
    // Get current account
    // =====================================================

    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!account) {
      return {
        success: false,
        message: "Account not found",
      };
    }

    // =====================================================
    // Update account status
    // =====================================================

    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        status,
      },
    });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message:
        status === AccountStatus.ACTIVE
          ? "Account activated successfully"
          : "Account deactivated successfully",
    };
  } catch (error) {
    console.error("changeAccountStatus error:", error);

    return {
      success: false,
      message: "Failed to update account status",
    };
  }
};

export default changeAccountStatus;
