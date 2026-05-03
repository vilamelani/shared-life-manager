import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";

type ExpenseFormCardProps = {
  title: string;
  amountInput: string;
  notes: string;
  paidByUserId: string;
  payerOptions: { userId: string; label: string }[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onPaidByUserIdChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

export function ExpenseFormCard({
  title,
  amountInput,
  notes,
  paidByUserId,
  payerOptions,
  isSubmitting,
  errorMessage,
  onTitleChange,
  onAmountChange,
  onNotesChange,
  onPaidByUserIdChange,
  onSubmit,
}: ExpenseFormCardProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Add expense</ThemedText>
      <TextInput
        placeholder="Expense title"
        testID="expense-title-input"
        value={title}
        onChangeText={onTitleChange}
        style={styles.input}
      />
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Amount"
        testID="expense-amount-input"
        value={amountInput}
        onChangeText={onAmountChange}
        style={styles.input}
      />
      <TextInput
        placeholder="Notes (optional)"
        testID="expense-notes-input"
        value={notes}
        onChangeText={onNotesChange}
        style={styles.input}
      />
      <View style={styles.payerRow}>
        <ThemedText>Paid by:</ThemedText>
        <View style={styles.payerOptions}>
          {payerOptions.map((option) => (
            <Pressable
              key={option.userId}
              accessibilityRole="button"
              testID={`expense-payer-${option.userId}`}
              style={[
                styles.payerOption,
                option.userId === paidByUserId ? styles.payerOptionActive : null,
              ]}
              onPress={() => onPaidByUserIdChange(option.userId)}
            >
              <ThemedText>{option.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
      <Pressable
        accessibilityRole="button"
        testID="expense-submit-button"
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
      >
        <ThemedText style={styles.submitLabel}>
          {isSubmitting ? "Saving..." : "Add expense"}
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
  payerRow: {
    gap: 8,
  },
  payerOptions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  payerOption: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  payerOptionActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#EAF3FF",
  },
});
