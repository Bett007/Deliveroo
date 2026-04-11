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
                  <article key={order.id} className="order-card current-order-card">
                    <div className="order-card-top">
                      <div className="order-summary-main">
                        <span className="order-icon" aria-hidden="true">P</span>
                        <div>
                          <p className="card-label">#{order.id}</p>
                          <h3>{order.parcelName}</h3>
                        </div>
                      </div>
                      <div className="order-status-stack">
                        <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                        <small>{order.assignedRider?.email || "Awaiting rider"}</small>
                      </div>
                    </div>

                    <div className="customer-card-route" aria-label={`Route for order ${order.id}`}>
                      <div className="customer-route-stop">
                        <span>P</span>
                        <strong title={order.pickupLocation}>{order.pickupLocation}</strong>
                      </div>
                      <i aria-hidden="true"></i>
                      <div className="customer-route-stop">
                        <span>D</span>
                        <strong title={order.destination}>{order.destination}</strong>
                      </div>
                    </div>

                    <div className="order-bottom-row">
                      <div className="order-price-block">
                        <small>Quote</small>
                        <strong>KES {Number(order.quotedPrice || 0).toFixed(2)}</strong>
                      </div>
                      <div className="order-price-block">
                        <small>Updated</small>
                        <strong>{formatReadableDate(order.updatedAt)}</strong>
                      </div>
                      <Link to={`/orders/${order.id}`} className="secondary-btn compact-order-btn">Details</Link>
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

              <section className="ops-insight-card latest-order-card">
                <div className="order-card-top">
                  <div>
                    <p className="card-label">Latest Order</p>
                    <h2>{featuredOrder.parcelName}</h2>
                  </div>
                  <StatusBadge>{featuredOrder.status.replaceAll("_", " ")}</StatusBadge>
                </div>
                <div className="route-chip-row compact">
                  <div className="route-chip">
                    <span>P</span>
                    <strong>{featuredOrder.pickupLocation}</strong>
                  </div>
                  <i aria-hidden="true"></i>
                  <div className="route-chip">
                    <span>D</span>
                    <strong>{featuredOrder.destination}</strong>
                  </div>
                </div>
                <div className="order-bottom-row">
                  <div className="order-price-block">
                    <small>Rider</small>
                    <strong>{featuredOrder.assignedRider?.email || "Not assigned"}</strong>
                  </div>
                  <Link to={`/orders/${featuredOrder.id}`} className="primary-btn compact-order-btn">Track</Link>
                </div>
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
