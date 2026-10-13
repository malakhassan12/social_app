"use server";

import prisma from "@/lib/prisma";
import { AccountType } from "@/generated/prisma/enums";

const changeAccountType = async (accountId: string, formData: FormData) => {
  try {
    if (!accountId) {
      return {
        success: false,
        message: "Account ID is required",
      };
    }
    // Get type from form
    const rawType = formData.get("type");

    const type = typeof rawType === "string" ? rawType : undefined;

    // Validate type
    if (type !== AccountType.PRIVATE && type !== AccountType.PUBLIC) {
      return {
        success: false,
        message: "Invalid account type",
      };
    }

    // Update account

    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        type: type as AccountType,
      },
      
    });

    return {
      success: true,
      message: "Account type updated successfully",
    };
  } catch (error) {
    console.error("changeAccountType error:", error);

    return {
      success: false,
      message: "Failed to update account type",
    };
  }
};

export default changeAccountType;
