import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function RiderRoute() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "rider") {
    if (user?.role === "customer") {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
