import { normalizeAuthErrorMessage } from "@/src/utils/auth-error-message";

describe("normalizeAuthErrorMessage", () => {
  it("maps known supabase login error", () => {
    const result = normalizeAuthErrorMessage(
      new Error("Invalid login credentials"),
      "Fallback",
    );

    expect(result).toBe("Invalid email or password.");
  });

  it("maps network fetch failures to actionable message", () => {
    const result = normalizeAuthErrorMessage(
      new Error("Failed to fetch"),
      "Fallback",
    );

    expect(result).toBe(
      "Network error reaching Supabase. Check your internet or DNS and try again.",
    );
  });

  it("returns fallback when error is unknown object", () => {
    const result = normalizeAuthErrorMessage(
      { message: "something else" },
      "Fallback message",
    );

    expect(result).toBe("Fallback message");
  });

  it("returns original error message when not mapped", () => {
    const result = normalizeAuthErrorMessage(
      new Error("Temporary auth service outage"),
      "Fallback",
    );

    expect(result).toBe("Temporary auth service outage");
  });
});
