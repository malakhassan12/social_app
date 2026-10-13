"use server";

import { AccountType } from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { getUserId } from "@/helper/user/getUserId";

const createAccount = async (formData: FormData) => {
  try {
    // =====================================================
    // Current authenticated user
    // =====================================================

    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // =====================================================
    // Get FormData
    // =====================================================

    const rawEmailId = formData.get("emailId");

    const rawUsername = formData.get("username");

    const rawName = formData.get("name");

    const rawBio = formData.get("bio");

    const rawType = formData.get("type");

    const rawCountry = formData.get("country");

    // =====================================================
    // Convert values
    // =====================================================

    const emailId = typeof rawEmailId === "string" ? rawEmailId : undefined;

    const username =
      typeof rawUsername === "string" ? rawUsername.trim() : undefined;

    const name = typeof rawName === "string" ? rawName.trim() : undefined;

    const bio = typeof rawBio === "string" ? rawBio.trim() : undefined;

    const type = typeof rawType === "string" ? rawType : undefined;

    const country = typeof rawCountry === "string" ? rawCountry : undefined;

    // =====================================================
    // Basic validation
    // =====================================================

    if (!emailId) {
      return {
        success: false,
        message: "Email is required",
      };
    }

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

    if (type !== AccountType.PRIVATE && type !== AccountType.PUBLIC) {
      return {
        success: false,
        message: "Invalid account type",
      };
    }

    // =====================================================
    // Make sure selected email belongs to current user
    // =====================================================

    const userEmail = await prisma.userEmail.findFirst({
      where: {
        id: emailId,
        userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!userEmail) {
      return {
        success: false,
        message: "Invalid email selection",
      };
    }

    // =====================================================
    // Check username
    // =====================================================

    const usernameExist = await prisma.account.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (usernameExist) {
      return {
        success: false,
        message: "This username is already taken",
      };
    }

    // =====================================================
    // Create Account
    // =====================================================

    const account = await prisma.account.create({
      data: {
        emailId: userEmail.id,
        username,
        name,
        bio: bio || null,
        country,
        type: type as AccountType,
      },
      select: {
        id: true,
        emailId: true,
        username: true,
        name: true,
        bio: true,
        country: true,
        type: true,
        status: true,
        image: true,
      },
    });

    return {
      success: true,
      message: "Account created successfully",
      account,
    };
  } catch (error) {
    console.error("createAccount error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "This username is already taken",
      };
    }

    return {
      success: false,
      message: "Failed to create account",
    };
  }
};

export default createAccount;
