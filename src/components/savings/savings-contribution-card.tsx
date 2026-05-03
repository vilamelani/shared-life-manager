import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { SavingsGoal } from "@/src/types/savings";

type SavingsContributionCardProps = {
  goals: SavingsGoal[];
  selectedGoalId: string;
  contributionAmountInput: string;
  isSubmitting: boolean;
  onSelectGoal: (goalId: string) => void;
  onContributionAmountChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function SavingsContributionCard({
  goals,
  selectedGoalId,
  contributionAmountInput,
  isSubmitting,
  onSelectGoal,
  onContributionAmountChange,
  onSubmit,
}: SavingsContributionCardProps) {
  if (!goals.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Add contribution</ThemedText>
      <View style={styles.goalOptions}>
        {goals.map((goal) => (
          <Pressable
            key={goal.id}
            accessibilityRole="button"
            testID={`savings-goal-option-${goal.id}`}
            style={[
              styles.goalOption,
              goal.id === selectedGoalId ? styles.goalOptionActive : null,
            ]}
            onPress={() => onSelectGoal(goal.id)}
          >
            <ThemedText>{goal.title}</ThemedText>
          </Pressable>
        ))}
      </View>
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Contribution amount"
        testID="savings-contribution-input"
        value={contributionAmountInput}
        onChangeText={onContributionAmountChange}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        testID="savings-contribution-submit-button"
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
      >
        <ThemedText style={styles.submitLabel}>
          {isSubmitting ? "Saving..." : "Add contribution"}
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
  goalOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  goalOption: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  goalOptionActive: {
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
});
