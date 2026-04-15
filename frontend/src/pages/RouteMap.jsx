import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";

export function RouteMap() {
  const { currentOrders } = useSelector((state) => state.orders);
  const activeOrders = useMemo(
    () => currentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)),
    [currentOrders],
  );

  const [selectedOrderId, setSelectedOrderId] = useState(activeOrders[0]?.id || null);
  const selectedOrder = activeOrders.find((order) => order.id === selectedOrderId) || activeOrders[0] || null;

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Route Map</p>
          <h1>Delivery route planning and tracking</h1>
          <p className="workspace-copy">
            Select any active order to center route information and track the pickup-to-destination path.
          </p>
        </div>
        <Link to="/rider/dashboard" className="secondary-btn">Back to Rider Dashboard</Link>
      </header>

      {selectedOrder ? (
        <div className="workspace-grid">
          <RouteMapCard
            origin={selectedOrder.pickupLocation}
            destination={selectedOrder.destination}
            originCoords={selectedOrder.pickupCoords}
            destinationCoords={selectedOrder.destinationCoords}
            distanceKm={selectedOrder.distanceKm}
            durationMinutes={selectedOrder.durationMinutes}
          />

          <SectionCard title="Active Orders" description="Select an order to focus its route map details.">
            <div className="order-card-list">
              {activeOrders.map((order) => (
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
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="No Active Routes" description="There are no active deliveries available for map tracking right now.">
          <p className="helper-text">Once deliveries are assigned and active, they will appear here.</p>
        </SectionCard>
      )}
    </section>
  );
}
