type SupabaseLikeError = {
  message?: string;
  code?: string;
};

export const normalizeServiceErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as SupabaseLikeError;

    if (candidate.code === "PGRST205") {
      return "Household data tables are missing. Run the Supabase migrations in your project.";
    }

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message;
    }
  }

  return fallback;
};
