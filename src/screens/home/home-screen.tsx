import { ActiveHouseholdSwitcher } from "@/src/components/household/active-household-switcher";
import { HouseholdOnboardingCard } from "@/src/components/household/household-onboarding-card";
import { ScreenTemplate } from "@/src/components/ui/screen-template";
import { useHouseholdOnboarding } from "@/src/hooks/use-household-onboarding";
import { ThemedText } from "@/src/components/themed-text";
import { authStore, useAuthStore } from "@/src/store/auth-store";

export function HomeScreen() {
  const households = useAuthStore((state) => state.households);
  const activeHouseholdId = useAuthStore((state) => state.activeHouseholdId);
  const isLoadingHouseholds = useAuthStore((state) => state.isLoadingHouseholds);

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

  const activeHousehold = households.find(
    (householdItem) => householdItem.id === activeHouseholdId,
  );

  return (
    <ScreenTemplate
      title="Shared Life Manager"
      description="Create or join your shared household to unlock expenses, shopping, and goals."
    >
      {isLoadingHouseholds ? <ThemedText>Loading your households...</ThemedText> : null}
      {activeHousehold ? (
        <ThemedText testID="active-household-label">
          Active household: {activeHousehold.name}
        </ThemedText>
      ) : null}
      <ActiveHouseholdSwitcher
        households={households}
        activeHouseholdId={activeHouseholdId}
        onSelectHousehold={authStore.setActiveHousehold}
      />
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
