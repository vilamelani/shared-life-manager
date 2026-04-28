import React, { type ReactNode } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { LoginScreen } from "@/src/screens/auth/login-screen";
import { authService } from "@/src/services/auth/auth-service";

const mockReact = React;
const mockText = Text;

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: ReactNode }) => {
    return mockReact.createElement(mockText, null, children);
  },
}));

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    signInWithPassword: jest.fn(),
  },
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits credentials through auth service", async () => {
    const mockedSignIn = authService.signInWithPassword as jest.Mock;
    mockedSignIn.mockResolvedValue({ session: { access_token: "token" } });

    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId("auth-email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("auth-password-input"), "123456");
    fireEvent.press(getByTestId("auth-submit-button"));

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "123456",
      }),
    );
  });

  it("shows service errors to the user", async () => {
    const mockedSignIn = authService.signInWithPassword as jest.Mock;
    mockedSignIn.mockRejectedValue(new Error("Invalid login"));

    const { getByTestId, findByText } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId("auth-email-input"), "x@example.com");
    fireEvent.changeText(getByTestId("auth-password-input"), "wrong");
    fireEvent.press(getByTestId("auth-submit-button"));

    expect(await findByText("Invalid login")).toBeTruthy();
  });
});
