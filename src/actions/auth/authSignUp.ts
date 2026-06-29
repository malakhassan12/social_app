"use server";

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

  const country = formData.get("country") as string;

  const phone = formData.get("phone") as string;

  const errors: FormState["errors"] = {};

  validateSignup(
    name,
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

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return {
      errors: {
        message: "User Already exist",
      },
      success: false,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        country,
        password: hashedPassword,
        phone,
      },
    });
  } catch {
    return {
      errors: {
        message: "Email already exists",
      },
      success: false,
    };
  }

  return {
    success: true,
  };
}
