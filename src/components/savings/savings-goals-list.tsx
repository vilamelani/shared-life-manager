import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { SavingsGoal } from "@/src/types/savings";

type SavingsGoalsListProps = {
  goals: SavingsGoal[];
  isLoading: boolean;
};

export function SavingsGoalsList({ goals, isLoading }: SavingsGoalsListProps) {
  if (isLoading) {
    return <ThemedText>Loading savings goals...</ThemedText>;
  }

  if (!goals.length) {
    return <ThemedText>No savings goals yet for this household.</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Household savings goals</ThemedText>
      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <ThemedText testID={`savings-goal-${goal.id}`}>{goal.title}</ThemedText>
          <ThemedText>
            Target: ${goal.targetAmount.toFixed(2)} | Saved: ${goal.totalContributed.toFixed(2)}
          </ThemedText>
          <ThemedText>Remaining: ${goal.remainingAmount.toFixed(2)}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
  },
  goalCard: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
});
