import { useEffect, useMemo, useState } from "react";

import { authService } from "@/src/services/auth/auth-service";
import type { AuthSession } from "@/src/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type UseAuthSessionResult = {
  session: AuthSession;
  status: AuthStatus;
  isAuthenticated: boolean;
};

export const useAuthSession = (): UseAuthSessionResult => {
  const [session, setSession] = useState<AuthSession>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let isActive = true;

    authService
      .getSession()
      .then((nextSession) => {
        if (!isActive) {
          return;
        }

        setSession(nextSession);
        setStatus(nextSession ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setSession(null);
        setStatus("unauthenticated");
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return;
      }

      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "unauthenticated");
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  return useMemo(
    () => ({
      session,
      status,
      isAuthenticated: status === "authenticated",
    }),
    [session, status],
  );
};
