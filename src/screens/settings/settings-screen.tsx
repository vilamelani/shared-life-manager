import { Pressable, StyleSheet, View } from "react-native";

import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { ThemedText } from "@/src/components/themed-text";
import { authStore, useAuthStore } from "@/src/store/auth-store";

export function SettingsScreen() {
  const isSigningOut = useAuthStore((state) => state.isSigningOut);
  const errorMessage = useAuthStore((state) => state.signOutError);

  return (
    <ScreenTemplate title="Settings" description="Manage your account preferences.">
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={authStore.logout}
          style={styles.signOutButton}
        >
          <ThemedText style={styles.signOutLabel}>
            {isSigningOut ? "Signing out..." : "Sign out"}
          </ThemedText>
        </Pressable>
        {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 20,
    gap: 8,
  },
  signOutButton: {
    alignItems: "center",
    backgroundColor: "#D70015",
    borderRadius: 10,
    paddingVertical: 12,
  },
  signOutLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  errorText: {
    color: "#D70015",
  },
});
