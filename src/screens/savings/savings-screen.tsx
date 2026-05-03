import { SavingsContributionCard } from "@/src/components/savings/savings-contribution-card";
import { SavingsGoalFormCard } from "@/src/components/savings/savings-goal-form-card";
import { SavingsGoalsList } from "@/src/components/savings/savings-goals-list";
import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { ThemedText } from "@/src/components/themed-text";
import { useSavingsGoals } from "@/src/hooks/use-savings-goals";
import { useAuthStore } from "@/src/store/auth-store";

export function SavingsScreen() {
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const households = useAuthStore((state) => state.households);
  const {
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
  } = useSavingsGoals();

  const activeHousehold = households.find(
    (household) => household.id === activeHouseholdId,
  );

  return (
    <ScreenTemplate
      title="Savings Goals"
      description="Build shared goals and monitor contribution progress together."
    >
      {!activeHousehold ? (
        <ThemedText>Create or select a household in Home before adding savings goals.</ThemedText>
      ) : (
        <ThemedText testID="savings-active-household">
          Household: {activeHousehold.name}
        </ThemedText>
      )}
      <SavingsGoalFormCard
        goalTitle={goalTitle}
        targetAmountInput={targetAmountInput}
        targetDate={targetDate}
        isSubmitting={isSubmittingGoal}
        errorMessage={errorMessage}
        onGoalTitleChange={setGoalTitle}
        onTargetAmountChange={setTargetAmountInput}
        onTargetDateChange={setTargetDate}
        onSubmit={submitGoal}
      />
      <SavingsContributionCard
        goals={goals}
        selectedGoalId={contributionGoalId}
        contributionAmountInput={contributionAmountInput}
        isSubmitting={isSubmittingContribution}
        onSelectGoal={setContributionGoalId}
        onContributionAmountChange={setContributionAmountInput}
        onSubmit={submitContribution}
      />
      <SavingsGoalsList goals={goals} isLoading={isLoading} />
    </ScreenTemplate>
  );
}
