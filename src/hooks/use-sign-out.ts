import { useState } from "react";

import { authService } from "@/src/services/auth/auth-service";

export const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signOut = async () => {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      await authService.signOut();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to sign out. Please try again.");
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    signOut,
    isSigningOut,
    errorMessage,
  };
};
