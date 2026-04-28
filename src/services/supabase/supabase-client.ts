import { createClient } from "@supabase/supabase-js";

import { env } from "@/src/utils/env";
import type { Database } from "@/src/types/supabase";

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
