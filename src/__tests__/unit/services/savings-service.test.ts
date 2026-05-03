import { savingsService } from "@/src/services/savings/savings-service";
import { supabase } from "@/src/services/supabase";

jest.mock("@/src/services/supabase", () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

describe("savingsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists goals with computed contribution totals", async () => {
    const mockedFrom = supabase.from as jest.Mock;
    const goalsOrder = jest.fn().mockResolvedValue({
      data: [
        {
          id: "g1",
          household_id: "h1",
          title: "Vacation",
          target_amount: 1000,
          target_date: null,
          created_by_user_id: "u1",
          created_at: "2026-01-01",
        },
      ],
      error: null,
    });
    const goalsEq = jest.fn().mockReturnValue({ order: goalsOrder });
    const goalsSelect = jest.fn().mockReturnValue({ eq: goalsEq });

    const contributionsEq = jest.fn().mockResolvedValue({
      data: [
        {
          id: "c1",
          savings_goal_id: "g1",
          household_id: "h1",
          amount: 200,
          contributed_by_user_id: "u1",
          created_at: "2026-01-01",
        },
      ],
      error: null,
    });
    const contributionsSelect = jest.fn().mockReturnValue({ eq: contributionsEq });

    mockedFrom.mockImplementation((table: string) => {
      if (table === "savings_goals") {
        return { select: goalsSelect };
      }
      return { select: contributionsSelect };
    });

    const result = await savingsService.listHouseholdSavingsGoals("h1");
    expect(result[0].totalContributed).toBe(200);
    expect(result[0].remainingAmount).toBe(800);
  });
});
