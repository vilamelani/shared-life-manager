import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useSavingsGoals } from "@/src/hooks/use-savings-goals";
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

describe("useSavingsGoals", () => {
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

  it("loads savings goals", async () => {
    renderHook(() => useSavingsGoals());
    await waitFor(() =>
      expect(savingsService.listHouseholdSavingsGoals).toHaveBeenCalledWith("h1"),
    );
  });

  it("creates savings goal", async () => {
    const { result } = renderHook(() => useSavingsGoals());

    act(() => {
      result.current.setGoalTitle("Vacation");
      result.current.setTargetAmountInput("1000");
    });

    await act(async () => {
      await result.current.submitGoal();
    });

    expect(savingsService.createSavingsGoal).toHaveBeenCalledWith({
      householdId: "h1",
      title: "Vacation",
      targetAmount: 1000,
      targetDate: "",
      createdByUserId: "u1",
    });
  });
});
