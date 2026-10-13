"use server";

import prisma from "@/lib/prisma";

import { getAccountId } from "@/helper/account/getAccountId";

import { uploadToCloudinary } from "@/lib/upload/uploadToCloudinary";

const updateAccount = async (accountId: string, formData: FormData) => {
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
    // Current authenticated account
    // =====================================================

    const currentAccountId = await getAccountId();

    if (!currentAccountId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Prevent editing another account
    if (currentAccountId !== accountId) {
      return {
        success: false,
        message: "You can only edit your own account",
      };
    }

    // =====================================================
    // Get FormData
    // =====================================================

    const rawUsername = formData.get("username");

    const rawName = formData.get("name");

    const rawBio = formData.get("bio");

    const rawCountry = formData.get("country");

    const rawImage = formData.get("image");

    const rawRemoveImage = formData.get("removeImage");

    const removeImage = rawRemoveImage === "true";

    console.log("rawImage", rawImage);

    // =====================================================
    // Convert values
    // =====================================================

    const username =
      typeof rawUsername === "string" ? rawUsername.trim() : undefined;

    const name = typeof rawName === "string" ? rawName.trim() : undefined;

    const bio = typeof rawBio === "string" ? rawBio.trim() : undefined;

    const country =
      typeof rawCountry === "string" ? rawCountry.trim() : undefined;

    const image =
      rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

    // =====================================================
    // Basic validation
    // =====================================================

    if (!username) {
      return {
        success: false,
        message: "Username is required",
      };
    }

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!country) {
      return {
        success: false,
        message: "Country is required",
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
        image: true,
      },
    });

    if (!account) {
      return {
        success: false,
        message: "Account not found",
      };
    }

    // =====================================================
    // Upload new image only if provided
    // =====================================================

    let imageUrl: string | undefined;

    if (image) {
      imageUrl = await uploadToCloudinary(image);
    }

    // =====================================================
    // Update Account
    // =====================================================

    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },

      data: {
        username,

        name,

        bio: bio || null,

        country,

        ...(removeImage
          ? {
              image: null,
            }
          : imageUrl !== undefined
            ? {
                image: imageUrl,
              }
            : {}),
      },

      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        country: true,
        type: true,
      },
    });

    // =====================================================
    // Result
    // =====================================================

    return {
      success: true,
      message: "Account updated successfully",
      account: updatedAccount,
    };
  } catch (error) {
    console.error("updateAccount error:", error);

    // =====================================================
    // Unique username
    // =====================================================

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Username is already taken",
      };
    }

    return {
      success: false,
      message: "Failed to update account",
    };
  }
};

export default updateAccount;
