import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState } from "../components/ui/EmptyState";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { clearOrderError, fetchOrders } from "../features/orders/ordersSlice";
import { formatReadableDate } from "../utils/formatters/date";

export function OrdersPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentOrders, orderHistory, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const totalOrders = useMemo(() => currentOrders.length + orderHistory.length, [currentOrders.length, orderHistory.length]);
  const featuredOrder = currentOrders[0] || orderHistory[0];
  const inTransitCount = useMemo(() => currentOrders.filter((order) => order.status === "in_transit").length, [currentOrders]);

  return (
    <section className="workspace-page ops-page">
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Customer Orders</p>
          <h1>Orders and tracking</h1>
          <p className="workspace-copy">Track live routes, reorder quickly, and review past deliveries.</p>
          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <div className="topbar-actions">
          <div className="rider-stats-strip customer-stats-strip" aria-label="Customer order summary">
            <span><strong>{currentOrders.length}</strong> active</span>
            <span><strong>{inTransitCount}</strong> moving</span>
            <span><strong>{totalOrders}</strong> total</span>
          </div>
          <Link to="/orders/history" className="secondary-btn">History</Link>
          <Link to="/orders/create" className="primary-btn">
            New Order
          </Link>
        </div>
      </header>

      <div className="customer-workspace-grid">
        <div className="customer-order-column">
          <SectionCard title="Current Orders" description="Live deliveries that still need attention.">
            {status === "loading" ? (
              <p className="helper-text">Loading current orders from the backend...</p>
            ) : currentOrders.length ? (
              <div className="order-card-list">
                {currentOrders.map((order) => (
                  <article key={order.id} className="order-card">
                    <div className="order-card-top">
                      <span className="order-icon" aria-hidden="true">P</span>
                      <div>
                        <p className="card-label">Order #{order.id}</p>
                        <h3>{order.parcelName}</h3>
                      </div>
                      <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                    </div>
                    <div className="mini-route">
                      <span>{order.pickupLocation}</span>
                      <i aria-hidden="true"></i>
                      <span>{order.destination}</span>
                    </div>
                    <div className="order-meta-row">
                      <span>KES {Number(order.quotedPrice || 0).toFixed(2)}</span>
                      <span>{order.assignedRider?.email || "Awaiting rider"}</span>
                      <span>{formatReadableDate(order.updatedAt)}</span>
                    </div>
                    <div className="order-actions-row">
                      <Link to={`/orders/${order.id}`} className="secondary-btn">View Details</Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No active orders"
                description="Create your first parcel order to start tracking deliveries here."
                action={<Link to="/orders/create" className="primary-btn">Create Order</Link>}
              />
            )}
          </SectionCard>
        </div>

        <aside className="customer-side-stack">
          {featuredOrder ? (
            <>
              <RouteMapCard
                origin={featuredOrder.pickupLocation}
                destination={featuredOrder.destination}
                distanceKm={featuredOrder.distanceKm}
                durationMinutes={featuredOrder.durationMinutes}
              />

              <section className="ops-insight-card">
                <p className="card-label">Latest Order</p>
                <h2>{featuredOrder.parcelName}</h2>
                <div className="delivery-ownership mine">
                  <span aria-hidden="true">S</span>
                  <strong>{featuredOrder.status.replaceAll("_", " ")}</strong>
                </div>
                <div className="detail-list">
                  <div><strong>Pickup:</strong> {featuredOrder.pickupLocation}</div>
                  <div><strong>Drop-off:</strong> {featuredOrder.destination}</div>
                  <div><strong>Rider:</strong> {featuredOrder.assignedRider?.email || "Not assigned"}</div>
                </div>
                <Link to={`/orders/${featuredOrder.id}`} className="primary-btn full-width">Open Tracking</Link>
                <Link to="/orders/history" className="secondary-btn full-width">Past Deliveries</Link>
              </section>
            </>
          ) : (
            <section className="ops-insight-card">
              <p className="card-label">Tracking</p>
              <h2>No routes yet</h2>
              <p className="helper-text">Your newest route map appears here after you create an order.</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
