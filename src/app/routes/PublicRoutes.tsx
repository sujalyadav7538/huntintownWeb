import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

export default function PublicRoutes({
  isAuthenticated,
  children,
}: PublicRouteProps) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;

}
