import { useState } from "react";

import { householdService } from "@/src/services/household/household-service";
import { useAuthStore } from "@/src/store/auth-store";
import type { Household } from "@/src/types/household";

type OnboardingMode = "create" | "join";

type UseHouseholdOnboardingResult = {
  mode: OnboardingMode;
  householdName: string;
  inviteCode: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  household: Household | null;
  setMode: (mode: OnboardingMode) => void;
  setHouseholdName: (value: string) => void;
  setInviteCode: (value: string) => void;
  submit: () => Promise<void>;
};

export const useHouseholdOnboarding = (): UseHouseholdOnboardingResult => {
  const user = useAuthStore((state) => state.user);
  const [mode, setMode] = useState<OnboardingMode>("create");
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);

  const submit = async () => {
    if (!user?.id) {
      setErrorMessage("You must be logged in to manage a household.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const createdHousehold = await householdService.createHousehold({
          name: householdName,
          userId: user.id,
        });
        setHousehold(createdHousehold);
        setSuccessMessage("Household created successfully.");
        return;
      }

      const joinedHousehold = await householdService.joinHouseholdByInviteCode({
        inviteCode,
        userId: user.id,
      });
      setHousehold(joinedHousehold);
      setSuccessMessage("Joined household successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
