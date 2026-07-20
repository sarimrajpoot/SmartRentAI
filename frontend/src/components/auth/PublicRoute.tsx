import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {
    if (user.role === "SHOWROOM") return <Navigate to="/dashboard/showroom" replace />;
    if (user.role === "ADMIN") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
