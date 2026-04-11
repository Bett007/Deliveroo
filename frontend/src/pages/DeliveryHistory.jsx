import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SectionCard } from "../components/ui/SectionCard";
import { formatReadableDate } from "../utils/formatters/date";

const PAGE_SIZE = 20;

export function DeliveryHistory() {
  const { orderHistory } = useSelector((state) => state.orders);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orderHistory.filter((order) => {
      const orderDate = new Date(order.updatedAt || order.createdAt);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });
  }, [orderHistory, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Delivery History</p>
          <h1>Completed rider jobs</h1>
          <p className="workspace-copy">
            Review completed and cancelled deliveries with date filtering and paginated records.
          </p>
        </div>
        <Link to="/rider/dashboard" className="secondary-btn">Back to Rider Dashboard</Link>
      </header>

      <SectionCard title="Filter Window" description="Filter delivery history records by date range.">
        <div className="topbar-actions">
          <label className="form-group">
            <span>From Date</span>
            <input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} />
          </label>
          <label className="form-group">
            <span>To Date</span>
            <input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1); }} />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Delivery Table" description={`${filtered.length} records found`}>
        {pagedOrders.length ? (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.id}>
                    <td><Link className="inline-link" to={`/orders/${order.id}`}>#{order.id}</Link></td>
                    <td>{order.pickupLocation}</td>
                    <td>{order.destination}</td>
                    <td>{order.durationMinutes || "--"} min</td>
                    <td>{order.status.replaceAll("_", " ")}</td>
                    <td>{formatReadableDate(order.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="helper-text">No deliveries match this date range.</p>
        )}

        <div className="topbar-actions">
          <button type="button" className="secondary-btn" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Previous
          </button>
          <span className="mini-badge">Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            className="secondary-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
          </button>
        </div>
      </SectionCard>
    </section>
  );
}
