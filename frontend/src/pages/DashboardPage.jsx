import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoIcon from "../assets/deliveroo-logo-icon.svg";
import { fetchOrders } from "../features/orders/ordersSlice";

const sidebarItems = ["Dashboard", "Orders", "Riders", "Customers", "Payments", "Reports", "Settings", "Analytics"];

const trendCards = [
  { title: "Total Orders", value: "1,250", change: "+15% this week", chart: "bar" },
  { title: "Active Deliveries", value: "178", change: "+8% this hour", chart: "line" },
  { title: "Pending Orders", value: "32", change: "13 new orders", chart: "donut" },
];

export function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const rows = useMemo(() => {
    const fallbackRows = [
      { id: "#5763", customer: "John Dohn", service: "Pickup - Medium City-wide", price: "$6.50", status: "Pending" },
      { id: "#5762", customer: "David Soda", service: "Pickup - Medium City Route", price: "$6.55", status: "In Transit" },
      { id: "#5761", customer: "Jen Sulton", service: "Pickup - Medium City-wide", price: "$6.50", status: "Delivered" },
      { id: "#5759", customer: "Rachel Allen", service: "Drop-off - Large NJ Route", price: "$7.05", status: "Delivered" },
    ];

    const liveRows = [...currentOrders, ...orderHistory].slice(0, 8).map((order, index) => ({
      id: `#${order.id}`,
      customer: index % 2 === 0 ? "Customer Account" : "Delivery Client",
      service: `${order.pickupLocation} -> ${order.destination}`,
      price: `$${Number(order.quotedPrice || 0).toFixed(2)}`,
      status: order.status.replaceAll("_", " "),
    }));

    return liveRows.length ? liveRows : fallbackRows;
  }, [currentOrders, orderHistory]);

  return (
    <section className="role-dashboard-page admin-dashboard-theme">
      <div className="dashboard-frame admin-frame">
        <aside className="dashboard-sidebar admin-sidebar">
          <div className="sidebar-brand">
            <img src={deliverooLogoIcon} alt="Deliveroo" className="sidebar-logo" />
            <span>Deliveroo</span>
          </div>

          <nav className="sidebar-menu">
            {sidebarItems.map((item, index) => (
              <button key={item} type="button" className={`sidebar-item ${index === 0 ? "active" : ""}`}>
                <span className="sidebar-dot"></span>
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="dashboard-content admin-content">
          <header className="dashboard-toolbar">
            <div className="search-shell">
              <input type="text" className="search-input sleek-search" placeholder="Search..." />
            </div>
            <div className="toolbar-user-block">
              <span>Welcome back, {user?.email?.split("@")[0] || "Admin"}!</span>
              <div className="toolbar-avatar"></div>
            </div>
          </header>

          <section className="stats-overview">
            <div className="stats-heading">
              <h1>Stats Overview</h1>
              <p>Operational control and summaries at a glance.</p>
            </div>
            <div className="stats-card-grid">
              {trendCards.map((card) => (
                <article key={card.title} className="stats-card glass-card">
                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                  <span>{card.change}</span>
                  <div className={`mini-chart ${card.chart}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="data-grid-panel glass-card">
            <div className="panel-header-row">
              <div>
                <h2>Recent Orders</h2>
                <p>Filtered, searchable operational list.</p>
              </div>
              <div className="table-filters">
                <button type="button" className="table-filter-chip active">Filtering</button>
                <button type="button" className="table-filter-chip">Sort</button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="orders-table dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Service Type</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.customer}</td>
                      <td>{row.service}</td>
                      <td>{row.price}</td>
                      <td><span className={`table-status status-${row.status.toLowerCase().replaceAll(" ", "-")}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-pagination-row">
              <span>Showing {Math.min(rows.length, 6)} of 1,250</span>
              <div className="pagination-chips">
                <span className="pagination-chip active">1</span>
                <span className="pagination-chip">2</span>
                <span className="pagination-chip">3</span>
                <span className="pagination-chip">4</span>
              </div>
            </div>
          </section>

          <div className="dashboard-cta-row">
            <Link to="/orders" className="primary-btn">Open Customer Workspace</Link>
            <Link to="/rider" className="secondary-btn">Preview Rider View</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
