import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface RoleProtectedRouteProps {
  allowedRoles: Array<"CUSTOMER" | "SHOWROOM" | "ADMIN">;
  children?: React.ReactNode;
}

export default function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard
    if (user.role === "SHOWROOM") return <Navigate to="/dashboard/showroom" replace />;
    if (user.role === "ADMIN") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
