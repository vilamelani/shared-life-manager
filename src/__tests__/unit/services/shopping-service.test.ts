import { shoppingService } from "@/src/services/shopping/shopping-service";
import { supabase } from "@/src/services/supabase";

jest.mock("@/src/services/supabase", () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

describe("shoppingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists shopping items for household", async () => {
    const mockedFrom = supabase.from as jest.Mock;
    const order = jest.fn().mockResolvedValue({
      data: [
        {
          id: "s1",
          household_id: "h1",
          name: "Milk",
          quantity: 2,
          added_by_user_id: "u1",
          is_completed: false,
          created_at: "2026-01-01",
        },
      ],
      error: null,
    });
    const eq = jest.fn().mockReturnValue({ order });
    const select = jest.fn().mockReturnValue({ eq });
    mockedFrom.mockReturnValue({ select });

    const result = await shoppingService.listHouseholdShoppingItems("h1");
    expect(result[0].name).toBe("Milk");
  });

  it("creates shopping item", async () => {
    const mockedFrom = supabase.from as jest.Mock;
    const single = jest.fn().mockResolvedValue({
      data: {
        id: "s2",
        household_id: "h1",
        name: "Bread",
        quantity: 1,
        added_by_user_id: "u1",
        is_completed: false,
        created_at: "2026-01-01",
      },
      error: null,
    });
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    mockedFrom.mockReturnValue({ insert });

    const result = await shoppingService.createShoppingItem({
      householdId: "h1",
      name: "Bread",
      quantity: 1,
      addedByUserId: "u1",
    });

    expect(result.id).toBe("s2");
  });
});
