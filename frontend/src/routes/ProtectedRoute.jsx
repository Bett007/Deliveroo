import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute() {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function CustomerRoute() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "customer") {
    return <Navigate to={user?.role === "admin" ? "/dashboard" : "/rider"} replace state={{ message: "Customer workspace only." }} />;
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
    return <Navigate to={user?.role === "rider" ? "/rider" : "/orders"} replace state={{ message: "Admin access only." }} />;
  }

  return <Outlet />;
}

export function RiderRoute() {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "rider") {
    return <Navigate to={user?.role === "admin" ? "/dashboard" : "/orders"} replace state={{ message: "Rider access only." }} />;
  }

  return <Outlet />;
}
