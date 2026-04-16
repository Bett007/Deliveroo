import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { NotificationBell } from "../components/ui/NotificationBell";
import { AppIcon } from "../components/ui/AppIcon";

export function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);
  const dashboardName = user?.first_name?.trim() || user?.email?.split("@")[0] || "Admin";
  const avatarUrl = user?.avatar_url;
  const allOrders = useMemo(() => [...currentOrders, ...orderHistory], [currentOrders, orderHistory]);

  const totalOrders = allOrders.length;
  const activeOrders = allOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const delivered = allOrders.filter((order) => order.status === "delivered").length;
  const estimatedRevenue = allOrders.reduce((sum, order) => sum + Number(order.quotedPrice || 0), 0);
  const avgDuration = allOrders.length
    ? Math.round(allOrders.reduce((sum, order) => sum + Number(order.durationMinutes || 0), 0) / allOrders.length)
    : 0;
  const featuredOrder = currentOrders[0] || orderHistory[0];
  const adminModules = [
    {
      title: "Manage Orders",
      description: "Dispatch queue and order controls",
      path: "/admin/orders",
      badge: "Queue",
    },
    {
      title: "Analytics",
      description: "Order mix and revenue metrics",
      path: "/admin/analytics",
      badge: "Data",
    },
    {
      title: "Monitoring",
      description: "System visibility and checks",
      path: "/admin/monitoring",
      badge: "Ops",
    },
    {
      title: "Activity Log",
      description: "Track admin actions",
      path: "/admin/activity",
      badge: "Logs",
    },
  ];

  return (
    <section className="dashboard-page ops-page">
      <header className="ops-topbar">
        <div>
          <h1 className="dashboard-greeting">Welcome back, {dashboardName}</h1>
          <p className="workspace-copy">Monitor operations, deliveries, and platform activity.</p>
        </div>
        <div className="topbar-actions dashboard-user-meta">
          <NotificationBell label="Platform alerts" minimumCount={Math.max(1, activeOrders)} />
          <div className="dashboard-account-card">
            <span className="dashboard-avatar" aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt={`${dashboardName} avatar`} /> : dashboardName?.[0]?.toUpperCase() || "A"}
            </span>
            <span className="dashboard-account-copy">
              <strong>{dashboardName}</strong>
              <small>{user?.email || "admin@deliveroo.app"}</small>
            </span>
          </div>
        </div>
      </header>

      <section className="summary-grid ops-summary-grid">
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="package" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">Total Orders</p>
            <h3>{totalOrders}</h3>
            <span>Platform-wide order volume snapshot</span>
          </div>
        </div>
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="route" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">Active Deliveries</p>
            <h3>{activeOrders}</h3>
            <span>Pending, confirmed, and in-transit deliveries</span>
          </div>
        </div>
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="wallet" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">Revenue Estimate</p>
            <h3>KES {estimatedRevenue.toFixed(2)}</h3>
            <span>{delivered} delivered in available records</span>
          </div>
        </div>
      </section>

      <section className="dashboard-module-grid" aria-label="Admin modules">
        {adminModules.map((module) => (
          <Link key={module.path} to={module.path} className="dashboard-module-card">
            <div className="dashboard-module-head">
              <span className="dashboard-module-badge">{module.badge}</span>
              <span className="dashboard-module-arrow" aria-hidden="true">↗</span>
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </section>

      <div className="ops-dashboard-grid">
        <SectionCard title="Recent Orders" description={`Average completion time: ${avgDuration} minutes`}>
          {allOrders.length ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Route</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.slice(0, 10).map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.userEmail || `Customer #${order.id}`}</td>
                      <td>{order.pickupLocation} to {order.destination}</td>
                      <td>KES {Number(order.quotedPrice || 0).toFixed(2)}</td>
                      <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="helper-text">No order data available yet for admin metrics.</p>
          )}

          <div className="topbar-actions">
            <Link className="primary-btn" to="/admin/analytics">Analytics</Link>
            <Link className="secondary-btn" to="/admin/monitoring">Monitoring</Link>
            <Link className="secondary-btn" to="/admin/activity">Activity</Link>
          </div>
        </SectionCard>

        <aside className="ops-side-stack">
          {featuredOrder ? (
            <RouteMapCard
              origin={featuredOrder.pickupLocation}
              destination={featuredOrder.destination}
              originCoords={featuredOrder.pickupCoords}
              destinationCoords={featuredOrder.destinationCoords}
              distanceKm={featuredOrder.distanceKm}
              durationMinutes={featuredOrder.durationMinutes}
            />
          ) : (
            <section className="ops-insight-card">
              <h2>Deliveries Map</h2>
              <p className="helper-text">Dispatch map appears when order data is available.</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
