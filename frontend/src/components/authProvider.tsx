import React, { useEffect, useState } from "react";
import { AuthContext, type Props } from "../types/authContext";

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<"streamer" | "moderator" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setCurrentRole(null);
        return;
      }

      const data = await res.json();
      setCurrentRole(data.role);
    } catch (error) {
      console.error("Auth check failed", error);
      setCurrentRole(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await fetchSession();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        isLoading,
        refresh: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};