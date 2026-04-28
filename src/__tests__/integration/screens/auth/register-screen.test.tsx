import React, { type ReactNode } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { RegisterScreen } from "@/src/screens/auth/register-screen";
import { authService } from "@/src/services/auth/auth-service";

const mockReact = React;
const mockText = Text;

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: ReactNode }) =>
    mockReact.createElement(mockText, null, children),
}));

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    signUpWithPassword: jest.fn(),
  },
}));

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prevents submit when passwords do not match", async () => {
    const mockedSignUp = authService.signUpWithPassword as jest.Mock;
    const { getByTestId, findByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("auth-email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("auth-password-input"), "password123");
    fireEvent.changeText(
      getByTestId("auth-confirm-password-input"),
      "different123",
    );
    fireEvent.press(getByTestId("auth-submit-button"));

    expect(await findByText("Passwords do not match.")).toBeTruthy();
    expect(mockedSignUp).not.toHaveBeenCalled();
  });

  it("shows confirmation guidance when email verification is required", async () => {
    const mockedSignUp = authService.signUpWithPassword as jest.Mock;
    mockedSignUp.mockResolvedValue({
      user: { id: "u1" },
      session: null,
    });

    const { getByTestId, findByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("auth-email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("auth-password-input"), "password123");
    fireEvent.changeText(
      getByTestId("auth-confirm-password-input"),
      "password123",
    );
    fireEvent.press(getByTestId("auth-submit-button"));

    await waitFor(() => expect(mockedSignUp).toHaveBeenCalled());
    expect(
      await findByText("Check your inbox to confirm your email before signing in."),
    ).toBeTruthy();
  });
});
