import { supabase } from "@/src/services/supabase";
import type { CreateExpenseInput, Expense } from "@/src/types/expense";

const mapExpenseRow = (row: {
  id: string;
  household_id: string;
  title: string;
  amount: number;
  paid_by_user_id: string;
  split_strategy: "equal_split";
  notes: string | null;
  created_at: string;
}): Expense => {
  return {
    id: row.id,
    householdId: row.household_id,
    title: row.title,
    amount: row.amount,
    paidByUserId: row.paid_by_user_id,
    splitStrategy: row.split_strategy,
    notes: row.notes,
    createdAt: row.created_at,
  };
};

const listHouseholdExpenses = async (householdId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapExpenseRow);
};

const createExpense = async ({
  householdId,
  title,
  amount,
  paidByUserId,
  splitStrategy = "equal_split",
  notes,
}: CreateExpenseInput): Promise<Expense> => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("Expense title is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      household_id: householdId,
      title: trimmedTitle,
      amount,
      paid_by_user_id: paidByUserId,
      split_strategy: splitStrategy,
      notes: notes?.trim() ? notes.trim() : null,
    })
    .select()
    .single();

  if (error || !data) {
    throw error ?? new Error("Unable to create expense.");
  }

  return mapExpenseRow(data);
};

const listHouseholdMemberUserIds = async (householdId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("household_memberships")
    .select("user_id")
    .eq("household_id", householdId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((member) => member.user_id);
};

const subscribeToHouseholdExpenses = (
  householdId: string,
  onChange: () => Promise<void> | void,
) => {
  const channel = supabase
    .channel(`expenses:${householdId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "expenses",
        filter: `household_id=eq.${householdId}`,
      },
      () => {
        void onChange();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
};

export const expensesService = {
  listHouseholdExpenses,
  createExpense,
  subscribeToHouseholdExpenses,
  listHouseholdMemberUserIds,
};
