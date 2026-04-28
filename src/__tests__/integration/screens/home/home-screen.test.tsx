import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { HomeScreen } from "@/src/screens/home/home-screen";
import { householdService } from "@/src/services/household/household-service";
import { authStore } from "@/src/store/auth-store";

jest.mock("@/src/services/household/household-service", () => ({
  householdService: {
    createHousehold: jest.fn(),
    joinHouseholdByInviteCode: jest.fn(),
  },
}));

describe("HomeScreen household onboarding", () => {
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

  it("creates household from onboarding form", async () => {
    const mockedCreate = householdService.createHousehold as jest.Mock;
    mockedCreate.mockResolvedValue({
      id: "h1",
      name: "Family Home",
      inviteCode: "FAM123",
      createdBy: "u1",
      createdAt: "2026-01-01",
    });

    const { getByTestId, findByText } = render(<HomeScreen />);

    fireEvent.changeText(getByTestId("household-name-input"), "Family Home");
    fireEvent.press(getByTestId("household-submit-button"));

    await waitFor(() =>
      expect(mockedCreate).toHaveBeenCalledWith({ name: "Family Home", userId: "u1" }),
    );
    expect(await findByText("Household created successfully.")).toBeTruthy();
  });

  it("joins household with invite code", async () => {
    const mockedJoin = householdService.joinHouseholdByInviteCode as jest.Mock;
    mockedJoin.mockResolvedValue({
      id: "h2",
      name: "Flat",
      inviteCode: "JOIN55",
      createdBy: "u2",
      createdAt: "2026-01-01",
    });

    const { getByTestId, findByText } = render(<HomeScreen />);

    fireEvent.press(getByTestId("join-mode-button"));
    fireEvent.changeText(getByTestId("invite-code-input"), "join55");
    fireEvent.press(getByTestId("household-submit-button"));

    await waitFor(() =>
      expect(mockedJoin).toHaveBeenCalledWith({ inviteCode: "join55", userId: "u1" }),
    );
    expect(await findByText("Joined household successfully.")).toBeTruthy();
  });
});
