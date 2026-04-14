import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { NotificationBell } from "../components/ui/NotificationBell";
import { AppIcon } from "../components/ui/AppIcon";
import { formatReadableDate } from "../utils/formatters/date";

export function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory, status } = useSelector((state) => state.orders);
  const featuredOrder = currentOrders[0] || orderHistory[0];
  const inTransit = currentOrders.filter((order) => order.status === "in_transit").length;
  const dashboardName = user?.first_name?.trim() || user?.email?.split("@")[0] || "Customer";
  const avatarUrl = user?.avatar_url;
  const customerModules = [
    {
      title: "Current Orders",
      description: `${currentOrders.length} active deliveries`,
      path: "/orders",
      badge: "Orders",
    },
    {
      title: "Order History",
      description: `${orderHistory.length} completed or cancelled`,
      path: "/orders/history",
      badge: "History",
    },
    {
      title: "Create Order",
      description: "Start a new parcel delivery",
      path: "/orders/create",
      badge: "New",
    },
    {
      title: "Track Parcel",
      description: featuredOrder ? `Open tracking for order #${featuredOrder.id}` : "View route and rider progress",
      path: featuredOrder ? `/orders/${featuredOrder.id}` : "/orders",
      badge: "Map",
    },
  ];

  const summaryCards = useMemo(() => {
    const totalOrders = currentOrders.length + orderHistory.length;

    const spend = [...currentOrders, ...orderHistory].reduce(
      (sum, order) => sum + Number(order.quotedPrice || 0),
      0,
    );

    return [
      { title: "Total Orders", value: totalOrders, sub: "+12% this week" },
      { title: "Active Deliveries", value: currentOrders.length, sub: "+8% this week" },
      { title: "Spend", value: `KES ${Math.round(spend)}`, sub: "+15% this week" },
    ];
  }, [currentOrders, orderHistory]);

  return (
    <section className="dashboard-page ops-page">
      <header className="ops-topbar">
        <div>
          <h1 className="dashboard-greeting">Welcome back, {dashboardName}</h1>
        </div>
        <div className="topbar-actions dashboard-user-meta">
          <NotificationBell label="Notifications" minimumCount={Math.max(1, inTransit)} />
          <div className="dashboard-account-card">
            <span className="dashboard-avatar" aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt={`${dashboardName} avatar`} /> : dashboardName?.[0]?.toUpperCase() || "C"}
            </span>
            <span className="dashboard-account-copy">
              <strong>{dashboardName}</strong>
              <small>{user?.email || "customer@deliveroo.app"}</small>
            </span>
          </div>
        </div>
      </header>

      <section className="summary-grid ops-summary-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="summary-card">
            <span className="summary-icon" aria-hidden="true">
              <AppIcon
                name={card.title === "Total Orders" ? "package" : card.title === "Active Deliveries" ? "route" : "wallet"}
                size={22}
              />
            </span>
            <div className="summary-copy">
              <p className="card-label">{card.title}</p>
              <h3>{card.value}</h3>
              <span>{card.sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-module-grid" aria-label="Customer modules">
        {customerModules.map((module) => (
          <Link key={`${module.title}-${module.path}`} to={module.path} className="dashboard-module-card">
            <div className="dashboard-module-head">
              <span className="dashboard-module-badge">{module.badge}</span>
              <span className="dashboard-module-arrow" aria-hidden="true">↗</span>
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </section>

      <div className="ops-dashboard-grid">
        <SectionCard title="Recent Orders" description="Latest active deliveries for this customer account.">
          {status === "loading" ? (
            <p className="helper-text">Loading orders...</p>
          ) : currentOrders.length ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Parcel</th>
                    <th>Destination</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.slice(0, 6).map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/orders/${order.id}`} className="inline-link">#{order.id}</Link>
                      </td>
                      <td>{order.parcelName}</td>
                      <td>{order.destination}</td>
                      <td>KES {Number(order.quotedPrice || 0).toFixed(2)}</td>
                      <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                      <td>{formatReadableDate(order.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="helper-text">No active customer orders found yet.</p>
          )}

          <div className="topbar-actions">
            <Link className="primary-btn" to="/orders/create">Create Order</Link>
            <Link className="secondary-btn" to="/orders">Open Orders</Link>
          </div>
        </SectionCard>

        <aside className="ops-side-stack">
          {featuredOrder ? (
            <RouteMapCard
              origin={featuredOrder.pickupLocation}
              destination={featuredOrder.destination}
              distanceKm={featuredOrder.distanceKm}
              durationMinutes={featuredOrder.durationMinutes}
            />
          ) : (
            <section className="ops-insight-card">
              <h2>Deliveries Map</h2>
              <p className="helper-text">Create an order to see route mapping here.</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
