import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatReadableDate } from "../utils/formatters/date";

export function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory, status } = useSelector((state) => state.orders);

  const summaryCards = useMemo(() => {
    const totalOrders = currentOrders.length + orderHistory.length;
    const inTransit = currentOrders.filter((order) => order.status === "in_transit").length;

    return [
      { title: "Total Orders", value: totalOrders, sub: "All your tracked deliveries" },
      { title: "Active Orders", value: currentOrders.length, sub: "Pending, confirmed, and in transit" },
      { title: "Delivered / Cancelled", value: orderHistory.length, sub: "Completed order history records" },
      { title: "In Transit", value: inTransit, sub: "Deliveries currently moving" },
    ];
  }, [currentOrders, orderHistory]);

  return (
    <section className="dashboard-page">
      <header className="dashboard-topbar workspace-hero-split glass-card">
        <div className="workspace-hero-copy">
          <p className="eyebrow">Customer Dashboard</p>
          <h1>Welcome back, {user?.email || "Customer"}</h1>
          <p className="workspace-copy">
            Track active parcels, review delivery history, and jump quickly into creating your next order.
          </p>

          <div className="topbar-actions">
            <Link className="primary-btn" to="/orders/create">Create Order</Link>
            <Link className="secondary-btn" to="/orders">Open Orders</Link>
          </div>
        </div>

        <PlaceholderArtwork
          variant="customer"
          label="Customer Dashboard Preview"
          title="A reserved hero panel for customer parcel visuals"
          caption="This block can later carry branded campaign art without changing page structure."
        />
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="glass-card summary-card">
            <p className="card-label">{card.title}</p>
            <h3>{card.value}</h3>
            <span>{card.sub}</span>
          </div>
        ))}
      </section>

      <SectionCard title="Recent Active Orders" description="Latest active deliveries for this customer account.">
        {status === "loading" ? (
          <p className="helper-text">Loading orders...</p>
        ) : currentOrders.length ? (
          <div className="order-card-list">
            {currentOrders.slice(0, 5).map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <p className="card-label">Order #{order.id}</p>
                    <h3>{order.parcelName}</h3>
                  </div>
                  <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                </div>
                <p className="order-route">Pickup {order.pickupLocation} to {order.destination}</p>
                <div className="order-meta-row">
                  <span>KES {Number(order.quotedPrice || 0).toFixed(2)}</span>
                  <span>{formatReadableDate(order.updatedAt)}</span>
                </div>
                <div className="order-actions-row">
                  <Link to={`/orders/${order.id}`} className="secondary-btn">View Details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="helper-text">No active customer orders found yet.</p>
        )}
      </SectionCard>
    </section>
  );
}
