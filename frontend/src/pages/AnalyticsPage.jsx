import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SectionCard } from "../components/ui/SectionCard";

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function Bar({ label, value, total }) {
  const width = `${percent(value, total)}%`;

  return (
    <article className="order-card">
      <div className="order-card-top">
        <h3>{label}</h3>
        <span>{value}</span>
      </div>
      <div className="fake-map" style={{ height: "12px", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width, background: "linear-gradient(135deg, #1ec8ff, #00a6e6)" }} />
      </div>
      <p className="helper-text">{width} of tracked orders</p>
    </article>
  );
}

export function AnalyticsPage() {
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);
  const allOrders = useMemo(() => [...currentOrders, ...orderHistory], [currentOrders, orderHistory]);

  const statusCounts = useMemo(() => {
    return allOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, in_transit: 0, delivered: 0, cancelled: 0 },
    );
  }, [allOrders]);

  const riderUtilization = useMemo(() => {
    const buckets = {};
    allOrders.forEach((order) => {
      const riderId = `Rider #${String(order.id).replace(/\D/g, "").slice(-3) || "001"}`;
      buckets[riderId] = (buckets[riderId] || 0) + 1;
    });
    return Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [allOrders]);

  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.quotedPrice || 0), 0);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Admin analytics and trends</h1>
          <p className="workspace-copy">Status mix, revenue movement, and anonymized rider utilization from available order records.</p>
        </div>
        <Link className="secondary-btn" to="/admin/dashboard">Back to Admin Dashboard</Link>
      </header>

      <div className="workspace-grid">
        <SectionCard title="Order Status Breakdown" description="Distribution of orders by current lifecycle status.">
          <div className="order-card-list">
            <Bar label="Pending" value={statusCounts.pending || 0} total={allOrders.length} />
            <Bar label="Confirmed" value={statusCounts.confirmed || 0} total={allOrders.length} />
            <Bar label="In Transit" value={statusCounts.in_transit || 0} total={allOrders.length} />
            <Bar label="Delivered" value={statusCounts.delivered || 0} total={allOrders.length} />
            <Bar label="Cancelled" value={statusCounts.cancelled || 0} total={allOrders.length} />
          </div>
        </SectionCard>

        <SectionCard title="Revenue and Volume" description="Simple trend indicators based on order totals.">
          <div className="summary-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div className="glass-card summary-card">
              <p className="card-label">Tracked Revenue</p>
              <h3>KES {totalRevenue.toFixed(2)}</h3>
              <span>Total quoted amount from known records</span>
            </div>
            <div className="glass-card summary-card">
              <p className="card-label">Total Orders</p>
              <h3>{allOrders.length}</h3>
              <span>Orders available to analytics processing</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Rider Utilization (Anonymized)" description="Top riders by number of handled orders.">
        {riderUtilization.length ? (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Rider</th>
                  <th>Orders</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {riderUtilization.map(([rider, count]) => (
                  <tr key={rider}>
                    <td>{rider}</td>
                    <td>{count}</td>
                    <td>{percent(count, allOrders.length)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="helper-text">No rider records available yet.</p>
        )}
      </SectionCard>
    </section>
  );
}
