import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { NotificationBell } from "../components/ui/NotificationBell";
import { AppIcon } from "../components/ui/AppIcon";

export function RiderDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);
  const dashboardName = user?.first_name?.trim() || user?.email?.split("@")[0] || "Rider";
  const avatarUrl = user?.avatar_url;

  const riderCurrentOrders = useMemo(
    () => currentOrders.filter((order) => Number(order.assignedRiderId) === Number(user?.id)),
    [currentOrders, user?.id],
  );
  const riderHistoryOrders = useMemo(
    () => orderHistory.filter((order) => Number(order.assignedRiderId) === Number(user?.id)),
    [orderHistory, user?.id],
  );

  const riderActiveOrders = useMemo(
    () => riderCurrentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)),
    [riderCurrentOrders],
  );
  const inTransit = useMemo(
    () => riderActiveOrders.filter((order) => order.status === "in_transit").length,
    [riderActiveOrders],
  );
  const completedToday = useMemo(
    () => riderHistoryOrders.filter((order) => order.status === "delivered").length,
    [riderHistoryOrders],
  );
  const featuredOrder = riderActiveOrders[0] || riderHistoryOrders[0];
  const activeDeliveriesSummary = riderActiveOrders.length > 0
    ? "Orders waiting pickup, transit, or dropoff updates"
    : "No active deliveries yet";
  const inTransitSummary = inTransit > 0
    ? "Deliveries currently on route"
    : "No deliveries currently on route";
  const completedSummary = completedToday > 0
    ? "Completed deliveries in available history"
    : "No completed deliveries yet";
  const riderModules = [
    {
      title: "Work Board",
      description: "Accept and manage assigned deliveries",
      path: "/rider/board",
      badge: "Board",
    },
    {
      title: "Active Deliveries",
      description: `${riderActiveOrders.length} live jobs`,
      path: "/deliveries/active",
      badge: "Live",
    },
    {
      title: "Route Map",
      description: "Open full map tracking",
      path: "/map",
      badge: "Map",
    },
    {
      title: "Delivery History",
      description: `${riderHistoryOrders.length} finished deliveries`,
      path: "/deliveries/history",
      badge: "Past",
    },
  ];

  return (
    <section className="dashboard-page ops-page">
      <header className="ops-topbar">
        <div>
          <h1 className="dashboard-greeting">Welcome back, {dashboardName}</h1>
          <p className="workspace-copy">Manage assigned deliveries and keep each route moving.</p>
        </div>
        <div className="topbar-actions dashboard-user-meta">
          <NotificationBell label="Dispatch alerts" />
          <div className="dashboard-account-card">
            <span className="dashboard-avatar" aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt={`${dashboardName} avatar`} /> : dashboardName?.[0]?.toUpperCase() || "R"}
            </span>
            <span className="dashboard-account-copy">
              <strong>{dashboardName}</strong>
              <small>{user?.email || "rider@deliveroo.app"}</small>
            </span>
          </div>
        </div>
      </header>

      <section className="summary-grid ops-summary-grid">
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="rider" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">Active Deliveries</p>
            <h3>{riderActiveOrders.length}</h3>
            <span>{activeDeliveriesSummary}</span>
          </div>
        </div>
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="route" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">In Transit</p>
            <h3>{inTransit}</h3>
            <span>{inTransitSummary}</span>
          </div>
        </div>
        <div className="glass-card summary-card">
          <span className="summary-icon" aria-hidden="true"><AppIcon name="check" size={22} /></span>
          <div className="summary-copy">
            <p className="card-label">Completed Deliveries</p>
            <h3>{completedToday}</h3>
            <span>{completedSummary}</span>
          </div>
        </div>
      </section>

      <section className="dashboard-module-grid" aria-label="Rider modules">
        {riderModules.map((module) => (
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
        <SectionCard title="Recent Assignments" description="Most recent rider assignments across active delivery jobs.">
          {riderActiveOrders.length ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Pickup</th>
                    <th>Dropoff</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riderActiveOrders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.pickupLocation}</td>
                      <td>{order.destination}</td>
                      <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                      <td><Link className="inline-link" to={`/orders/${order.id}`}>Open</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="helper-text">No rider assignments are available yet.</p>
          )}

          <div className="topbar-actions">
            <Link to="/deliveries/active" className="primary-btn">Active Deliveries</Link>
            <Link to="/deliveries/history" className="secondary-btn">Delivery History</Link>
            <Link to="/map" className="secondary-btn">Route Map</Link>
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
              status={featuredOrder.status}
            />
          ) : (
            <section className="ops-insight-card">
              <h2>Deliveries Map</h2>
              <p className="helper-text">Rider routes appear here when assignments are available.</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
