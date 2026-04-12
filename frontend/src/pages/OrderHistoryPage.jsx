import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { clearOrderError, fetchOrders } from "../features/orders/ordersSlice";
import { formatReadableDate } from "../utils/formatters/date";
import styles from "./OrderHistoryPage.module.css";

export function OrderHistoryPage() {
  const dispatch = useDispatch();
  const { orderHistory, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const deliveredCount = useMemo(
    () => orderHistory.filter((order) => order.status === "delivered").length,
    [orderHistory],
  );

  return (
    <section className={`workspace-page ops-page history-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Order History</p>
          <h1>Past deliveries</h1>
          <p className="workspace-copy">Completed and cancelled parcels.</p>
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <div className="topbar-actions">
          <div className="rider-stats-strip customer-stats-strip" aria-label="Order history summary">
            <span><strong>{orderHistory.length}</strong> total</span>
            <span><strong>{deliveredCount}</strong> delivered</span>
          </div>
          <Link to="/orders" className="secondary-btn">Back to Orders</Link>
        </div>
      </header>

      <div className="single-screen-grid">
        <SectionCard title="History" description="Tap an order to reopen its route record.">
          {status === "loading" ? (
            <p className="helper-text">Loading history...</p>
          ) : orderHistory.length ? (
            <div className="history-card-list">
              {orderHistory.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="history-card">
                  <span className="order-icon" aria-hidden="true">H</span>
                  <span>
                    <small>#{order.id}</small>
                    <strong>{order.parcelName}</strong>
                    <em>{formatReadableDate(order.updatedAt)}</em>
                  </span>
                  <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No history yet" description="Finished deliveries will appear here." />
          )}
        </SectionCard>
      </div>
    </section>
  );
}
