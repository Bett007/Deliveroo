import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";

export function RiderDashboard() {
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);

  const riderActiveOrders = currentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const inTransit = riderActiveOrders.filter((order) => order.status === "in_transit").length;
  const completedToday = orderHistory.slice(0, 8).filter((order) => order.status === "delivered").length;
  const avgDuration = riderActiveOrders.length
    ? Math.round(riderActiveOrders.reduce((sum, order) => sum + Number(order.durationMinutes || 0), 0) / riderActiveOrders.length)
    : 0;

  return (
    <section className="dashboard-page">
      <header className="dashboard-topbar workspace-hero-split glass-card">
        <div className="workspace-hero-copy">
          <p className="eyebrow">Rider Dashboard</p>
          <h1>Live rider workspace</h1>
          <p className="workspace-copy">
            Track active deliveries, complete assigned jobs, and move quickly across all route tasks from one workspace.
          </p>
          <div className="topbar-actions">
            <Link to="/deliveries/active" className="primary-btn">Open Active Deliveries</Link>
            <Link to="/map" className="secondary-btn">Open Route Map</Link>
          </div>
        </div>
        <PlaceholderArtwork
          variant="customer"
          label="Rider Preview"
          title="A reserved panel for rider photography and route visuals"
          caption="Swap this area with rider-focused branded assets without changing page structure."
        />
      </header>

      <section className="summary-grid">
        <div className="glass-card summary-card">
          <p className="card-label">Active Deliveries</p>
          <h3>{riderActiveOrders.length}</h3>
          <span>Orders waiting pickup, transit, or dropoff updates</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">In Transit</p>
          <h3>{inTransit}</h3>
          <span>Deliveries currently on route</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">Completed Today</p>
          <h3>{completedToday}</h3>
          <span>Delivered jobs from recent records</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">Average ETA</p>
          <h3>{avgDuration} min</h3>
          <span>Average time across active deliveries</span>
        </div>
      </section>

      <SectionCard title="Recent Assignments" description="Most recent rider assignments across active delivery jobs.">
        {riderActiveOrders.length ? (
          <div className="order-card-list">
            {riderActiveOrders.slice(0, 6).map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <p className="card-label">Order #{order.id}</p>
                    <h3>{order.parcelName}</h3>
                  </div>
                  <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                </div>
                <p className="order-route">{order.pickupLocation} to {order.destination}</p>
                <div className="order-actions-row">
                  <Link className="secondary-btn" to={`/orders/${order.id}`}>View Details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="helper-text">No rider assignments are available yet.</p>
        )}
      </SectionCard>
    </section>
  );
}
