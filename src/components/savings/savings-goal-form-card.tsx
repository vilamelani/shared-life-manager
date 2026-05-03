import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";

type SavingsGoalFormCardProps = {
  goalTitle: string;
  targetAmountInput: string;
  targetDate: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onGoalTitleChange: (value: string) => void;
  onTargetAmountChange: (value: string) => void;
  onTargetDateChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function SavingsGoalFormCard({
  goalTitle,
  targetAmountInput,
  targetDate,
  isSubmitting,
  errorMessage,
  onGoalTitleChange,
  onTargetAmountChange,
  onTargetDateChange,
  onSubmit,
}: SavingsGoalFormCardProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Create savings goal</ThemedText>
      <TextInput
        placeholder="Goal title"
        testID="savings-goal-title-input"
        value={goalTitle}
        onChangeText={onGoalTitleChange}
        style={styles.input}
      />
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Target amount"
        testID="savings-goal-target-input"
        value={targetAmountInput}
        onChangeText={onTargetAmountChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Target date (optional, YYYY-MM-DD)"
        testID="savings-goal-date-input"
        value={targetDate}
        onChangeText={onTargetDateChange}
        style={styles.input}
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        accessibilityRole="button"
        testID="savings-goal-submit-button"
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
      >
        <ThemedText style={styles.submitLabel}>
          {isSubmitting ? "Saving..." : "Create goal"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    gap: 10,
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
});
