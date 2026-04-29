export type Expense = {
  id: string;
  householdId: string;
  title: string;
  amount: number;
  paidByUserId: string;
  notes: string | null;
  createdAt: string;
};

export type CreateExpenseInput = {
  householdId: string;
  title: string;
  amount: number;
  paidByUserId: string;
  notes?: string;
};
