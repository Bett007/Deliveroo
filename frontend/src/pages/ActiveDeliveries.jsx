import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { fetchOrders } from "../features/orders/ordersSlice";

export function ActiveDeliveries() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const activeOrders = useMemo(() => {
    const nonTerminalOrders = currentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status));

    if (user?.role === "rider") {
      // Rider accept queue: show only unassigned deliveries ready to be picked.
      return nonTerminalOrders.filter((order) => !order.assignedRiderId);
    }

    return nonTerminalOrders;
  }, [currentOrders, user?.role]);

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

      <SectionCard title="Delivery Queue" description="Only unassigned, non-completed deliveries are shown here for rider pickup.">
        {status === "loading" ? (
          <p className="helper-text">Loading active deliveries from the backend...</p>
        ) : activeOrders.length ? (
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
                  <Link className="primary-btn" to="/rider/board">Manage in Work Board</Link>
                  <Link className="secondary-btn" to={`/orders/${order.id}`}>View Full Details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="helper-text">No unassigned deliveries are available right now.</p>
        )}
      </SectionCard>
    </section>
  );
}
