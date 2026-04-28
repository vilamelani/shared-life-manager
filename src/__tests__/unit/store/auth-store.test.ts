import { authStore } from "@/src/store/auth-store";
import { authService } from "@/src/services/auth/auth-service";

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    signOut: jest.fn(),
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
});
