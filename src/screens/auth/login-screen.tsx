import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { AuthForm } from "@/src/components/auth/auth-form";
import { ThemedText } from "@/src/components/themed-text";
import { authService } from "@/src/services/auth/auth-service";
import { normalizeAuthErrorMessage } from "@/src/utils/auth-error-message";
import { validateSignInInput } from "@/src/utils/auth-validation";

type LoginFormParams = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async ({ email, password }: LoginFormParams) => {
    const validation = validateSignInInput({ email, password });
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authService.signInWithPassword({ email, password });
    } catch (error) {
      setErrorMessage(
        normalizeAuthErrorMessage(
          error,
          "Unable to sign in right now. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      variant="login"
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
