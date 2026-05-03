import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { SavingsScreen } from "@/src/screens/savings/savings-screen";
import { savingsService } from "@/src/services/savings/savings-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/savings/savings-service", () => ({
  savingsService: {
    listHouseholdSavingsGoals: jest.fn(),
    createSavingsGoal: jest.fn(),
    addContribution: jest.fn(),
    subscribeToHouseholdSavings: jest.fn(),
  },
}));

describe("SavingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.resetForTests();
    authStore.setSession({
      user: {
        id: "u1",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
      },
    } as never);
    authStore.setHouseholds([
      {
        id: "h1",
        name: "Family",
        inviteCode: "ABC123",
        createdBy: "u1",
        createdAt: "2026-01-01",
      },
    ]);
    (savingsService.listHouseholdSavingsGoals as jest.Mock).mockResolvedValue([]);
    (savingsService.subscribeToHouseholdSavings as jest.Mock).mockReturnValue(jest.fn());
  });

  it("creates savings goal from form", async () => {
    const { getByTestId } = render(<SavingsScreen />);

    fireEvent.changeText(getByTestId("savings-goal-title-input"), "Vacation");
    fireEvent.changeText(getByTestId("savings-goal-target-input"), "500");
    fireEvent.press(getByTestId("savings-goal-submit-button"));

    await waitFor(() =>
      expect(savingsService.createSavingsGoal).toHaveBeenCalledWith({
        householdId: "h1",
        title: "Vacation",
        targetAmount: 500,
        targetDate: "",
        createdByUserId: "u1",
      }),
    );
  });
});
