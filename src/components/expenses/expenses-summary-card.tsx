import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text";

type ExpensesSummaryCardProps = {
  totalAmount: number;
  userPaidAmount: number;
  partnerPaidAmount: number;
  userBalance: number;
};

export function ExpensesSummaryCard({
  totalAmount,
  userPaidAmount,
  partnerPaidAmount,
  userBalance,
}: ExpensesSummaryCardProps) {
  const balanceLabel =
    userBalance >= 0
      ? `You are owed $${userBalance.toFixed(2)}`
      : `You owe $${Math.abs(userBalance).toFixed(2)}`;

  return (
    <View style={styles.card}>
      <ThemedText type="subtitle">Split summary (50/50)</ThemedText>
      <ThemedText testID="expenses-total-label">
        Total: ${totalAmount.toFixed(2)}
      </ThemedText>
      <ThemedText>You paid: ${userPaidAmount.toFixed(2)}</ThemedText>
      <ThemedText>Partner paid: ${partnerPaidAmount.toFixed(2)}</ThemedText>
      <ThemedText>{balanceLabel}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
});
