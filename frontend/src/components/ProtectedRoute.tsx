import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../types/authContext";

interface Props {
  children: React.ReactNode;
  roles: ("streamer" | "moderator")[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { currentRole, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (roles.includes(currentRole)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
}
