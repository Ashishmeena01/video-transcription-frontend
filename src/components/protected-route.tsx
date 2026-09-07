import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/states/user-state";

export function ProtectedRoute() {
  console.log("in the authenticated route")
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
