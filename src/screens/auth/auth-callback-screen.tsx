import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { authService } from "@/src/services/auth/auth-service";
import { normalizeAuthErrorMessage } from "@/src/utils/auth-error-message";

export function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    token_hash?: string;
    type?: string;
    error?: string;
    error_description?: string;
  }>();
  const statusMessage = "Finishing account confirmation...";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const complete = async () => {
      if (params.error_description || params.error) {
        setErrorMessage(
          params.error_description ??
            params.error ??
            "Unable to confirm your account. Please try again.",
        );
        return;
      }

      try {
        await authService.completeEmailVerification({
          code: params.code,
          tokenHash: params.token_hash,
          type: params.type,
        });
        router.replace("/");
      } catch (error) {
        setErrorMessage(
          normalizeAuthErrorMessage(
            error,
            "Unable to confirm your account. Please try signing in again.",
          ),
        );
      }
    };

    void complete();
  }, [params.code, params.error, params.error_description, params.token_hash, params.type, router]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Email confirmation</ThemedText>
        {errorMessage ? (
          <>
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            <Link href="/login">
              <ThemedText type="link">Go to login</ThemedText>
            </Link>
          </>
        ) : (
          <ThemedText>{statusMessage}</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
  },
  errorText: {
    color: "#D70015",
  },
});
