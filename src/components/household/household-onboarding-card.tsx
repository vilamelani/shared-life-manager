import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { Household } from "@/src/types/household";

type HouseholdOnboardingCardProps = {
  mode: "create" | "join";
  householdName: string;
  inviteCode: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  household: Household | null;
  onModeChange: (mode: "create" | "join") => void;
  onHouseholdNameChange: (value: string) => void;
  onInviteCodeChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function HouseholdOnboardingCard({
  mode,
  householdName,
  inviteCode,
  isSubmitting,
  errorMessage,
  successMessage,
  household,
  onModeChange,
  onHouseholdNameChange,
  onInviteCodeChange,
  onSubmit,
}: HouseholdOnboardingCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        <Pressable
          accessibilityRole="button"
          style={[styles.modeButton, mode === "create" ? styles.modeButtonActive : null]}
          testID="create-mode-button"
          onPress={() => onModeChange("create")}
        >
          <ThemedText>Create household</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.modeButton, mode === "join" ? styles.modeButtonActive : null]}
          testID="join-mode-button"
          onPress={() => onModeChange("join")}
        >
          <ThemedText>Join household</ThemedText>
        </Pressable>
      </View>

      {mode === "create" ? (
        <TextInput
          placeholder="Household name"
          testID="household-name-input"
          value={householdName}
          onChangeText={onHouseholdNameChange}
          style={styles.input}
        />
      ) : (
        <TextInput
          autoCapitalize="characters"
          placeholder="Invite code"
          testID="invite-code-input"
          value={inviteCode}
          onChangeText={onInviteCodeChange}
          style={styles.input}
        />
      )}

      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      {successMessage ? <ThemedText style={styles.success}>{successMessage}</ThemedText> : null}
      {household ? (
        <ThemedText testID="household-summary">
          Household: {household.name} ({household.inviteCode})
        </ThemedText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
        testID="household-submit-button"
        disabled={isSubmitting}
        onPress={onSubmit}
      >
        <ThemedText style={styles.submitLabel}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create household"
              : "Join household"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 12,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modeButtonActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#EAF3FF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#0A84FF",
    paddingVertical: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  error: {
    color: "#D70015",
  },
  success: {
    color: "#248A3D",
  },
});
