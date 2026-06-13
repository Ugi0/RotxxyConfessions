import React, { useEffect, useState } from "react";
import { AuthContext, type Props, type User } from "../types/authContext";

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setCurrentUser(null);
        return;
      }

      const data = await res.json() as User;

      console.log("Session valid, user data:", data);

      setCurrentUser(data);
    } catch (error) {
      console.error("Auth check failed", error);
      setCurrentUser(null);
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
        currentUser: currentUser,
        isLoading,
        refresh: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};