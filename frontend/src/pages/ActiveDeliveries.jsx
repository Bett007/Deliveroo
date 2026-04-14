import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";

function nextStatus(status) {
  if (status === "pending") return "confirmed";
  if (status === "confirmed") return "in_transit";
  if (status === "in_transit") return "delivered";
  return status;
}

export function ActiveDeliveries() {
  const { currentOrders } = useSelector((state) => state.orders);
  const [localStatuses, setLocalStatuses] = useState({});

  const activeOrders = useMemo(
    () =>
      currentOrders
        .map((order) => ({ ...order, status: localStatuses[order.id] || order.status }))
        .filter((order) => !["delivered", "cancelled"].includes(order.status)),
    [currentOrders, localStatuses],
  );

  function handleAction(order) {
    setLocalStatuses((current) => ({ ...current, [order.id]: nextStatus(order.status) }));
  }

  function actionLabel(status) {
    if (status === "pending") return "Accept Delivery";
    if (status === "confirmed") return "Start Delivery";
    if (status === "in_transit") return "Confirm Dropoff";
    return "Update";
  }

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Active Deliveries</p>
          <h1>Assigned rider delivery queue</h1>
          <p className="workspace-copy">
            Manage pending, confirmed, and in-transit orders from this single delivery action queue.
          </p>
        </div>
        <Link to="/rider/dashboard" className="secondary-btn">Back to Rider Dashboard</Link>
      </header>

      <SectionCard title="Delivery Queue" description="Only non-completed deliveries are shown here.">
        {activeOrders.length ? (
          <div className="order-card-list">
            {activeOrders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-top">
                  <div>
                    <p className="card-label">Order #{order.id}</p>
                    <h3>{order.parcelName}</h3>
                  </div>
                  <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                </div>
                <p className="order-route">Pickup: {order.pickupLocation}</p>
                <p className="order-route">Destination: {order.destination}</p>
                <p className="helper-text">Weight category: {order.weightCategory || "N/A"}</p>
                <p className="helper-text">Instructions: {order.description || "No instructions provided."}</p>

                <div className="topbar-actions">
                  <button type="button" className="primary-btn" onClick={() => handleAction(order)}>
                    {actionLabel(order.status)}
                  </button>
                  <Link className="secondary-btn" to={`/orders/${order.id}`}>View Full Details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="helper-text">No active deliveries are currently assigned.</p>
        )}
      </SectionCard>
    </section>
  );
}
