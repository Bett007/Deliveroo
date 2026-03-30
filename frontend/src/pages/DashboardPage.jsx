export function DashboardPage() {
  const summaryCards = [
    { title: "Total Orders", value: "1,248", sub: "+12% this week" },
    { title: "Active Riders", value: "86", sub: "14 currently delivering" },
    { title: "Revenue Today", value: "$57,650", sub: "Strong order volume" },
    { title: "Avg Delivery", value: "24 min", sub: "2 mins faster than yesterday" },
  ];

  const orderStages = [
    { label: "Placed", count: 124 },
    { label: "Preparing", count: 48 },
    { label: "Out for Delivery", count: 36 },
    { label: "Delivered", count: 1012 },
  ];

  const liveOrders = [
    {
      id: "#DLV-1024",
      customer: "Sarah Wanjiku",
      rider: "Kevin",
      status: "Out for delivery",
      eta: "12 mins",
    },
    {
      id: "#DLV-1025",
      customer: "Brian Kiptoo",
      rider: "Mercy",
      status: "Preparing",
      eta: "18 mins",
    },
    {
      id: "#DLV-1026",
      customer: "Amina Noor",
      rider: "James",
      status: "Delivered",
      eta: "Completed",
    },
    {
      id: "#DLV-1027",
      customer: "John Kamau",
      rider: "Faith",
      status: "Placed",
      eta: "26 mins",
    },
  ];

  const notifications = [
    "New rider assignment completed for order #DLV-1024",
    "Peak demand detected in Westlands zone",
    "Customer support request opened for order #DLV-1021",
  ];

  return (
    <section className="dashboard-page">
      <header className="dashboard-topbar glass-card">
        <div>
          <p className="eyebrow">Operations Dashboard</p>
          <h1>Active Orders</h1>
        </div>

        <div className="topbar-actions">
          <input
            type="text"
            placeholder="Search orders, riders, customers..."
            className="search-input"
          />
          <button className="primary-btn">Create Order</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main-grid">
          <section className="glass-card stage-strip">
            {orderStages.map((stage) => (
              <div key={stage.label} className="stage-pill">
                <span className="stage-dot"></span>
                <div>
                  <h4>{stage.label}</h4>
                  <p>{stage.count} orders</p>
                </div>
              </div>
            ))}
          </section>

          <section className="summary-grid">
            {summaryCards.map((card) => (
              <div key={card.title} className="glass-card summary-card">
                <p className="card-label">{card.title}</p>
                <h3>{card.value}</h3>
                <span>{card.sub}</span>
              </div>
            ))}
          </section>

          <section className="glass-card orders-table-card">
            <div className="section-header">
              <div>
                <h2>Live Orders</h2>
                <p>Track real-time delivery progress across the platform.</p>
              </div>
              <button className="secondary-btn">View All</button>
            </div>

            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Rider</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.rider}</td>
                      <td>
                        <span className="status-badge">{order.status}</span>
                      </td>
                      <td>{order.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="dashboard-side-grid">
          <section className="glass-card map-card">
            <div className="section-header">
              <h2>Delivery Map</h2>
              <span className="mini-badge">Live</span>
            </div>
            <div className="fake-map">
              <div className="map-pin"></div>
            </div>
          </section>

          <section className="glass-card revenue-card">
            <p className="card-label">Daily Revenue</p>
            <h2>$57,650.00</h2>
            <span>+18.7% vs yesterday</span>
            <button className="primary-btn full-width">View Analytics</button>
          </section>

          <section className="glass-card notifications-card">
            <div className="section-header">
              <h2>Notifications</h2>
              <span className="mini-badge">3 New</span>
            </div>

            <div className="notification-list">
              {notifications.map((note, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-avatar">{index + 1}</div>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}