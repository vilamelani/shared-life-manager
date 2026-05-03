import { ExpenseFormCard } from "@/src/components/expenses/expense-form-card";
import { ExpensesList } from "@/src/components/expenses/expenses-list";
import { ExpensesSummaryCard } from "@/src/components/expenses/expenses-summary-card";
import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { ThemedText } from "@/src/components/themed-text";
import { useExpenses } from "@/src/hooks/use-expenses";
import { useAuthStore } from "@/src/store/auth-store";

export function ExpensesScreen() {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const households = useAuthStore((state) => state.households);

  const {
    expenses,
    title,
    amountInput,
    notes,
    paidByUserId,
    payerOptions,
    isLoading,
    isSubmitting,
    errorMessage,
    totalAmount,
    userPaidAmount,
    partnerPaidAmount,
    userBalance,
    setTitle,
    setAmountInput,
    setNotes,
    setPaidByUserId,
    submitExpense,
  } = useExpenses();

  const activeHousehold = households.find(
    (household) => household.id === activeHouseholdId,
  );

  return (
    <ScreenTemplate
      title="Shared Expenses"
      description="Manage household expenses and split costs transparently."
    >
      {!activeHousehold ? (
        <ThemedText>Create or select a household in Home before adding expenses.</ThemedText>
      ) : (
        <ThemedText testID="expenses-active-household">
          Household: {activeHousehold.name}
        </ThemedText>
      )}
      <ExpenseFormCard
        title={title}
        amountInput={amountInput}
        notes={notes}
        paidByUserId={paidByUserId}
        payerOptions={payerOptions}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onTitleChange={setTitle}
        onAmountChange={setAmountInput}
        onNotesChange={setNotes}
        onPaidByUserIdChange={setPaidByUserId}
        onSubmit={submitExpense}
      />
      <ExpensesSummaryCard
        totalAmount={totalAmount}
        userPaidAmount={userPaidAmount}
        partnerPaidAmount={partnerPaidAmount}
        userBalance={userBalance}
      />
      <ExpensesList expenses={expenses} isLoading={isLoading} />
    </ScreenTemplate>
  );
}
