const getRequiredEnvValue = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        "Make sure it is defined in your .env file.",
    );
  }

  return value;
};

export const env = {
  supabaseUrl: getRequiredEnvValue(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    "EXPO_PUBLIC_SUPABASE_URL",
  ),
  supabaseAnonKey: getRequiredEnvValue(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  ),
};
