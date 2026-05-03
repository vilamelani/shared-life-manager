import { supabase } from "@/src/services/supabase";
import type {
  CreateSavingsContributionInput,
  CreateSavingsGoalInput,
  SavingsContribution,
  SavingsGoal,
} from "@/src/types/savings";

type SavingsGoalRow = {
  id: string;
  household_id: string;
  title: string;
  target_amount: number;
  target_date: string | null;
  created_by_user_id: string;
  created_at: string;
};

type SavingsContributionRow = {
  id: string;
  savings_goal_id: string;
  household_id: string;
  amount: number;
  contributed_by_user_id: string;
  created_at: string;
};

const mapContributionRow = (row: SavingsContributionRow): SavingsContribution => {
  return {
    id: row.id,
    savingsGoalId: row.savings_goal_id,
    householdId: row.household_id,
    amount: row.amount,
    contributedByUserId: row.contributed_by_user_id,
    createdAt: row.created_at,
  };
};

const mapGoalWithContributions = (
  goal: SavingsGoalRow,
  contributions: SavingsContribution[],
): SavingsGoal => {
  const totalContributed = contributions
    .filter((contribution) => contribution.savingsGoalId === goal.id)
    .reduce((sum, contribution) => sum + contribution.amount, 0);

  return {
    id: goal.id,
    householdId: goal.household_id,
    title: goal.title,
    targetAmount: goal.target_amount,
    targetDate: goal.target_date,
    createdByUserId: goal.created_by_user_id,
    createdAt: goal.created_at,
    totalContributed,
    remainingAmount: Math.max(goal.target_amount - totalContributed, 0),
  };
};

const listHouseholdSavingsGoals = async (householdId: string): Promise<SavingsGoal[]> => {
  const { data: goals, error: goalsError } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (goalsError) {
    throw goalsError;
  }

  const { data: contributions, error: contributionsError } = await supabase
    .from("savings_contributions")
    .select("*")
    .eq("household_id", householdId);

  if (contributionsError) {
    throw contributionsError;
  }

  const mappedContributions = (contributions ?? []).map(mapContributionRow);
  return (goals ?? []).map((goal) => mapGoalWithContributions(goal, mappedContributions));
};

const createSavingsGoal = async ({
  householdId,
  title,
  targetAmount,
  targetDate,
  createdByUserId,
}: CreateSavingsGoalInput): Promise<void> => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("Goal title is required.");
  }

  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    throw new Error("Target amount must be greater than zero.");
  }

  const { error } = await supabase.from("savings_goals").insert({
    household_id: householdId,
    title: trimmedTitle,
    target_amount: targetAmount,
    target_date: targetDate?.trim() ? targetDate : null,
    created_by_user_id: createdByUserId,
  });

  if (error) {
    throw error;
  }
};

const addContribution = async ({
  savingsGoalId,
  householdId,
  amount,
  contributedByUserId,
}: CreateSavingsContributionInput): Promise<void> => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Contribution amount must be greater than zero.");
  }

  const { error } = await supabase.from("savings_contributions").insert({
    savings_goal_id: savingsGoalId,
    household_id: householdId,
    amount,
    contributed_by_user_id: contributedByUserId,
  });

  if (error) {
    throw error;
  }
};

const subscribeToHouseholdSavings = (
  householdId: string,
  onChange: () => Promise<void> | void,
) => {
  const goalsChannel = supabase
    .channel(`savings-goals:${householdId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "savings_goals",
        filter: `household_id=eq.${householdId}`,
      },
      () => {
        void onChange();
      },
    )
    .subscribe();

  const contributionsChannel = supabase
    .channel(`savings-contributions:${householdId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "savings_contributions",
        filter: `household_id=eq.${householdId}`,
      },
      () => {
        void onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(goalsChannel);
    void supabase.removeChannel(contributionsChannel);
  };
};

export const savingsService = {
  listHouseholdSavingsGoals,
  createSavingsGoal,
  addContribution,
  subscribeToHouseholdSavings,
};
