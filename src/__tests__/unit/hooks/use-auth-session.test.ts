import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useAuthSession } from "@/src/hooks/use-auth-session";
import { authService } from "@/src/services/auth/auth-service";
import { householdService } from "@/src/services/household/household-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
}));

jest.mock("@/src/services/household/household-service", () => ({
  householdService: {
    listUserHouseholds: jest.fn(),
  },
}));

describe("useAuthSession", () => {
  beforeEach(() => {
    authStore.resetForTests();
    jest.clearAllMocks();
  });

  it("hydrates with existing session and listens for auth updates", async () => {
    const unsubscribe = jest.fn();
    const authCallbackHolder: { callback?: (event: string, session: unknown) => void } = {};
    const session = { user: { id: "u1" } };

    const mockedGetSession = authService.getSession as jest.Mock;
    const mockedOnAuthStateChange = authService.onAuthStateChange as jest.Mock;
    const mockedListUserHouseholds = householdService.listUserHouseholds as jest.Mock;

    mockedGetSession.mockResolvedValue(session);
    mockedListUserHouseholds.mockResolvedValue([]);
    mockedOnAuthStateChange.mockImplementation((callback) => {
      authCallbackHolder.callback = callback;
      return { data: { subscription: { unsubscribe } } };
    });

    const { result, unmount } = renderHook(() => useAuthSession());

    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.session).toEqual(session);

    act(() => {
      authCallbackHolder.callback?.("SIGNED_OUT", null);
    });

    expect(result.current.status).toBe("unauthenticated");
    expect(result.current.isAuthenticated).toBe(false);

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
