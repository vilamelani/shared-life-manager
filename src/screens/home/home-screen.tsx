import { HouseholdOnboardingCard } from "@/src/components/household/household-onboarding-card";
import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { useHouseholdOnboarding } from "@/src/hooks/use-household-onboarding";

export function HomeScreen() {
  const {
    mode,
    householdName,
    inviteCode,
    isSubmitting,
    errorMessage,
    successMessage,
    household,
    setMode,
    setHouseholdName,
    setInviteCode,
    submit,
  } = useHouseholdOnboarding();

  return (
    <ScreenTemplate
      title="Shared Life Manager"
      description="Create or join your shared household to unlock expenses, shopping, and goals."
    >
      <HouseholdOnboardingCard
        mode={mode}
        householdName={householdName}
        inviteCode={inviteCode}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
        household={household}
        onModeChange={setMode}
        onHouseholdNameChange={setHouseholdName}
        onInviteCodeChange={setInviteCode}
        onSubmit={submit}
      />
    </ScreenTemplate>
  );
}
