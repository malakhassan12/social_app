"use server";

import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import getAccount from "@/helper/account/getAccount";
import { getUserId } from "@/helper/user/getUserId";

export type ChangePasswordResult = {
  success: boolean;
  message: string;
};

const changePassword = async (
  formData: FormData,
  accountId: string,
): Promise<ChangePasswordResult> => {
  // ============================================================
  // 1. Get form data
  // ============================================================

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  // ============================================================
  // 2. Validate form data types
  // ============================================================

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  // ============================================================
  // 3. Validate required fields
  // ============================================================

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "All password fields are required.",
    };
  }

  // ============================================================
  // 4. Validate new password
  // ============================================================

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters.",
    };
  }

  // ============================================================
  // 5. Confirm new password
  // ============================================================

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New passwords do not match.",
    };
  }

  // ============================================================
  // 6. Get authenticated user
  // ============================================================

  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      message: "You must be logged in to change your password.",
    };
  }

  // ============================================================
  // 7. Get account
  // ============================================================

  const account = await getAccount(accountId);

  if (!account) {
    return {
      success: false,
      message: "Account not found.",
    };
  }

  // ============================================================
  // 8. Make sure this account belongs to the logged-in user
  // ============================================================

  const accountOwner = await prisma.account.findFirst({
    where: {
      id: accountId,
      email: {
        userId,
      },
    },
    select: {
      id: true,
      emailId: true,
    },
  });

  if (!accountOwner) {
    return {
      success: false,
      message: "You are not authorized to change this account password.",
    };
  }

  // ============================================================
  // 9. Get the email/password record
  // ============================================================

  const userEmail = await prisma.userEmail.findUnique({
    where: {
      id: accountOwner.emailId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!userEmail) {
    return {
      success: false,
      message: "Email account not found.",
    };
  }

  // ============================================================
  // 10. Verify current password
  // ============================================================

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    userEmail.password,
  );

  if (!isCurrentPasswordValid) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  // ============================================================
  // 11. Prevent using the same password
  // ============================================================

  const isSamePassword = await bcrypt.compare(
    newPassword,
    userEmail.password,
  );

  if (isSamePassword) {
    return {
      success: false,
      message: "New password must be different from your current password.",
    };
  }

  // ============================================================
  // 12. Hash new password
  // ============================================================

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  // ============================================================
  // 13. Update password
  // ============================================================

  await prisma.userEmail.update({
    where: {
      id: userEmail.id,
    },
    data: {
      password: newPasswordHash,
    },
  });

  // ============================================================
  // 14. Return success
  // ============================================================

  return {
    success: true,
    message: "Password updated successfully.",
  };
};

export default changePassword;