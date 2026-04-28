import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";

type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type AuthFormProps = {
  variant: "login" | "register";
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  infoMessage?: string | null;
  errorMessage: string | null;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  footer: ReactNode;
};

export function AuthForm({
  variant,
  title,
  submitLabel,
  isSubmitting,
  infoMessage,
  errorMessage,
  onSubmit,
  footer,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    await onSubmit({
      email: email.trim(),
      password,
      confirmPassword: variant === "register" ? confirmPassword : undefined,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{title}</ThemedText>
      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Email input"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="Email"
          testID="auth-email-input"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          accessibilityLabel="Password input"
          autoCapitalize="none"
          autoComplete="password"
          placeholder="Password"
          secureTextEntry
          testID="auth-password-input"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {variant === "register" ? (
          <TextInput
            accessibilityLabel="Confirm password input"
            autoCapitalize="none"
            autoComplete="password"
            placeholder="Confirm password"
            secureTextEntry
            testID="auth-confirm-password-input"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        ) : null}
        {infoMessage ? <ThemedText style={styles.info}>{infoMessage}</ThemedText> : null}
        {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleSubmit}
          testID="auth-submit-button"
          style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.buttonText}>{submitLabel}</ThemedText>
          )}
        </Pressable>
      </View>
      {footer}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    gap: 20,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#0A84FF",
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  error: {
    color: "#D70015",
  },
  info: {
    color: "#0A84FF",
  },
});
