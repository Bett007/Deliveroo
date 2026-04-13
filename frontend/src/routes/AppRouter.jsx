import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyPage } from "../pages/VerifyPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { HomePage } from "../pages/HomePage";

import { DashboardPage } from "../pages/DashboardPage";
import { OrdersPage } from "../pages/OrdersPage";
import { CreateOrderPage } from "../pages/CreateOrderPage";
import { OrderDetailsPage } from "../pages/OrderDetailsPage";
import { HelpPage } from "../pages/HelpPage";
import { OrderHistoryPage } from "../pages/OrderHistoryPage";
import { ProfilePage } from "../pages/ProfilePage";

// NEW
import { CustomerRoute } from "./CustomerRoute";
import { RiderRoute } from "./RiderRoute";
import { AdminRoute, ProtectedRoute } from "./ProtectedRoute";

// Rider Pages
import { RiderDashboard } from "../pages/RiderDashboard";
import { ActiveDeliveries } from "../pages/ActiveDeliveries";
import { DeliveryHistory } from "../pages/DeliveryHistory";
import { RouteMap } from "../pages/RouteMap";

// Admin Pages
import { AdminDashboard } from "../pages/AdminDashboard";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { SystemMonitoring } from "../pages/SystemMonitoring";
import { ActivityLog } from "../pages/ActivityLog";
import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { RiderDashboardPage } from "../pages/RiderDashboardPage";

export function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />

          {/* Customer */}
          <Route element={<CustomerRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/history" element={<OrderHistoryPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
          </Route>

          {/* Rider */}
          <Route element={<RiderRoute />}>
            <Route path="rider/dashboard" element={<RiderDashboard />} />
            <Route path="rider/board" element={<RiderDashboardPage />} />
            <Route path="deliveries/active" element={<ActiveDeliveries />} />
            <Route path="deliveries/history" element={<DeliveryHistory />} />
            <Route path="map" element={<RouteMap />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/orders" element={<AdminOrdersPage />} />
            <Route path="admin/analytics" element={<AnalyticsPage />} />
            <Route path="admin/monitoring" element={<SystemMonitoring />} />
            <Route path="admin/activity" element={<ActivityLog />} />
          </Route>

          {/* Shared authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
