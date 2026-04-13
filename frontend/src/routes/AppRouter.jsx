import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { CreateOrderPage } from "../pages/CreateOrderPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HelpPage } from "../pages/HelpPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OrderDetailsPage } from "../pages/OrderDetailsPage";
import { OrderHistoryPage } from "../pages/OrderHistoryPage";
import { OrdersPage } from "../pages/OrdersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../pages/RegisterPage";
import { RiderDashboardPage } from "../pages/RiderDashboardPage";
import { VerifyPage } from "../pages/VerifyPage";
import { AdminRoute, CustomerRoute, ProtectedRoute, RiderRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />

          <Route element={<CustomerRoute />}>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/history" element={<OrderHistoryPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dashboard/orders" element={<AdminOrdersPage />} />
          </Route>

          <Route element={<RiderRoute />}>
            <Route path="rider" element={<RiderDashboardPage />} />
          </Route>

          <Route path="home" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
