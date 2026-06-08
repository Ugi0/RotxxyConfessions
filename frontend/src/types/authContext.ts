import { createContext } from "react";

export interface AuthContextType {
  currentRole: "streamer" | "moderator" | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentRole: null,
  isLoading: true,
  refresh: async () => {},
});

export interface Props {
  children: React.ReactNode;
}