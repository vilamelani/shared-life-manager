import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { AuthForm } from "@/src/components/auth/auth-form";
import { ThemedText } from "@/src/components/themed-text";
import { authService } from "@/src/services/auth/auth-service";
import type { SignUpParams } from "@/src/types/auth";

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to create your account right now. Please try again.";
};

export function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async ({ email, password }: SignUpParams) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authService.signUpWithPassword({ email, password });
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Create account"
      submitLabel="Create account"
      isSubmitting={isSubmitting}
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
