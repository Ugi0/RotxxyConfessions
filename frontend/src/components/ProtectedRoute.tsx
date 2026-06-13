import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../types/authContext";

interface Props {
  children: React.ReactNode;
  roles: ("streamer" | "moderator")[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles.includes(currentUser.role)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
}
