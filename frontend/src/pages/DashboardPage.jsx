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

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

  return (
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
