import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";

export function AdminDashboard() {
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);
  const allOrders = useMemo(() => [...currentOrders, ...orderHistory], [currentOrders, orderHistory]);

  const totalOrders = allOrders.length;
  const activeOrders = allOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const delivered = allOrders.filter((order) => order.status === "delivered").length;
  const estimatedRevenue = allOrders.reduce((sum, order) => sum + Number(order.quotedPrice || 0), 0);
  const avgDuration = allOrders.length
    ? Math.round(allOrders.reduce((sum, order) => sum + Number(order.durationMinutes || 0), 0) / allOrders.length)
    : 0;

  return (
    <section className="dashboard-page">
      <header className="dashboard-topbar glass-card">
        <div>
          <p className="eyebrow">Platform Overview</p>
          <h1>Admin operations dashboard</h1>
          <p className="workspace-copy">Anonymized operational metrics for last-mile delivery performance.</p>
        </div>
        <div className="topbar-actions">
          <Link className="secondary-btn" to="/admin/analytics">Analytics</Link>
          <Link className="secondary-btn" to="/admin/monitoring">Monitoring</Link>
        </div>
      </header>

      <section className="summary-grid">
        <div className="glass-card summary-card">
          <p className="card-label">Total Orders</p>
          <h3>{totalOrders}</h3>
          <span>Platform-wide order volume snapshot</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">Active Shipments</p>
          <h3>{activeOrders}</h3>
          <span>Pending, confirmed, and in-transit deliveries</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">Delivered</p>
          <h3>{delivered}</h3>
          <span>Completed shipments in available records</span>
        </div>
        <div className="glass-card summary-card">
          <p className="card-label">Revenue Estimate</p>
          <h3>KES {estimatedRevenue.toFixed(2)}</h3>
          <span>Based on quoted order totals</span>
        </div>
      </section>

      <SectionCard title="Operational Snapshot" description={`Average completion time: ${avgDuration} minutes`}>
        {allOrders.length ? (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Rider</th>
                  <th>Quoted Price</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                    <td>{order.pickupLocation}</td>
                    <td>{order.destination}</td>
                    <td>Rider #{String(order.id).replace(/\D/g, "").slice(-3) || "001"}</td>
                    <td>KES {Number(order.quotedPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="helper-text">No order data available yet for admin metrics.</p>
        )}
      </SectionCard>
    </section>
  );
}
