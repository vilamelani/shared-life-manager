import { useEffect } from "react";

import { authService } from "@/src/services/auth/auth-service";
import { authStore, useAuthStore } from "@/src/store/auth-store";

type UseAuthSessionResult = {
  session: ReturnType<typeof authStore.getState>["session"];
  status: ReturnType<typeof authStore.getState>["status"];
  isAuthenticated: boolean;
};

export const useAuthSession = (): UseAuthSessionResult => {
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    let isActive = true;

    authService
      .getSession()
      .then((nextSession) => {
        if (!isActive) {
          return;
        }

        authStore.setSession(nextSession);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        authStore.clearSession();
        authStore.setStatus("unauthenticated");
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, nextSession) => {
      if (!isActive) {
        return;
      }

      authStore.setSession(nextSession);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
  };
};
