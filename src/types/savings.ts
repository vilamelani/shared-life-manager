export type SavingsGoal = {
  id: string;
  householdId: string;
  title: string;
  targetAmount: number;
  targetDate: string | null;
  createdByUserId: string;
  createdAt: string;
  totalContributed: number;
  remainingAmount: number;
};

export type SavingsContribution = {
  id: string;
  savingsGoalId: string;
  householdId: string;
  amount: number;
  contributedByUserId: string;
  createdAt: string;
};

export type CreateSavingsGoalInput = {
  householdId: string;
  title: string;
  targetAmount: number;
  targetDate?: string;
  createdByUserId: string;
};

export type CreateSavingsContributionInput = {
  savingsGoalId: string;
  householdId: string;
  amount: number;
  contributedByUserId: string;
};
