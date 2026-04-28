import { householdService } from "@/src/services/household/household-service";
import { supabase } from "@/src/services/supabase";

jest.mock("@/src/services/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("householdService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates household and owner membership", async () => {
    const mockedFrom = supabase.from as jest.Mock;

    const single = jest.fn().mockResolvedValue({
      data: {
        id: "h1",
        name: "Home",
        invite_code: "ABC123",
        created_by: "u1",
        created_at: "2026-01-01",
      },
      error: null,
    });

    const select = jest.fn().mockReturnValue({ single });
    const householdsInsert = jest.fn().mockReturnValue({ select });
    const membershipsInsert = jest.fn().mockResolvedValue({ error: null });

    mockedFrom.mockImplementation((table: string) => {
      if (table === "households") {
        return { insert: householdsInsert };
      }

      return { insert: membershipsInsert };
    });

    const result = await householdService.createHousehold({
      name: "Home",
      userId: "u1",
    });

    expect(result.name).toBe("Home");
    expect(membershipsInsert).toHaveBeenCalledWith({
      household_id: "h1",
      user_id: "u1",
      role: "owner",
    });
  });

  it("joins household by invite code", async () => {
    const mockedFrom = supabase.from as jest.Mock;

    const maybeSingle = jest.fn().mockResolvedValue({
      data: {
        id: "h2",
        name: "Shared Flat",
        invite_code: "JOINME",
        created_by: "u2",
        created_at: "2026-01-01",
      },
      error: null,
    });
    const eqInvite = jest.fn().mockReturnValue({ maybeSingle });
    const select = jest.fn().mockReturnValue({ eq: eqInvite });
    const membershipsInsert = jest.fn().mockResolvedValue({ error: null });

    mockedFrom.mockImplementation((table: string) => {
      if (table === "households") {
        return { select };
      }
      return { insert: membershipsInsert };
    });

    const result = await householdService.joinHouseholdByInviteCode({
      inviteCode: "joinme",
      userId: "u3",
    });

    expect(result.inviteCode).toBe("JOINME");
    expect(eqInvite).toHaveBeenCalledWith("invite_code", "JOINME");
  });
});
