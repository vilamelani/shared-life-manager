import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { AuthForm } from "@/src/components/auth/auth-form";
import { ThemedText } from "@/src/components/themed-text";
import { authService } from "@/src/services/auth/auth-service";
import type { SignUpParams } from "@/src/types/auth";
import { normalizeAuthErrorMessage } from "@/src/utils/auth-error-message";
import { validateSignUpInput } from "@/src/utils/auth-validation";

type RegisterFormParams = SignUpParams & {
  confirmPassword?: string;
};

export function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: RegisterFormParams) => {
    const validation = validateSignUpInput({
      email,
      password,
      confirmPassword: confirmPassword ?? "",
    });
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const result = await authService.signUpWithPassword({ email, password });

      if (!result.session) {
        setInfoMessage(
          "Check your inbox to confirm your email before signing in.",
        );
      }
    } catch (error) {
      setErrorMessage(
        normalizeAuthErrorMessage(
          error,
          "Unable to create your account right now. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      variant="register"
      title="Create account"
      submitLabel="Create account"
      isSubmitting={isSubmitting}
      infoMessage={infoMessage}
      errorMessage={errorMessage}
      onSubmit={handleRegister}
      footer={
        <Link href="/login" style={styles.footerLink}>
          <ThemedText type="link">I already have an account</ThemedText>
        </Link>
      }
    />
  );
}

const styles = StyleSheet.create({
  footerLink: {
    marginTop: 8,
  },
});
