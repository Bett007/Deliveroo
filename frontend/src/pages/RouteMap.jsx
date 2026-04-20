import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { fetchOrders } from "../features/orders/ordersSlice";

export function RouteMap() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentOrders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const riderActiveOrders = useMemo(
    () =>
      currentOrders.filter(
        (order) =>
          Number(order.assignedRiderId) === Number(user?.id)
          && !["delivered", "cancelled"].includes(order.status),
      ),
    [currentOrders, user?.id],
  );

  const [selectedOrderId, setSelectedOrderId] = useState(riderActiveOrders[0]?.id || null);

  useEffect(() => {
    if (!riderActiveOrders.length) {
      setSelectedOrderId(null);
      return;
    }

    const exists = riderActiveOrders.some((order) => String(order.id) === String(selectedOrderId));
    if (!exists) {
      setSelectedOrderId(riderActiveOrders[0].id);
    }
  }, [riderActiveOrders, selectedOrderId]);

  const selectedOrder =
    riderActiveOrders.find((order) => String(order.id) === String(selectedOrderId))
    || riderActiveOrders[0]
    || null;

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Route Map</p>
          <h1>Live routes for your assigned deliveries</h1>
          <p className="workspace-copy">
            Focus one active delivery at a time and track pickup-to-dropoff progress clearly.
          </p>
        </div>
        <Link to="/rider/board" className="secondary-btn">Back to Work Board</Link>
      </header>

      {selectedOrder ? (
        <div className="workspace-grid">
          <RouteMapCard
            origin={selectedOrder.currentLocation || selectedOrder.pickupLocation}
            destination={selectedOrder.destination}
            originCoords={selectedOrder.pickupCoords}
            destinationCoords={selectedOrder.destinationCoords}
            distanceKm={selectedOrder.distanceKm}
            durationMinutes={selectedOrder.durationMinutes}
            status={selectedOrder.status}
          />

          <SectionCard title="My Active Routes" description="Select a delivery to focus its route map details.">
            <div className="order-card-list">
              {riderActiveOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <h3>#{order.id}</h3>
                    <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  <p className="order-route">{order.pickupLocation} to {order.destination}</p>
                  <div className="order-meta-row">
                    <span>{order.distanceKm || 0} km</span>
                    <span>{order.durationMinutes || 0} min</span>
                  </div>
                  <div className="order-actions-row">
                    <button type="button" className="secondary-btn" onClick={() => setSelectedOrderId(order.id)}>
                      Focus Route
                    </button>
                    <Link to={`/orders/${order.id}`} className="inline-link">
                      Open Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="No Active Routes" description="You do not have active assigned deliveries at the moment.">
          <p className="helper-text">Accept a delivery from Work Board to start live route tracking.</p>
          <div className="topbar-actions">
            <Link to="/rider/board" className="primary-btn">Open Work Board</Link>
          </div>
        </SectionCard>
      )}
    </section>
  );
}
