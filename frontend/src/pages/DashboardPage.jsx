import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersSlice";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const dispatch = useDispatch();
  const [expandedStat, setExpandedStat] = useState("open");
>>>>>>> dev
  const { user } = useSelector((state) => state.auth);
  const {
    currentOrders,
    orderHistory,
    status,
  } = useSelector((state) => state.orders);
=======
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersSlice";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const dispatch = useDispatch();
  const [expandedStat, setExpandedStat] = useState("open");
  const { user } = useSelector((state) => state.auth);
  const {
    currentOrders,
    orderHistory,
    status,
  } = useSelector((state) => state.orders);
=======
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersSlice";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const dispatch = useDispatch();
  const [expandedStat, setExpandedStat] = useState("open");
>>>>>>> dev
  const { user } = useSelector((state) => state.auth);
  const {
    currentOrders,
    orderHistory,
    status,
  } = useSelector((state) => state.orders);

    const inFlight = currentOrders.filter((order) => order.status === "in_transit").length;
    const delivered = orderHistory.filter((order) => order.status === "delivered").length;
    const unassigned = currentOrders.filter((order) => !order.assignedRiderId).length;

    return [
      { id: "open", title: "Open Queue", value: String(unassigned), sub: "No rider yet", detail: "Assign riders or let riders accept available work.", icon: "Q" },
      { id: "active", title: "Active", value: String(currentOrders.length), sub: "Needs dispatch", detail: "Pending, confirmed, and in-transit orders.", icon: "A" },
      { id: "moving", title: "In Transit", value: String(inFlight), sub: "Moving now", detail: "Orders currently on route.", icon: "T" },
      { id: "delivered", title: "Delivered", value: String(delivered), sub: "Completed", detail: "Completed deliveries in the current data set.", icon: "D" },
      { id: "total", title: "Total", value: String(totalOrders), sub: "All orders", detail: "All records returned for this admin account.", icon: "O" },
>>>>>>> dev
    ];
  }, [currentOrders, orderHistory]);
=======
  const summaryCards = useMemo(() => {
    const totalOrders = currentOrders.length + orderHistory.length;
    const inFlight = currentOrders.filter((order) => order.status === "in_transit").length;
    const delivered = orderHistory.filter((order) => order.status === "delivered").length;
    const unassigned = currentOrders.filter((order) => !order.assignedRiderId).length;

    return [
      { id: "open", title: "Open Queue", value: String(unassigned), sub: "No rider yet", detail: "Assign riders or let riders accept available work.", icon: "Q" },
      { id: "active", title: "Active", value: String(currentOrders.length), sub: "Needs dispatch", detail: "Pending, confirmed, and in-transit orders.", icon: "A" },
      { id: "moving", title: "In Transit", value: String(inFlight), sub: "Moving now", detail: "Orders currently on route.", icon: "T" },
      { id: "delivered", title: "Delivered", value: String(delivered), sub: "Completed", detail: "Completed deliveries in the current data set.", icon: "D" },
      { id: "total", title: "Total", value: String(totalOrders), sub: "All orders", detail: "All records returned for this admin account.", icon: "O" },
    ];
  }, [currentOrders, orderHistory]);
=======
    const inFlight = currentOrders.filter((order) => order.status === "in_transit").length;
    const delivered = orderHistory.filter((order) => order.status === "delivered").length;
    const unassigned = currentOrders.filter((order) => !order.assignedRiderId).length;

    return [
      { id: "open", title: "Open Queue", value: String(unassigned), sub: "No rider yet", detail: "Assign riders or let riders accept available work.", icon: "Q" },
      { id: "active", title: "Active", value: String(currentOrders.length), sub: "Needs dispatch", detail: "Pending, confirmed, and in-transit orders.", icon: "A" },
      { id: "moving", title: "In Transit", value: String(inFlight), sub: "Moving now", detail: "Orders currently on route.", icon: "T" },
      { id: "delivered", title: "Delivered", value: String(delivered), sub: "Completed", detail: "Completed deliveries in the current data set.", icon: "D" },
      { id: "total", title: "Total", value: String(totalOrders), sub: "All orders", detail: "All records returned for this admin account.", icon: "O" },
>>>>>>> dev
    ];
  }, [currentOrders, orderHistory]);

    <section className={`dashboard-page ops-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Operations overview</h1>
          <p className="workspace-copy">Monitor the floor. Jump into Dispatch when action is needed.</p>
        </div>

        <div className="topbar-actions">
          <span className="user-chip">{user?.email || "Signed-in admin"}</span>
          <Link to="/dashboard/orders" className="primary-btn">Manage Dispatch</Link>
        </div>
>>>>>>> dev
      </header>

      <section className="summary-grid ops-summary-grid">
        <Link to="/dashboard/orders" className="admin-action-icon" aria-label="Open dispatch">
          <span className="summary-icon" aria-hidden="true">D</span>
          <strong>Dispatch</strong>
        </Link>
        <button type="button" className="admin-action-icon" onClick={() => dispatch(fetchOrders())} disabled={status === "loading"} aria-label="Refresh orders">
          <span className="summary-icon" aria-hidden="true">F</span>
          <strong>{status === "loading" ? "Refreshing" : "Refresh"}</strong>
        </button>
        <Link to="/help" className="admin-action-icon" aria-label="Open help">
          <span className="summary-icon" aria-hidden="true">H</span>
          <strong>Help</strong>
        </Link>
      </section>

<<<<<<< HEAD
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
=======
      <div className="admin-stat-accordion" aria-label="Operations metrics">
        {summaryCards.map((card) => {
          const isExpanded = expandedStat === card.id;

          return (
            <button
              key={card.id}
              type="button"
              className={`admin-stat-panel ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedStat(card.id)}
              aria-expanded={isExpanded}
            >
              <span className="summary-icon" aria-hidden="true">{card.icon}</span>
              <span className="admin-stat-main">
                <small>{card.title}</small>
                <strong>{card.value}</strong>
              </span>
              {isExpanded ? (
                <span className="admin-stat-detail">
                  <em>{card.sub}</em>
                  <span>{card.detail}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
>>>>>>> dev
    </section>
  );
}
=======
  return (
    <section className={`dashboard-page ops-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Overview, {user?.email || "user"}</h1>
          <p className="workspace-copy">Monitor orders and dispatch. Refresh for live data.</p>
        </div>

        <div className="topbar-actions">
          <span className="user-chip">{user?.email || "Signed-in user"}</span>
          <Link to="/dashboard/orders" className="primary-btn">Manage Orders</Link>
        </div>
      </header>

      <section className="summary-grid ops-summary-grid">
        <Link to="/dashboard/orders" className="admin-action-icon" aria-label="Open dispatch">
          <span className="summary-icon" aria-hidden="true">D</span>
          <strong>Orders</strong>
        </Link>
        <button type="button" className="admin-action-icon" onClick={() => dispatch(fetchOrders())} disabled={status === "loading"} aria-label="Refresh orders">
          <span className="summary-icon" aria-hidden="true">F</span>
          <strong>{status === "loading" ? "Refreshing" : "Refresh"}</strong>
        </button>
        <Link to="/help" className="admin-action-icon" aria-label="Open help">
          <span className="summary-icon" aria-hidden="true">H</span>
          <strong>Help</strong>
        </Link>
      </section>

      <div className="admin-stat-accordion" aria-label="Operations metrics">
        {summaryCards.map((card) => {
          const isExpanded = expandedStat === card.id;

          return (
            <button
              key={card.id}
              type="button"
              className={`admin-stat-panel ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedStat(card.id)}
              aria-expanded={isExpanded}
            >
              <span className="summary-icon" aria-hidden="true">{card.icon}</span>
              <span className="admin-stat-main">
                <small>{card.title}</small>
                <strong>{card.value}</strong>
              </span>
              {isExpanded ? (
                <span className="admin-stat-detail">
                  <em>{card.sub}</em>
                  <span>{card.detail}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
=======
    <section className={`dashboard-page ops-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Operations overview</h1>
          <p className="workspace-copy">Monitor the floor. Jump into Dispatch when action is needed.</p>
        </div>

        <div className="topbar-actions">
          <span className="user-chip">{user?.email || "Signed-in admin"}</span>
          <Link to="/dashboard/orders" className="primary-btn">Manage Dispatch</Link>
        </div>
>>>>>>> dev
      </header>

      <section className="summary-grid ops-summary-grid">
        <Link to="/dashboard/orders" className="admin-action-icon" aria-label="Open dispatch">
          <span className="summary-icon" aria-hidden="true">D</span>
          <strong>Dispatch</strong>
        </Link>
        <button type="button" className="admin-action-icon" onClick={() => dispatch(fetchOrders())} disabled={status === "loading"} aria-label="Refresh orders">
          <span className="summary-icon" aria-hidden="true">F</span>
          <strong>{status === "loading" ? "Refreshing" : "Refresh"}</strong>
        </button>
        <Link to="/help" className="admin-action-icon" aria-label="Open help">
          <span className="summary-icon" aria-hidden="true">H</span>
          <strong>Help</strong>
        </Link>
      </section>

<<<<<<< HEAD
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
=======
      <div className="admin-stat-accordion" aria-label="Operations metrics">
        {summaryCards.map((card) => {
          const isExpanded = expandedStat === card.id;

          return (
            <button
              key={card.id}
              type="button"
              className={`admin-stat-panel ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedStat(card.id)}
              aria-expanded={isExpanded}
            >
              <span className="summary-icon" aria-hidden="true">{card.icon}</span>
              <span className="admin-stat-main">
                <small>{card.title}</small>
                <strong>{card.value}</strong>
              </span>
              {isExpanded ? (
                <span className="admin-stat-detail">
                  <em>{card.sub}</em>
                  <span>{card.detail}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
>>>>>>> dev
    </section>
  );
}
