import { useSyncExternalStore } from "react";

import { authService } from "@/src/services/auth/auth-service";
import { householdService } from "@/src/services/household/household-service";
import type { AuthSession, AuthUser } from "@/src/types/auth";
import type { Household } from "@/src/types/household";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  session: AuthSession;
  user: AuthUser;
  status: AuthStatus;
  households: Household[];
  activeHouseholdId: string | null;
  isLoadingHouseholds: boolean;
  householdsError: string | null;
  isSigningOut: boolean;
  signOutError: string | null;
};

const initialAuthState: AuthState = {
  session: null,
  user: null,
  status: "loading",
  households: [],
  activeHouseholdId: null,
  isLoadingHouseholds: false,
  householdsError: null,
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
    households: session ? currentState.households : [],
    activeHouseholdId: session ? currentState.activeHouseholdId : null,
  });
};

const setStatus = (status: AuthStatus) => {
  setState({ status });
};

const clearSession = () => {
  setState({
    session: null,
    user: null,
    status: "unauthenticated",
    households: [],
    activeHouseholdId: null,
    isLoadingHouseholds: false,
    householdsError: null,
  });
};

const setHouseholds = (households: Household[]) => {
  const activeHouseholdId =
    currentState.activeHouseholdId &&
    households.some((household) => household.id === currentState.activeHouseholdId)
      ? currentState.activeHouseholdId
      : households[0]?.id ?? null;

  setState({
    households,
    activeHouseholdId,
    householdsError: null,
  });
};

const setActiveHousehold = (householdId: string) => {
  if (!currentState.households.some((household) => household.id === householdId)) {
    return;
  }

  setState({ activeHouseholdId: householdId });
};

const addOrReplaceHousehold = (household: Household) => {
  const nextHouseholds = currentState.households.some(
    (currentHousehold) => currentHousehold.id === household.id,
  )
    ? currentState.households.map((currentHousehold) =>
        currentHousehold.id === household.id ? household : currentHousehold,
      )
    : [household, ...currentState.households];

  setState({
    households: nextHouseholds,
    activeHouseholdId: household.id,
    householdsError: null,
  });
};

const loadHouseholds = async () => {
  if (!currentState.user?.id) {
    setState({
      households: [],
      activeHouseholdId: null,
      isLoadingHouseholds: false,
      householdsError: null,
    });
    return;
  }

  setState({ isLoadingHouseholds: true, householdsError: null });

  try {
    const households = await householdService.listUserHouseholds(currentState.user.id);
    setHouseholds(households);
  } catch (error) {
    setState({
      householdsError:
        error instanceof Error
          ? error.message
          : "Unable to load households. Please try again.",
    });
  } finally {
    setState({ isLoadingHouseholds: false });
  }
};

const clearSignOutError = () => {
  setState({ signOutError: null });
};

const logout = async () => {
  setState({ isSigningOut: true, signOutError: null });

  try {
    await authService.signOut();
    clearSession();
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
  setHouseholds,
  setActiveHousehold,
  addOrReplaceHousehold,
  loadHouseholds,
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
