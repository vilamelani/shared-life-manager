import { useCallback, useEffect, useState } from "react";

import { savingsService } from "@/src/services/savings/savings-service";
import { useAuthStore } from "@/src/store/auth-store";
import type { SavingsGoal } from "@/src/types/savings";

type UseSavingsGoalsResult = {
  goals: SavingsGoal[];
  goalTitle: string;
  targetAmountInput: string;
  targetDate: string;
  contributionGoalId: string;
  contributionAmountInput: string;
  isLoading: boolean;
  isSubmittingGoal: boolean;
  isSubmittingContribution: boolean;
  errorMessage: string | null;
  setGoalTitle: (value: string) => void;
  setTargetAmountInput: (value: string) => void;
  setTargetDate: (value: string) => void;
  setContributionGoalId: (value: string) => void;
  setContributionAmountInput: (value: string) => void;
  submitGoal: () => Promise<void>;
  submitContribution: () => Promise<void>;
};

export const useSavingsGoals = (): UseSavingsGoalsResult => {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const user = useAuthStore((state) => state.user);

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goalTitle, setGoalTitle] = useState("");
  const [targetAmountInput, setTargetAmountInput] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [contributionGoalId, setContributionGoalId] = useState("");
  const [contributionAmountInput, setContributionAmountInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [isSubmittingContribution, setIsSubmittingContribution] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadGoals = useCallback(async () => {
    if (!activeHouseholdId) {
      setGoals([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextGoals = await savingsService.listHouseholdSavingsGoals(activeHouseholdId);
      setGoals(nextGoals);
      if (nextGoals.length && !contributionGoalId) {
        setContributionGoalId(nextGoals[0].id);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load savings goals. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeHouseholdId, contributionGoalId]);

  useEffect(() => {
    void reloadGoals();
  }, [reloadGoals]);

  useEffect(() => {
    if (!activeHouseholdId) {
      return;
    }

    const unsubscribe = savingsService.subscribeToHouseholdSavings(
      activeHouseholdId,
      reloadGoals,
    );

    return unsubscribe;
  }, [activeHouseholdId, reloadGoals]);

  const submitGoal = async () => {
    if (!activeHouseholdId) {
      setErrorMessage("Select a household before adding savings goals.");
      return;
    }

    if (!user?.id) {
      setErrorMessage("You must be logged in to add savings goals.");
      return;
    }

    const targetAmount = Number(targetAmountInput);

    setIsSubmittingGoal(true);
    setErrorMessage(null);
    try {
      await savingsService.createSavingsGoal({
        householdId: activeHouseholdId,
        title: goalTitle,
        targetAmount,
        targetDate,
        createdByUserId: user.id,
      });
      setGoalTitle("");
      setTargetAmountInput("");
      setTargetDate("");
      await reloadGoals();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create savings goal. Please try again.",
      );
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const submitContribution = async () => {
    if (!activeHouseholdId) {
      setErrorMessage("Select a household before adding contributions.");
      return;
    }

    if (!user?.id) {
      setErrorMessage("You must be logged in to add contributions.");
      return;
    }

    if (!contributionGoalId) {
      setErrorMessage("Select a savings goal before contributing.");
      return;
    }

    const amount = Number(contributionAmountInput);

    setIsSubmittingContribution(true);
    setErrorMessage(null);
    try {
      await savingsService.addContribution({
        savingsGoalId: contributionGoalId,
        householdId: activeHouseholdId,
        amount,
        contributedByUserId: user.id,
      });
      setContributionAmountInput("");
      await reloadGoals();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to add contribution. Please try again.",
      );
    } finally {
      setIsSubmittingContribution(false);
    }
  };

  return {
    goals,
    goalTitle,
    targetAmountInput,
    targetDate,
    contributionGoalId,
    contributionAmountInput,
    isLoading,
    isSubmittingGoal,
    isSubmittingContribution,
    errorMessage,
    setGoalTitle,
    setTargetAmountInput,
    setTargetDate,
    setContributionGoalId,
    setContributionAmountInput,
    submitGoal,
    submitContribution,
  };
};
