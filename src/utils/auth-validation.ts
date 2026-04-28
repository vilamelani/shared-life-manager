import type { SignInParams, SignUpParams } from "@/src/types/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult = {
  isValid: boolean;
  errorMessage: string | null;
};

type SignUpValidationParams = SignUpParams & {
  confirmPassword: string;
};

const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, errorMessage: "Email is required." };
  }

  if (!emailPattern.test(email)) {
    return { isValid: false, errorMessage: "Please enter a valid email address." };
  }

  return { isValid: true, errorMessage: null };
};

const validatePasswordStrength = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, errorMessage: "Password is required." };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      errorMessage: "Password must be at least 8 characters long.",
    };
  }

  return { isValid: true, errorMessage: null };
};

export const validateSignInInput = ({ email, password }: SignInParams): ValidationResult => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  return validatePasswordStrength(password);
};

export const validateSignUpInput = ({
  email,
  password,
  confirmPassword,
}: SignUpValidationParams): ValidationResult => {
  const signInValidation = validateSignInInput({ email, password });
  if (!signInValidation.isValid) {
    return signInValidation;
  }

  if (!confirmPassword) {
    return { isValid: false, errorMessage: "Please confirm your password." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, errorMessage: "Passwords do not match." };
  }

  return { isValid: true, errorMessage: null };
};
