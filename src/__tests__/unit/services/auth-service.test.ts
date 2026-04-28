import { authService } from "@/src/services/auth/auth-service";
import { supabase } from "@/src/services/supabase";

jest.mock("@/src/services/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as unknown as {
  auth: {
    signInWithPassword: jest.Mock;
    signUp: jest.Mock;
    signOut: jest.Mock;
    getSession: jest.Mock;
    onAuthStateChange: jest.Mock;
  };
};

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns sign-in data when credentials are valid", async () => {
    const response = { user: { id: "u1" } };
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: response,
      error: null,
    });

    const result = await authService.signInWithPassword({
      email: "test@example.com",
      password: "123456",
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
    });
    expect(result).toEqual(response);
  });

  it("throws when sign-in fails", async () => {
    const error = new Error("Invalid credentials");
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error,
    });

    await expect(
      authService.signInWithPassword({
        email: "bad@example.com",
        password: "wrong",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("returns current session", async () => {
    const session = { access_token: "token" };
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session },
      error: null,
    });

    const result = await authService.getSession();

    expect(result).toEqual(session);
  });

  it("subscribes to auth state changes", () => {
    const callback = jest.fn();
    const subscription = { data: { subscription: { unsubscribe: jest.fn() } } };
    mockSupabase.auth.onAuthStateChange.mockReturnValue(subscription);

    const result = authService.onAuthStateChange(callback);

    expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(result).toBe(subscription);
  });
});
