import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import type { Expense } from "@/src/types/expense";

type ExpensesListProps = {
  expenses: Expense[];
  isLoading: boolean;
};

export function ExpensesList({ expenses, isLoading }: ExpensesListProps) {
  if (isLoading) {
    return <ThemedText>Loading expenses...</ThemedText>;
  }

  if (!expenses.length) {
    return <ThemedText>No expenses yet for this household.</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Recent expenses</ThemedText>
      {expenses.map((expense) => (
        <View key={expense.id} style={styles.item}>
          <ThemedText testID={`expense-item-${expense.id}`}>
            {expense.title} - ${expense.amount.toFixed(2)}
          </ThemedText>
          {expense.notes ? <ThemedText>{expense.notes}</ThemedText> : null}
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
  item: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
});
