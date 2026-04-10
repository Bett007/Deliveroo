import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoIcon from "../assets/deliveroo-logo-icon.svg";
import { clearOrderError, fetchOrders } from "../features/orders/ordersSlice";

const customerSidebar = ["Home", "Orders", "Profile", "Support"];

const quickStatus = [
  { label: "Assigned", color: "blue" },
  { label: "Drop-off Location", color: "orange" },
  { label: "Expected arrival time", color: "green" },
];

export function OrdersPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory, error } = useSelector((state) => state.orders);
  const [quickForm, setQuickForm] = useState({ pickup: "", dropoff: "", weight: "Medium" });

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const listRows = useMemo(() => {
    const fallback = [
      { id: "#5759", title: "Active delivery", subtitle: "Order placed and rider assigned", state: "assigned" },
      { id: "#5762", title: "Finding rider", subtitle: "Pickup window updated", state: "pending" },
      { id: "#5766", title: "Delivered", subtitle: "Completed successfully", state: "delivered" },
    ];

    const live = [...currentOrders, ...orderHistory].slice(0, 5).map((order) => ({
      id: `#${order.id}`,
      title: `${order.pickupLocation} to ${order.destination}`,
      subtitle: `${order.status.replaceAll("_", " ")} · KES ${Number(order.quotedPrice || 0).toFixed(2)}`,
      state: order.status,
    }));

    return live.length ? live : fallback;
  }, [currentOrders, orderHistory]);

  return (
    <section className="role-dashboard-page customer-dashboard-theme">
      <div className="dashboard-frame customer-frame">
        <aside className="dashboard-sidebar customer-sidebar">
          <div className="sidebar-brand customer-brand">
            <img src={deliverooLogoIcon} alt="Deliveroo" className="sidebar-logo" />
            <span>deliveroo</span>
          </div>

          <nav className="sidebar-menu compact-menu">
            {customerSidebar.map((item, index) => (
              <button key={item} type="button" className={`sidebar-item icon-only ${index === 1 ? "active" : ""}`}>
                <span className="sidebar-dot"></span>
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="dashboard-content customer-content">
          <header className="customer-topbar glass-card">
            <div>
              <p className="toolbar-greeting">Good afternoon, {user?.email?.split("@")[0] || "Alex"},</p>
              <div className="address-chip">28 Hillside Ave, New York, NY</div>
            </div>
            <div className="toolbar-actions-cluster">
              <button type="button" className="notification-bell"></button>
              <div className="toolbar-avatar"></div>
            </div>
          </header>

          {error ? <p className="form-status error dashboard-error-banner">{error}</p> : null}

          <div className="customer-main-grid">
            <section className="order-hub-card glass-card">
              <div className="panel-header-row">
                <div>
                  <h1>Order Hub</h1>
                  <p>Create Delivery</p>
                </div>
              </div>

              <form className="customer-order-form" onSubmit={(event) => event.preventDefault()}>
                <input
                  value={quickForm.pickup}
                  onChange={(event) => setQuickForm((current) => ({ ...current, pickup: event.target.value }))}
                  className="auth-input"
                  placeholder="Pickup Location"
                />
                <input
                  value={quickForm.dropoff}
                  onChange={(event) => setQuickForm((current) => ({ ...current, dropoff: event.target.value }))}
                  className="auth-input"
                  placeholder="Drop-off Location"
                />
                <div className="form-grid-two compact-grid">
                  <select className="auth-input" value={quickForm.weight} onChange={(event) => setQuickForm((current) => ({ ...current, weight: event.target.value }))}>
                    <option>Weight Category</option>
                    <option>Light</option>
                    <option>Medium</option>
                    <option>Heavy</option>
                  </select>
                  <div className="price-chip">$6.50</div>
                </div>
                <label className="schedule-row">
                  <input type="checkbox" />
                  <span>Schedule a delivery</span>
                </label>
                <Link to="/orders/create" className="primary-btn full-width customer-action-btn">Start Delivery</Link>
              </form>
            </section>

            <aside className="customer-side-stack">
              <section className="glass-card order-list-card">
                <div className="panel-header-row">
                  <div>
                    <h2>Active Order Tracking</h2>
                    <p>Recent orders with visual status indicators.</p>
                  </div>
                </div>

                <div className="customer-order-list">
                  {listRows.map((row) => (
                    <article key={row.id} className="customer-order-item">
                      <div className={`status-rail state-${row.state.replaceAll("_", "-")}`}></div>
                      <div className="customer-order-copy">
                        <strong>{row.id}</strong>
                        <p>{row.title}</p>
                        <span>{row.subtitle}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="glass-card mini-map-card">
                <div className="mini-map-surface">
                  <div className="mini-route orange-route"></div>
                  <div className="mini-route teal-route"></div>
                  <div className="mini-pin pin-a"></div>
                  <div className="mini-pin pin-b"></div>
                  <div className="mini-pin pin-c"></div>
                </div>
                <div className="tracking-status-list">
                  {quickStatus.map((item) => (
                    <div key={item.label} className="tracking-status-item">
                      <span className={`status-dot ${item.color}`}></span>
                      <div>
                        <strong>{item.label}</strong>
                        <p>Expected route status</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
