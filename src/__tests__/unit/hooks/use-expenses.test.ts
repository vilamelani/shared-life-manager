import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useExpenses } from "@/src/hooks/use-expenses";
import { expensesService } from "@/src/services/expenses/expenses-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/expenses/expenses-service", () => ({
  expensesService: {
    listHouseholdExpenses: jest.fn(),
    createExpense: jest.fn(),
    subscribeToHouseholdExpenses: jest.fn(),
    listHouseholdMemberUserIds: jest.fn(),
  },
}));

describe("useExpenses", () => {
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

    (expensesService.subscribeToHouseholdExpenses as jest.Mock).mockReturnValue(
      jest.fn(),
    );
    (expensesService.listHouseholdExpenses as jest.Mock).mockResolvedValue([]);
    (expensesService.listHouseholdMemberUserIds as jest.Mock).mockResolvedValue([
      "u1",
      "u2",
    ]);
  });

  it("loads expenses for active household", async () => {
    renderHook(() => useExpenses());

    await waitFor(() =>
      expect(expensesService.listHouseholdExpenses).toHaveBeenCalledWith("h1"),
    );
  });

  it("submits expense and reloads list", async () => {
    (expensesService.createExpense as jest.Mock).mockResolvedValue({
      id: "e1",
      householdId: "h1",
      title: "Groceries",
      amount: 50,
      paidByUserId: "u1",
      notes: null,
      createdAt: "2026-01-01",
    });

    const { result } = renderHook(() => useExpenses());

    act(() => {
      result.current.setTitle("Groceries");
      result.current.setAmountInput("50");
    });

    await act(async () => {
      await result.current.submitExpense();
    });

    expect(expensesService.createExpense).toHaveBeenCalledWith({
      householdId: "h1",
      title: "Groceries",
      amount: 50,
      paidByUserId: "u1",
      splitStrategy: "equal_split",
      notes: "",
    });
  });
});
