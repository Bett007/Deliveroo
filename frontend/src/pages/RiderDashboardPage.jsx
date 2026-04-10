import { Link } from "react-router-dom";
import deliverooLogoIcon from "../assets/deliveroo-logo-icon.svg";

const riderHistory = [
  { id: "John Dohn", status: "$6.50", route: "In Transit" },
  { id: "David Soda", status: "$6.55", route: "In Transit" },
  { id: "Jen Sulton", status: "$6.50", route: "Delivered" },
  { id: "Rachel Allen", status: "$8.90", route: "Available" },
];

export function RiderDashboardPage() {
  return (
    <section className="role-dashboard-page rider-dashboard-theme">
      <div className="dashboard-frame rider-frame">
        <div className="rider-top-summary glass-card">
          <div>
            <p>Live Earnings</p>
            <h2>$65.20</h2>
          </div>
          <div>
            <p>Shift Time</p>
            <h2>04:32:15</h2>
          </div>
          <span className="online-pill">Online</span>
        </div>

        <div className="rider-grid-layout">
          <section className="rider-map-panel glass-card">
            <div className="sidebar-brand rider-brand">
              <img src={deliverooLogoIcon} alt="Deliveroo" className="sidebar-logo" />
              <span>Rider Dashboard</span>
            </div>
            <div className="map-centric-surface">
              <div className="mini-route blue-route"></div>
              <div className="mini-route orange-route long-route"></div>
              <div className="mini-route teal-route short-route"></div>
              <div className="mini-pin pin-a"></div>
              <div className="mini-pin pin-b"></div>
              <div className="mini-pin pin-c"></div>
            </div>
          </section>

          <aside className="rider-context-column">
            <section className="glass-card active-order-card">
              <div className="panel-header-row">
                <div>
                  <h2>Active Order</h2>
                  <p>Emma Davis · $6.50</p>
                </div>
              </div>

              <div className="active-order-points">
                <div><strong>Pickup</strong><span>12 Maple St.</span></div>
                <div><strong>Drop-off</strong><span>78 River Rd.</span></div>
                <div><strong>Assigned</strong><span>In Transit</span></div>
              </div>

              <div className="rider-action-stack">
                <button type="button" className="primary-btn full-width">Start Delivery</button>
                <button type="button" className="secondary-btn full-width">Decline</button>
                <button type="button" className="secondary-btn full-width">Nav</button>
              </div>
            </section>

            <section className="glass-card history-card">
              <div className="panel-header-row">
                <div>
                  <h2>Delivery History</h2>
                  <p>On-the-move context and quick review.</p>
                </div>
              </div>
              <div className="history-list-grid">
                {riderHistory.map((item) => (
                  <div key={item.id} className="history-row">
                    <strong>{item.id}</strong>
                    <span>{item.route}</span>
                    <span>{item.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rider-footer-actions">
              <Link to="/orders" className="secondary-btn full-width">Customer Dashboard</Link>
              <Link to="/dashboard" className="primary-btn full-width">Admin Dashboard</Link>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
