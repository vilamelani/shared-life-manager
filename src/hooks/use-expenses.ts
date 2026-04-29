import { useCallback, useEffect, useState } from "react";

import { expensesService } from "@/src/services/expenses/expenses-service";
import { useAuthStore } from "@/src/store/auth-store";
import type { Expense } from "@/src/types/expense";
import { buildExpenseSummary } from "@/src/utils/expense-summary";

type UseExpensesResult = {
  expenses: Expense[];
  title: string;
  amountInput: string;
  notes: string;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  totalAmount: number;
  userPaidAmount: number;
  partnerPaidAmount: number;
  userBalance: number;
  setTitle: (value: string) => void;
  setAmountInput: (value: string) => void;
  setNotes: (value: string) => void;
  submitExpense: () => Promise<void>;
  reloadExpenses: () => Promise<void>;
};

export const useExpenses = (): UseExpensesResult => {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const user = useAuthStore((state) => state.user);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const expenseSummary = buildExpenseSummary(expenses, user?.id);

  const reloadExpenses = useCallback(async () => {
    if (!activeHouseholdId) {
      setExpenses([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextExpenses = await expensesService.listHouseholdExpenses(activeHouseholdId);
      setExpenses(nextExpenses);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load expenses. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeHouseholdId]);

  useEffect(() => {
    void reloadExpenses();
  }, [reloadExpenses]);

  useEffect(() => {
    if (!activeHouseholdId) {
      return;
    }

    const unsubscribe = expensesService.subscribeToHouseholdExpenses(
      activeHouseholdId,
      reloadExpenses,
    );

    return unsubscribe;
  }, [activeHouseholdId, reloadExpenses]);

  const submitExpense = async () => {
    if (!activeHouseholdId) {
      setErrorMessage("Select a household before adding expenses.");
      return;
    }

    if (!user?.id) {
      setErrorMessage("You must be logged in to add expenses.");
      return;
    }

    const parsedAmount = Number(amountInput);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await expensesService.createExpense({
        householdId: activeHouseholdId,
        title,
        amount: parsedAmount,
        paidByUserId: user.id,
        notes,
      });
      setTitle("");
      setAmountInput("");
      setNotes("");
      await reloadExpenses();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create expense. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    expenses,
    title,
    amountInput,
    notes,
    isLoading,
    isSubmitting,
    errorMessage,
    totalAmount: expenseSummary.totalAmount,
    userPaidAmount: expenseSummary.userPaidAmount,
    partnerPaidAmount: expenseSummary.partnerPaidAmount,
    userBalance: expenseSummary.userBalance,
    setTitle,
    setAmountInput,
    setNotes,
    submitExpense,
    reloadExpenses,
  };
};
