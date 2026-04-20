import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function CustomerRoute() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "customer") {
    if (user?.role === "rider") {
      return <Navigate to="/rider/board" replace />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
