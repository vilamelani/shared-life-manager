import React, { type ReactNode } from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { AuthCallbackScreen } from "@/src/screens/auth/auth-callback-screen";
import { authService } from "@/src/services/auth/auth-service";

const mockReact = React;
const mockText = Text;
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: ReactNode }) =>
    mockReact.createElement(mockText, null, children),
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock("@/src/services/auth/auth-service", () => ({
  authService: {
    completeEmailVerification: jest.fn(),
  },
}));

describe("AuthCallbackScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("completes verification and redirects to app root", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      code: "abc123",
    });
    (authService.completeEmailVerification as jest.Mock).mockResolvedValue({
      access_token: "token",
    });

    render(<AuthCallbackScreen />);

    await waitFor(() =>
      expect(authService.completeEmailVerification).toHaveBeenCalledWith({
        code: "abc123",
        tokenHash: undefined,
        type: undefined,
      }),
    );
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
