import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useHouseholdOnboarding } from "@/src/hooks/use-household-onboarding";
import { householdService } from "@/src/services/household/household-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/household/household-service", () => ({
  householdService: {
    createHousehold: jest.fn(),
    joinHouseholdByInviteCode: jest.fn(),
  },
}));

describe("useHouseholdOnboarding", () => {
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
  });

  it("creates household in create mode", async () => {
    const mockedCreate = householdService.createHousehold as jest.Mock;
    mockedCreate.mockResolvedValue({
      id: "h1",
      name: "My Home",
      inviteCode: "ABCD12",
      createdBy: "u1",
      createdAt: "2026-01-01",
    });

    const { result } = renderHook(() => useHouseholdOnboarding());

    act(() => {
      result.current.setHouseholdName("My Home");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() =>
      expect(result.current.successMessage).toBe("Household created successfully."),
    );
  });

  it("joins household in join mode", async () => {
    const mockedJoin = householdService.joinHouseholdByInviteCode as jest.Mock;
    mockedJoin.mockResolvedValue({
      id: "h2",
      name: "Shared",
      inviteCode: "JOIN88",
      createdBy: "u2",
      createdAt: "2026-01-01",
    });

    const { result } = renderHook(() => useHouseholdOnboarding());

    act(() => {
      result.current.setMode("join");
      result.current.setInviteCode("join88");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() =>
      expect(result.current.successMessage).toBe("Joined household successfully."),
    );
  });
});
