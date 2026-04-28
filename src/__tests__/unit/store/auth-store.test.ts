import { authStore } from "@/src/store/auth-store";
import { authService } from "@/src/services/auth/auth-service";
import { householdService } from "@/src/services/household/household-service";

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    signOut: jest.fn(),
  },
}));

jest.mock("@/src/services/household/household-service", () => ({
  householdService: {
    listUserHouseholds: jest.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    authStore.resetForTests();
    jest.clearAllMocks();
  });

  it("updates user and status when session is set", () => {
    authStore.setSession({
      user: { id: "u1", app_metadata: {}, user_metadata: {}, aud: "authenticated" },
    } as never);

    const state = authStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.user?.id).toBe("u1");
  });

  it("logs out and clears signing-out state", async () => {
    const mockedSignOut = authService.signOut as jest.Mock;
    mockedSignOut.mockResolvedValue(undefined);

    await authStore.logout();

    expect(mockedSignOut).toHaveBeenCalled();
    expect(authStore.getState().isSigningOut).toBe(false);
    expect(authStore.getState().signOutError).toBeNull();
  });

  it("stores logout error when service fails", async () => {
    const mockedSignOut = authService.signOut as jest.Mock;
    mockedSignOut.mockRejectedValue(new Error("Sign out failed"));

    await authStore.logout();

    expect(authStore.getState().isSigningOut).toBe(false);
    expect(authStore.getState().signOutError).toBe("Sign out failed");
  });

  it("loads households and sets active household", async () => {
    (householdService.listUserHouseholds as jest.Mock).mockResolvedValue([
      {
        id: "h1",
        name: "Family",
        inviteCode: "ABC123",
        createdBy: "u1",
        createdAt: "2026-01-01",
      },
    ]);

    authStore.setSession({
      user: { id: "u1", app_metadata: {}, user_metadata: {}, aud: "authenticated" },
    } as never);

    await authStore.loadHouseholds();

    expect(authStore.getState().households).toHaveLength(1);
    expect(authStore.getState().activeHouseholdId).toBe("h1");
  });
});
