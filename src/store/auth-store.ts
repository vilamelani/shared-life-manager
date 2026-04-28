import { useSyncExternalStore } from "react";

import { authService } from "@/src/services/auth/auth-service";
import type { AuthSession, AuthUser } from "@/src/types/auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  session: AuthSession;
  user: AuthUser;
  status: AuthStatus;
  isSigningOut: boolean;
  signOutError: string | null;
};

const initialAuthState: AuthState = {
  session: null,
  user: null,
  status: "loading",
  isSigningOut: false,
  signOutError: null,
};

let currentState: AuthState = initialAuthState;
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setState = (nextState: Partial<AuthState>) => {
  currentState = {
    ...currentState,
    ...nextState,
  };
  emitChange();
};

const setSession = (session: AuthSession) => {
  setState({
    session,
    user: session?.user ?? null,
    status: session ? "authenticated" : "unauthenticated",
  });
};

const setStatus = (status: AuthStatus) => {
  setState({ status });
};

const clearSession = () => {
  setSession(null);
};

const clearSignOutError = () => {
  setState({ signOutError: null });
};

const logout = async () => {
  setState({ isSigningOut: true, signOutError: null });

  try {
    await authService.signOut();
  } catch (error) {
    setState({
      signOutError:
        error instanceof Error
          ? error.message
          : "Failed to sign out. Please try again.",
    });
  } finally {
    setState({ isSigningOut: false });
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getState = () => currentState;

const resetForTests = () => {
  currentState = initialAuthState;
  emitChange();
};

export const authStore = {
  subscribe,
  getState,
  setSession,
  setStatus,
  clearSession,
  clearSignOutError,
  logout,
  resetForTests,
};

export const useAuthStore = <T>(selector: (state: AuthState) => T): T => {
  return useSyncExternalStore(
    authStore.subscribe,
    () => selector(authStore.getState()),
    () => selector(initialAuthState),
  );
};
