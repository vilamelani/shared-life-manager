import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { AuthForm } from "@/src/components/auth/auth-form";
import { ThemedText } from "@/src/components/themed-text";
import { authService } from "@/src/services/auth/auth-service";
import type { SignInParams } from "@/src/types/auth";

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign in right now. Please try again.";
};

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async ({ email, password }: SignInParams) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authService.signInWithPassword({ email, password });
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Sign in"
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSubmit={handleSignIn}
      footer={
        <Link href="/register" style={styles.footerLink}>
          <ThemedText type="link">Create a new account</ThemedText>
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
