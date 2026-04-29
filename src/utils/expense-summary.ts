import type { Expense } from "@/src/types/expense";

type ExpenseSummary = {
  totalAmount: number;
  userPaidAmount: number;
  partnerPaidAmount: number;
  userBalance: number;
};

export const buildExpenseSummary = (
  expenses: Expense[],
  currentUserId: string | null | undefined,
): ExpenseSummary => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (!currentUserId) {
    return {
      totalAmount,
      userPaidAmount: 0,
      partnerPaidAmount: totalAmount,
      userBalance: 0,
    };
  }

  const userPaidAmount = expenses
    .filter((expense) => expense.paidByUserId === currentUserId)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const partnerPaidAmount = totalAmount - userPaidAmount;
  const equalShare = totalAmount / 2;
  const userBalance = userPaidAmount - equalShare;

  return {
    totalAmount,
    userPaidAmount,
    partnerPaidAmount,
    userBalance,
  };
};
