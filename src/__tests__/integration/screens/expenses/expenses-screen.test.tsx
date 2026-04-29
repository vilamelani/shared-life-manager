import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { ExpensesScreen } from "@/src/screens/expenses/expenses-screen";
import { expensesService } from "@/src/services/expenses/expenses-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/expenses/expenses-service", () => ({
  expensesService: {
    listHouseholdExpenses: jest.fn(),
    createExpense: jest.fn(),
    subscribeToHouseholdExpenses: jest.fn(),
  },
}));

describe("ExpensesScreen", () => {
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
  });

  it("creates an expense from the form", async () => {
    (expensesService.createExpense as jest.Mock).mockResolvedValue({
      id: "e1",
      householdId: "h1",
      title: "Groceries",
      amount: 20,
      paidByUserId: "u1",
      notes: null,
      createdAt: "2026-01-01",
    });

    const { getByTestId } = render(<ExpensesScreen />);

    fireEvent.changeText(getByTestId("expense-title-input"), "Groceries");
    fireEvent.changeText(getByTestId("expense-amount-input"), "20");
    fireEvent.press(getByTestId("expense-submit-button"));

    await waitFor(() =>
      expect(expensesService.createExpense).toHaveBeenCalledWith({
        householdId: "h1",
        title: "Groceries",
        amount: 20,
        paidByUserId: "u1",
        notes: "",
      }),
    );
  });

  it("shows summary values from loaded expenses", async () => {
    (expensesService.listHouseholdExpenses as jest.Mock).mockResolvedValue([
      {
        id: "e1",
        householdId: "h1",
        title: "Groceries",
        amount: 30,
        paidByUserId: "u1",
        notes: null,
        createdAt: "2026-01-01",
      },
      {
        id: "e2",
        householdId: "h1",
        title: "Snacks",
        amount: 10,
        paidByUserId: "u2",
        notes: null,
        createdAt: "2026-01-01",
      },
    ]);

    const { findByTestId } = render(<ExpensesScreen />);

    const totalLabel = await findByTestId("expenses-total-label");
    expect(totalLabel.props.children.join("")).toContain("$40.00");
  });
});
