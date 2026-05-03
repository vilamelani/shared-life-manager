import { normalizeServiceErrorMessage } from "@/src/utils/service-error";

describe("normalizeServiceErrorMessage", () => {
  it("maps missing relation code to migration guidance", () => {
    const result = normalizeServiceErrorMessage(
      { code: "PGRST205", message: "missing relation" },
      "fallback",
    );

    expect(result).toBe(
      "Household data tables are missing. Run the Supabase migrations in your project.",
    );
  });

  it("returns object message when available", () => {
    const result = normalizeServiceErrorMessage(
      { message: "Row level security violation" },
      "fallback",
    );

    expect(result).toBe("Row level security violation");
  });
});
