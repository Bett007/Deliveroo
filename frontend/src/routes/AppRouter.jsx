import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { CreateOrderPage } from "../pages/CreateOrderPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HelpPage } from "../pages/HelpPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OrderDetailsPage } from "../pages/OrderDetailsPage";
import { OrdersPage } from "../pages/OrdersPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyPage } from "../pages/VerifyPage";
import { AdminRoute, ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="home" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
