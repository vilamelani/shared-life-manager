import {
  validateSignInInput,
  validateSignUpInput,
} from "@/src/utils/auth-validation";

describe("auth validation", () => {
  it("rejects invalid sign-in email", () => {
    const result = validateSignInInput({
      email: "invalid-email",
      password: "password123",
    });

    expect(result).toEqual({
      isValid: false,
      errorMessage: "Please enter a valid email address.",
    });
  });

  it("rejects short sign-in password", () => {
    const result = validateSignInInput({
      email: "valid@example.com",
      password: "12345",
    });

    expect(result).toEqual({
      isValid: false,
      errorMessage: "Password must be at least 8 characters long.",
    });
  });

  it("rejects sign-up when passwords do not match", () => {
    const result = validateSignUpInput({
      email: "valid@example.com",
      password: "password123",
      confirmPassword: "different123",
    });

    expect(result).toEqual({
      isValid: false,
      errorMessage: "Passwords do not match.",
    });
  });

  it("accepts valid sign-up credentials", () => {
    const result = validateSignUpInput({
      email: "valid@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result).toEqual({
      isValid: true,
      errorMessage: null,
    });
  });
});
