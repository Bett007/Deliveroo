import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatReadableDate } from "../utils/formatters/date";

export function OrdersPage() {
  const location = useLocation();
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Customer Orders</p>
          <h1>Current orders and order history</h1>
          <p className="workspace-copy">
            Manage your active deliveries, review completed parcels, and open any order to change destination or cancel it when allowed.
          </p>
          {location.state?.message ? <p className="form-status error">{location.state.message}</p> : null}
        </div>

        <Link to="/orders/create" className="primary-btn">
          Create Parcel Order
        </Link>
      </header>

      <div className="workspace-grid">
        <SectionCard title="Current Orders" description="Orders that are still active across pickup, transit, and delivery.">
          {currentOrders.length ? (
            <div className="order-card-list">
              {currentOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <div>
                      <p className="card-label">{order.id}</p>
                      <h3>{order.parcelName}</h3>
                    </div>
                    <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  <p className="order-route">{order.pickupLocation} to {order.destination}</p>
                  <p className="helper-text">Updated {formatReadableDate(order.updatedAt)}</p>
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

        <SectionCard title="Order History" description="Delivered and cancelled parcels for reference.">
          {orderHistory.length ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Parcel</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.parcelName}</td>
                      <td>{order.pickupLocation} to {order.destination}</td>
                      <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                      <td>{formatReadableDate(order.updatedAt)}</td>
                      <td><Link to={`/orders/${order.id}`} className="inline-link">Open</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No order history yet" description="Delivered and cancelled orders will appear here once you start using the app." />
          )}
        </SectionCard>
      </div>
    </section>
  );
}
