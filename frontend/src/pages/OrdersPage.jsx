import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { clearOrderError, fetchOrders } from "../features/orders/ordersSlice";
import { formatReadableDate } from "../utils/formatters/date";
import onlineShoppingDeliveryIllustration from "../assets/images/online-shopping-delivery-illustration.jpg";

export function OrdersPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentOrders, orderHistory, status, error } = useSelector((state) => state.orders);
  const [activePane, setActivePane] = useState("explore");

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const totalOrders = useMemo(() => currentOrders.length + orderHistory.length, [currentOrders.length, orderHistory.length]);
  const deliveredCount = useMemo(
    () => orderHistory.filter((order) => order.status === "delivered").length,
    [orderHistory],
  );
  const cancelledCount = useMemo(
    () => orderHistory.filter((order) => order.status === "cancelled").length,
    [orderHistory],
  );
  const featuredCurrentOrder = currentOrders[0] || null;
  const latestHistoryOrder = orderHistory[0] || null;

  return (
    <section className="workspace-page orders-page">
      <header className="workspace-hero glass-card orders-hero">
        <figure className="orders-hero-banner" aria-hidden="true">
          <img src={onlineShoppingDeliveryIllustration} alt="" loading="eager" />
        </figure>

        <div className="orders-hero-body">
          <div className="orders-hero-copy">
            <p className="eyebrow">Customer Orders</p>
            <h1>Manage your orders</h1>
            <p className="workspace-copy">
              Track deliveries, manage orders, and review recent activity in one place.
            </p>
            {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
            {error ? <p className="form-status error">{error}</p> : null}

            <div className="orders-hero-actions">
              <button type="button" className="primary-btn" onClick={() => setActivePane("active")}>Create Parcel Order</button>
              <span className="mini-badge">{totalOrders} total</span>
            </div>
          </div>

          <div className="orders-hero-metrics" aria-label="Order summary metrics">
            <article className="orders-metric-card">
              <span>Active</span>
              <strong>{currentOrders.length}</strong>
            </article>
            <article className="orders-metric-card">
              <span>Delivered</span>
              <strong>{deliveredCount}</strong>
            </article>
            <article className="orders-metric-card">
              <span>Cancelled</span>
              <strong>{cancelledCount}</strong>
            </article>
          </div>
        </div>
      </header>

      <div className="orders-pane-switch" role="tablist" aria-label="Orders view navigation">
        <button type="button" className={`panel-toggle-btn ${activePane === "explore" ? "active" : ""}`} onClick={() => setActivePane("explore")}>Explore Orders</button>
        <button type="button" className={`panel-toggle-btn ${activePane === "active" ? "active" : ""}`} onClick={() => setActivePane("active")}>Current Order</button>
        <button type="button" className={`panel-toggle-btn ${activePane === "history" ? "active" : ""}`} onClick={() => setActivePane("history")}>History</button>
      </div>

      <div className="workspace-grid mobile-orders-grid single-pane-layout">
        {activePane === "explore" ? (
          <SectionCard className="orders-panel" title="Explore Orders" description="Open the detailed views you need.">
            <div className="topbar-actions">
              {featuredCurrentOrder ? <Link to={`/orders/${featuredCurrentOrder.id}`} className="secondary-btn explore-orders-btn">Open Latest Active Order</Link> : null}
              <button type="button" className="secondary-btn explore-orders-btn" onClick={() => setActivePane("active")}>Open Current Summary</button>
              <button type="button" className="secondary-btn explore-orders-btn" onClick={() => setActivePane("history")}>Open History Summary</button>
              <Link to="/orders/history" className="secondary-btn explore-orders-btn">Open Full History Page</Link>
            </div>
          </SectionCard>
        ) : null}

        {activePane === "active" ? (
          <SectionCard className="orders-panel" title="Current Order Summary" description="Top-level active order data.">
            {status === "loading" ? (
              <p className="helper-text">Loading active order summary...</p>
            ) : featuredCurrentOrder ? (
              <>
                <div className="detail-list">
                  <div><strong>Order ID:</strong> {featuredCurrentOrder.id}</div>
                  <div><strong>Parcel:</strong> {featuredCurrentOrder.parcelName}</div>
                  <div><strong>Status:</strong> <StatusBadge>{featuredCurrentOrder.status.replaceAll("_", " ")}</StatusBadge></div>
                  <div><strong>Route:</strong> {featuredCurrentOrder.pickupLocation} to {featuredCurrentOrder.destination}</div>
                  <div><strong>Quoted Price:</strong> KES {Number(featuredCurrentOrder.quotedPrice || 0).toFixed(2)}</div>
                  <div><strong>Updated:</strong> {formatReadableDate(featuredCurrentOrder.updatedAt)}</div>
                </div>
                <div className="topbar-actions">
                  <Link to={`/orders/${featuredCurrentOrder.id}`} className="primary-btn">View Full Order Details</Link>
                  <Link to="/orders/create" className="secondary-btn">Create Another Order</Link>
                </div>
              </>
            ) : (
              <EmptyState title="No active orders" description="Create a new order to start tracking delivery." action={<Link to="/orders/create" className="primary-btn">Create Order</Link>} />
            )}
          </SectionCard>
        ) : null}

        {activePane === "history" ? (
          <SectionCard className="orders-panel" title="History Summary" description="Top-level completed and cancelled activity.">
            <div className="route-stats-row">
              <div>
                <p className="card-label">Delivered</p>
                <h3>{deliveredCount}</h3>
              </div>
              <div>
                <p className="card-label">Cancelled</p>
                <h3>{cancelledCount}</h3>
              </div>
              <div>
                <p className="card-label">History Total</p>
                <h3>{orderHistory.length}</h3>
              </div>
            </div>
            <div className="topbar-actions">
              <Link to="/orders/history" className="primary-btn">Open Full History View</Link>
              {latestHistoryOrder ? <Link to={`/orders/${latestHistoryOrder.id}`} className="secondary-btn">Open Latest History Order</Link> : null}
            </div>
          </SectionCard>
        ) : null}
      </div>
    </section>
  );
}
