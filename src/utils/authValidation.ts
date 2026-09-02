import { AccountType } from "@/generated/prisma/enums";
import { FormState } from "@/types/form.Types";

const validateLogin = (
  email: string,
  password: string,
  errors: FormState["errors"] = {},
) => {
  if (!email && !password) {
    errors.message = "Email and Password are required";
  } else if (!email) {
    errors.message = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.message = "Invalid email format";
  } else if (!password) {
    errors.message = "Password is required";
  } else if (password.length < 8) {
    errors.message = "Password must be at least 8 characters";
  }
};

const validateSignup = (
  name: string,
  username: string,
  accountType: AccountType,
  email: string,
  password: string,
  confirmPassword: string,
  country: string,
  phone: string,
  errors: FormState["errors"] = {},
) => {
  // Name
  if (!name.trim()) {
    errors.message = "Name is required";
  }

  // Username
  else if (!username.trim()) {
    errors.message = "Username is required";
  } else if (username.length < 3) {
    errors.message = "Username must be at least 3 characters";
  } else if (username.length > 30) {
    errors.message = "Username must not exceed 30 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.message =
      "Username can only contain letters, numbers, and underscores";
  }

  // Account type
  else if (!accountType) {
    errors.message = "Account type is required";
  }

  // Email
  else if (!email.trim()) {
    errors.message = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.message = "Invalid email format";
  }

  // Password
  else if (!password) {
    errors.message = "Password is required";
  } else if (password.length < 8) {
    errors.message = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.message = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.message = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.message = "Password must contain at least one number";
  }

  // Confirm password
  else if (!confirmPassword) {
    errors.message = "Confirm password is required";
  } else if (password !== confirmPassword) {
    errors.message = "Passwords do not match";
  }

  // Country
  else if (!country.trim()) {
    errors.message = "Country is required";
  }

  // Phone
  else if (!phone.trim()) {
    errors.message = "Phone is required";
  } else if (!/^[0-9+\-\s()]+$/.test(phone)) {
    errors.message = "Invalid phone number";
  } else if (phone.replace(/\D/g, "").length < 7) {
    errors.message = "Phone number is too short";
  }

  return errors;
};

export { validateLogin, validateSignup };
