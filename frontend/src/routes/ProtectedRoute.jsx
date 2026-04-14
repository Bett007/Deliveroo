import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute() {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "admin") {
    if (user?.role === "customer") {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.role === "rider") {
      return <Navigate to="/deliveries/active" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}