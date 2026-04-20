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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activePane, setActivePane] = useState("overview");

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const totalOrders = useMemo(() => currentOrders.length + orderHistory.length, [currentOrders.length, orderHistory.length]);
  const allOrders = useMemo(() => [...currentOrders, ...orderHistory], [currentOrders, orderHistory]);
  const deliveredCount = useMemo(
    () => allOrders.filter((order) => order.status === "delivered").length,
    [allOrders],
  );
  const cancelledCount = useMemo(
    () => allOrders.filter((order) => order.status === "cancelled").length,
    [allOrders],
  );

  const filteredAndSortedOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery = (order) =>
      !query ||
      String(order.id).toLowerCase().includes(query) ||
      String(order.parcelName).toLowerCase().includes(query) ||
      String(order.pickupLocation).toLowerCase().includes(query) ||
      String(order.destination).toLowerCase().includes(query);

    const matchesFilter = (order) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return !["delivered", "cancelled"].includes(order.status);
      return order.status === statusFilter;
    };

    const sorted = [...allOrders].sort((left, right) => {
      if (sortBy === "oldest") {
        return new Date(left.updatedAt || left.createdAt || 0).getTime() - new Date(right.updatedAt || right.createdAt || 0).getTime();
      }

      if (sortBy === "status") {
        return String(left.status).localeCompare(String(right.status));
      }

      return new Date(right.updatedAt || right.createdAt || 0).getTime() - new Date(left.updatedAt || left.createdAt || 0).getTime();
    });

    return sorted.filter((order) => matchesQuery(order) && matchesFilter(order));
  }, [allOrders, searchTerm, statusFilter, sortBy]);

  const filteredCurrentOrders = useMemo(
    () => filteredAndSortedOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)),
    [filteredAndSortedOrders],
  );
  const filteredOrderHistory = useMemo(
    () => filteredAndSortedOrders.filter((order) => ["delivered", "cancelled"].includes(order.status)),
    [filteredAndSortedOrders],
  );

  return (
    <section className="workspace-page orders-page">
      <section className="workspace-panel panel-toggle-bar">
        <div className="panel-toggle-actions" role="tablist" aria-label="Orders view navigation">
          <button type="button" className={`panel-toggle-btn ${activePane === "overview" ? "active" : ""}`} onClick={() => setActivePane("overview")}>Overview</button>
          <button type="button" className={`panel-toggle-btn ${activePane === "search" ? "active" : ""}`} onClick={() => setActivePane("search")}>Search</button>
          <button type="button" className={`panel-toggle-btn ${activePane === "active" ? "active" : ""}`} onClick={() => setActivePane("active")}>Current</button>
          <button type="button" className={`panel-toggle-btn ${activePane === "history" ? "active" : ""}`} onClick={() => setActivePane("history")}>History</button>
        </div>
      </section>

      {activePane === "overview" ? (
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
              <Link to="/orders/create" className="primary-btn">
                Create Parcel Order
              </Link>
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
      ) : null}

      {activePane === "search" ? (
      <SectionCard
        className="orders-panel"
        title="Search, Filter, and Sort"
        description="Find orders by ID, parcel, pickup, destination, or status quickly."
      >
        <div className="auth-form">
          <input
            className="search-input"
            type="search"
            placeholder="Search by order ID, parcel name, pickup, or destination"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="topbar-actions">
            <button type="button" className="secondary-btn" onClick={() => setStatusFilter("all")}>
              All Orders
            </button>
            <button type="button" className="secondary-btn" onClick={() => setStatusFilter("active")}>
              Active Orders
            </button>
            <button type="button" className="secondary-btn" onClick={() => setStatusFilter("delivered")}>
              Delivered
            </button>
            <button type="button" className="secondary-btn" onClick={() => setStatusFilter("cancelled")}>
              Cancelled
            </button>

            <select className="form-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      </SectionCard>
      ) : null}

      <div className="workspace-grid mobile-orders-grid">
        {activePane === "active" ? (
        <SectionCard className="orders-panel" title="Current Orders" description="Orders still moving through pickup, confirmation, or delivery.">
          {status === "loading" ? (
            <p className="helper-text">Loading current orders from the backend...</p>
          ) : filteredCurrentOrders.length ? (
            <div className="order-card-list">
              {filteredCurrentOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <div>
                      <p className="card-label">Order #{order.id}</p>
                      <h3>{order.parcelName}</h3>
                    </div>
                    <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  <p className="order-route">Pickup {order.pickupLocation} to delivery {order.destination}</p>
                  <div className="order-meta-row">
                    <span>Quoted price: KES {Number(order.quotedPrice || 0).toFixed(2)}</span>
                    <span>Updated {formatReadableDate(order.updatedAt)}</span>
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
              description="No active orders match your current search or filters."
              action={<Link to="/orders/create" className="primary-btn">Create Order</Link>}
            />
          )}
        </SectionCard>
        ) : null}

        {activePane === "history" ? (
        <SectionCard className="orders-panel" title="Order History" description="Delivered and cancelled orders from your account.">
          {status === "loading" ? (
            <p className="helper-text">Loading order history...</p>
          ) : filteredOrderHistory.length ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Parcel</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Quoted Price</th>
                    <th>Updated</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrderHistory.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.parcelName}</td>
                      <td>{order.pickupLocation} to {order.destination}</td>
                      <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                      <td>KES {Number(order.quotedPrice || 0).toFixed(2)}</td>
                      <td>{formatReadableDate(order.updatedAt)}</td>
                      <td><Link to={`/orders/${order.id}`} className="inline-link">Open</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No order history yet" description="No delivered or cancelled orders match your current search or filters." />
          )}
        </SectionCard>
        ) : null}
      </div>
    </section>
  );
}
