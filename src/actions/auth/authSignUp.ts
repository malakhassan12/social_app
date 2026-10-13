"use server";

import { AccountType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { FormState } from "@/types/form.Types";
import { validateSignup } from "@/utils/authValidation";
import bcrypt from "bcryptjs";

export default async function signupAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = formData.get("username") as string;
  const accountType = formData.get("AccountType") as AccountType;
  const country = formData.get("country") as string;
  const phone = formData.get("phone") as string;

  // ==============================
  // Validation
  // ==============================

  const errors: FormState["errors"] = {};

  validateSignup(
    name,
    username,
    accountType,
    email,
    password,
    confirmPassword,
    country,
    phone,
    errors,
  );

  if (errors.message) {
    return {
      success: false,
      errors,
    };
  }

  // ==============================
  // Check Email
  // ==============================

  const emailExist = await prisma.userEmail.findUnique({
    where: {
      email,
    },
  });

  if (emailExist) {
    return {
      success: false,
      errors: {
        message: "This email already exists in the system",
      },
    };
  }

  // ==============================
  // Check Username
  // ==============================

  const usernameExist = await prisma.account.findUnique({
    where: {
      username,
    },
  });

  if (usernameExist) {
    return {
      success: false,
      errors: {
        message: "This username is already taken",
      },
    };
  }

  // ==============================
  // Hash Password
  // ==============================

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // ==============================
    // Create User
    // Create Email
    // Create Account
    // ==============================

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone,
        },
      });

      const userEmail = await tx.userEmail.create({
        data: {
          email,
          password: hashedPassword,
          userId: user.id,
        },
      });

      await tx.account.create({
        data: {
          emailId: userEmail.id,
          type: accountType,
          username,
          name,
          country,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Signup error:", error);

    return {
      success: false,
      errors: {
        message: "Something went wrong while creating your account",
      },
    };
  }
}
