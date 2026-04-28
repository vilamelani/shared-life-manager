import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export type AuthSession = Session | null;

export type AuthUser = User | null;

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
};

export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;
