const currentOrders = [
  {
    id: "DLV-2104",
    parcel: "Documents package",
    route: "Westlands to Kilimani",
    status: "In transit",
    eta: "18 mins",
    updatedAt: "Today, 2:40 PM",
  },
  {
    id: "DLV-2105",
    parcel: "Electronics parcel",
    route: "CBD to Karen",
    status: "Pickup scheduled",
    eta: "35 mins",
    updatedAt: "Today, 1:55 PM",
  },
  {
    id: "DLV-2106",
    parcel: "Gift box",
    route: "Lavington to Parklands",
    status: "Awaiting rider",
    eta: "12 mins",
    updatedAt: "Today, 12:20 PM",
  },
];

const orderHistory = [
  {
    id: "DLV-2088",
    parcel: "Fashion items",
    route: "Ruiru to Thika",
    result: "Delivered",
    completedAt: "Yesterday, 5:10 PM",
  },
  {
    id: "DLV-2079",
    parcel: "Office files",
    route: "Upper Hill to Ngong Road",
    result: "Delivered",
    completedAt: "Mar 29, 2026, 11:45 AM",
  },
  {
    id: "DLV-2071",
    parcel: "Household package",
    route: "South B to Syokimau",
    result: "Cancelled",
    completedAt: "Mar 28, 2026, 3:15 PM",
  },
];

export function OrdersPage() {
  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Customer Orders</p>
          <h1>Current orders and order history</h1>
          <p className="workspace-copy">
            This page gives customers one place to monitor active deliveries and look back at completed or cancelled requests.
          </p>
        </div>
      </header>

      <div className="workspace-grid">
        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Current Orders</h2>
              <p>Orders that still need attention or are moving through delivery.</p>
            </div>
          </div>

          <div className="order-card-list">
            {currentOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <p className="card-label">{order.id}</p>
                    <h3>{order.parcel}</h3>
                  </div>
                  <span className="status-badge">{order.status}</span>
                </div>
                <p className="order-route">{order.route}</p>
                <div className="order-meta-row">
                  <span>ETA: {order.eta}</span>
                  <span>Updated: {order.updatedAt}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Order History</h2>
              <p>Delivered and cancelled parcels for quick reference.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Parcel</th>
                  <th>Route</th>
                  <th>Result</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.parcel}</td>
                    <td>{order.route}</td>
                    <td>
                      <span className="status-badge">{order.result}</span>
                    </td>
                    <td>{order.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
