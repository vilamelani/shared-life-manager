import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { supabase } from "@/src/services/supabase";
import type {
  AuthSession,
  AuthStateChangeCallback,
  SignInParams,
  SignUpParams,
} from "@/src/types/auth";

const signInWithPassword = async ({ email, password }: SignInParams) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

const signUpWithPassword = async ({ email, password }: SignUpParams) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

const getSession = async (): Promise<AuthSession> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

const onAuthStateChange = (callback: AuthStateChangeCallback) => {
  return supabase.auth.onAuthStateChange(
    (event: AuthChangeEvent, session: Session | null) => callback(event, session),
  );
};

export const authService = {
  signInWithPassword,
  signUpWithPassword,
  signOut,
  getSession,
  onAuthStateChange,
};
