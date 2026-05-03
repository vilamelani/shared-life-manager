import { expensesService } from "@/src/services/expenses/expenses-service";
import { supabase } from "@/src/services/supabase";

jest.mock("@/src/services/supabase", () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

describe("expensesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists household expenses", async () => {
    const mockedFrom = supabase.from as jest.Mock;

    const order = jest.fn().mockResolvedValue({
      data: [
        {
          id: "e1",
          household_id: "h1",
          title: "Groceries",
          amount: 45.5,
          paid_by_user_id: "u1",
          split_strategy: "equal_split",
          notes: null,
          created_at: "2026-01-01",
        },
      ],
      error: null,
    });
    const eq = jest.fn().mockReturnValue({ order });
    const select = jest.fn().mockReturnValue({ eq });

    mockedFrom.mockReturnValue({ select });

    const result = await expensesService.listHouseholdExpenses("h1");

    expect(result[0].title).toBe("Groceries");
    expect(eq).toHaveBeenCalledWith("household_id", "h1");
  });

  it("creates expense with mapped response", async () => {
    const mockedFrom = supabase.from as jest.Mock;

    const single = jest.fn().mockResolvedValue({
      data: {
        id: "e2",
        household_id: "h1",
        title: "Rent",
        amount: 500,
        paid_by_user_id: "u1",
        split_strategy: "equal_split",
        notes: "April",
        created_at: "2026-01-01",
      },
      error: null,
    });
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });

    mockedFrom.mockReturnValue({ insert });

    const result = await expensesService.createExpense({
      householdId: "h1",
      title: "Rent",
      amount: 500,
      paidByUserId: "u1",
      notes: "April",
    });

    expect(result.id).toBe("e2");
    expect(insert).toHaveBeenCalled();
  });

  it("lists household member user ids", async () => {
    const mockedFrom = supabase.from as jest.Mock;
    const eq = jest.fn().mockResolvedValue({
      data: [{ user_id: "u1" }, { user_id: "u2" }],
      error: null,
    });
    const select = jest.fn().mockReturnValue({ eq });
    mockedFrom.mockReturnValue({ select });

    const result = await expensesService.listHouseholdMemberUserIds("h1");

    expect(result).toEqual(["u1", "u2"]);
  });
});
