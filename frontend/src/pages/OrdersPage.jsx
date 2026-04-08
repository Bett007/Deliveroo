import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState } from "../components/ui/EmptyState";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
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

  return (
    <section className="workspace-page">
      <header className="workspace-hero workspace-hero-split glass-card">
        <div className="workspace-hero-copy">
          <p className="eyebrow">Customer Orders</p>
          <h1>Your backend-connected order workspace</h1>
          <p className="workspace-copy">
            These cards now read from the authenticated orders API, grouped into active deliveries and completed history.
          </p>
          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}

          <div className="topbar-actions">
            <span className="mini-badge">{totalOrders} total</span>
            <Link to="/orders/create" className="primary-btn">
              Create Parcel Order
            </Link>
          </div>
        </div>

        <PlaceholderArtwork
          variant="customer"
          label="Customer Preview"
          title="A reserved visual area for parcel and delivery imagery"
          caption="Use this space later for product shots, rider photography, route graphics, or branded customer illustrations."
        />
      </header>

      <div className="workspace-grid">
        <SectionCard title="Current Orders" description="Orders still moving through pickup, confirmation, or delivery.">
          {status === "loading" ? (
            <p className="helper-text">Loading current orders from the backend...</p>
          ) : currentOrders.length ? (
            <div className="order-card-list">
              {currentOrders.map((order) => (
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
              description="Create your first parcel order to start tracking deliveries here."
              action={<Link to="/orders/create" className="primary-btn">Create Order</Link>}
            />
          )}
        </SectionCard>

        <SectionCard title="Order History" description="Delivered and cancelled orders returned by the orders API.">
          {status === "loading" ? (
            <p className="helper-text">Loading order history...</p>
          ) : orderHistory.length ? (
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
                  {orderHistory.map((order) => (
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
            <EmptyState title="No order history yet" description="Delivered and cancelled orders will appear here once the backend returns them for your account." />
          )}
        </SectionCard>
      </div>
    </section>
  );
}
