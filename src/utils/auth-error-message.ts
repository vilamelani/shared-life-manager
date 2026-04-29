const authErrorMessageMap: Record<string, string> = {
  "failed to fetch":
    "Network error reaching Supabase. Check your internet or DNS and try again.",
  "network request failed":
    "Network error reaching Supabase. Check your internet or DNS and try again.",
  "invalid login credentials": "Invalid email or password.",
  "email not confirmed": "Please confirm your email before signing in.",
  "user already registered": "An account with this email already exists.",
  "password should be at least 6 characters":
    "Password must be at least 8 characters long.",
};

export const normalizeAuthErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const normalizedSource = error.message.toLowerCase();
  const mappedEntry = Object.entries(authErrorMessageMap).find(([key]) =>
    normalizedSource.includes(key),
  );

  if (mappedEntry) {
    return mappedEntry[1];
  }

  return error.message || fallback;
};
