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
  email: string,
  password: string,
  confirmPassword: string,
  country: string,
  phone: string,
  errors: FormState["errors"] = {},
) => {
  if (!name) {
    errors.message = "Name is required";
  } else if (!email) {
    errors.message = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.message = "Invalid email format";
  } else if (!password) {
    errors.message = "Password is required";
  } else if (password.length < 8) {
    errors.message = "Password must be at least 8 characters";
  } else if (!confirmPassword) {
    errors.message = "Confirm password is required";
  } else if (password !== confirmPassword) {
    errors.message = "Passwords do not match";
  } else if (!country) {
    errors.message = "Country is required";
  } else if (!phone) {
    errors.message = "Phone is required";
  } else if (!/^[0-9+\-\s]+$/.test(phone)) {
    errors.message = "Invalid phone number";
  }
};

export { validateLogin, validateSignup };
