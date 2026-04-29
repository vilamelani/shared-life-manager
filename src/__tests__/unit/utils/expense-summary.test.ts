import { buildExpenseSummary } from "@/src/utils/expense-summary";

describe("buildExpenseSummary", () => {
  it("computes total paid and balance for two-person split", () => {
    const summary = buildExpenseSummary(
      [
        {
          id: "e1",
          householdId: "h1",
          title: "Groceries",
          amount: 40,
          paidByUserId: "u1",
          notes: null,
          createdAt: "2026-01-01",
        },
        {
          id: "e2",
          householdId: "h1",
          title: "Utilities",
          amount: 20,
          paidByUserId: "u2",
          notes: null,
          createdAt: "2026-01-01",
        },
      ],
      "u1",
    );

    expect(summary.totalAmount).toBe(60);
    expect(summary.userPaidAmount).toBe(40);
    expect(summary.partnerPaidAmount).toBe(20);
    expect(summary.userBalance).toBe(10);
  });
});
