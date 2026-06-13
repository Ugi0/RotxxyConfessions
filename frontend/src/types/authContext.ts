import { createContext } from "react";

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  refresh: async () => {},
});

export interface Props {
  children: React.ReactNode;
}

export type User = {
  username: string;
  role: "moderator" | "streamer";
  profileImageUrl: string;
};