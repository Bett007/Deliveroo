import { AdminRoute, CustomerRoute, ProtectedRoute, RiderRoute } from "./ProtectedRoute";
>>>>>>> dev
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
=======
import { AdminRoute, CustomerRoute, ProtectedRoute, RiderRoute } from "./ProtectedRoute";
>>>>>>> dev
=======
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
=======
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
>>>>>>> dev
import { RegisterPage } from "../pages/RegisterPage";
import { RiderDashboardPage } from "../pages/RiderDashboardPage";
import { VerifyPage } from "../pages/VerifyPage";
<<<<<<< HEAD
import { NotFoundPage } from "../pages/NotFoundPage";

import { DashboardPage } from "../pages/DashboardPage";
import { OrdersPage } from "../pages/OrdersPage";
import { CreateOrderPage } from "../pages/CreateOrderPage";
import { OrderDetailsPage } from "../pages/OrderDetailsPage";
import { HelpPage } from "../pages/HelpPage";

// NEW
import { CustomerRoute } from "./CustomerRoute";
import { RiderRoute } from "./RiderRoute";
import { AdminRoute, ProtectedRoute } from "./ProtectedRoute";
=======
import { AdminRoute, CustomerRoute, ProtectedRoute, RiderRoute } from "./ProtectedRoute";
>>>>>>> dev

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

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public */}
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />

<<<<<<< HEAD
          <Route element={<CustomerRoute />}>

=======
  <Route element={<CustomerRoute />}>
>>>>>>> dev
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/history" element={<OrderHistoryPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          </Route>

<<<<<<< HEAD
          {/* Rider */}
          <Route element={<RiderRoute />}>
            <Route path="rider/dashboard" element={<RiderDashboard />} />
            <Route path="deliveries/active" element={<ActiveDeliveries />} />
            <Route path="deliveries/history" element={<DeliveryHistory />} />
            <Route path="map" element={<RouteMap />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/analytics" element={<AnalyticsPage />} />
            <Route path="admin/monitoring" element={<SystemMonitoring />} />
            <Route path="admin/activity" element={<ActivityLog />} />
          </Route>

          {/* Shared authenticated */}
=======
>>>>>>> dev
          <Route element={<ProtectedRoute />}>
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

<<<<<<< HEAD
          {/* 404 */}
=======
          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dashboard/orders" element={<AdminOrdersPage />} />
          </Route>

          <Route element={<RiderRoute />}>
            <Route path="rider" element={<RiderDashboardPage />} />
          </Route>

          <Route path="home" element={<Navigate to="/login" replace />} />
>>>>>>> dev
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
=======
          <Route element={<CustomerRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
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

=======
          <Route element={<CustomerRoute />}>
>>>>>>> dev
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/history" element={<OrderHistoryPage />} />
            <Route path="orders/create" element={<CreateOrderPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
          </Route>

<<<<<<< HEAD
          {/* Rider */}
          <Route element={<RiderRoute />}>
            <Route path="rider/dashboard" element={<RiderDashboard />} />
            <Route path="deliveries/active" element={<ActiveDeliveries />} />
            <Route path="deliveries/history" element={<DeliveryHistory />} />
            <Route path="map" element={<RouteMap />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/analytics" element={<AnalyticsPage />} />
            <Route path="admin/monitoring" element={<SystemMonitoring />} />
            <Route path="admin/activity" element={<ActivityLog />} />
          </Route>

          {/* Shared authenticated */}
=======
>>>>>>> dev
          <Route element={<ProtectedRoute />}>
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

<<<<<<< HEAD
          {/* 404 */}
=======
          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dashboard/orders" element={<AdminOrdersPage />} />
          </Route>

          <Route element={<RiderRoute />}>
            <Route path="rider" element={<RiderDashboardPage />} />
          </Route>

          <Route path="home" element={<Navigate to="/login" replace />} />
>>>>>>> dev
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
