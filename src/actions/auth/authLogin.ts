"use server";

import prisma from "@/lib/prisma";
import { FormState } from "@/types/form.Types";
import { validateLogin } from "@/utils/authValidation";
import bcrypt from "bcryptjs";

export async function authLogin(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  // const accountId = formData.get('accountId') as string;
  const password = formData.get("password") as string;

  const errors: FormState["errors"] = {};

  validateLogin(email, password, errors);

  if (errors.message) {
    return {
      errors,
      success: false,
    };
  }

  const emailExist = await prisma.userEmail.findUnique({
    where: {
      email,
    },
  });

  if (!emailExist) {
    return {
      errors: {
        message: "Email not found in the system",
      },
      success: false,
    };
  }

  const match = await bcrypt.compare(password, emailExist.password);

  if (!match) {
    return {
      errors: {
        message: "Password is wrong",
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      emails: {
        some: {
          id: emailExist.id,
        },
      },
    },
  });

  return {
    success: true,
    data: { emailId: emailExist.id, userId: user?.id },
  };
}
