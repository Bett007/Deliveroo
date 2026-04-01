import { Link } from "react-router-dom";

const customerHighlights = [
  {
    title: "Book parcel delivery fast",
    description:
      "Create a delivery request, set pickup and drop-off points, and keep all your parcel details in one place.",
  },
  {
    title: "Track active deliveries",
    description:
      "See which orders are still moving, which ones are delayed, and which ones already reached the destination.",
  },
  {
    title: "Get support without friction",
    description:
      "Reach the team through a simple support email flow when you need help with an order or billing issue.",
  },
];

const adminHighlights = [
  "Monitor parcel status and current location updates",
  "Review recent delivery activity and spot delayed shipments",
  "Coordinate support and escalations from one shared workspace",
];

export function HomePage() {
  return (
    <section className="landing-page">
      <div className="landing-glow landing-glow-1"></div>
      <div className="landing-glow landing-glow-2"></div>

      <div className="landing-card glass-card">
        <div className="landing-topbar">
          <div className="landing-brand-block">
            <div className="brand-pill">Deliveroo</div>
            <div>
              <p className="hero-badge">Parcel delivery for customers and admins</p>
            </div>
          </div>

          <div className="topbar-auth-links">
            <Link to="/login" className="secondary-btn">
              Sign In
            </Link>
            <Link to="/register" className="primary-btn">
              Register
            </Link>
          </div>
        </div>

        <div className="hero-grid hero-grid-single">
          <div>
            <h1 className="hero-title">
              Deliver parcels with a faster, clearer way to place, track, and manage every order.
            </h1>

            <p className="hero-subtitle">
              Create deliveries, follow active parcels, review completed orders, and reach support quickly whenever something needs attention.
            </p>

            <div className="hero-actions">
              <Link to="/orders" className="primary-btn">
                View Orders
              </Link>
              <Link to="/help" className="secondary-btn">
                Contact Help
              </Link>
              <Link to="/dashboard" className="secondary-btn">
                Open Admin Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="glass-card stat-card">
            <h3>Current Orders</h3>
            <p>Live delivery tracking and status visibility for customers.</p>
          </div>
          <div className="glass-card stat-card">
            <h3>Order History</h3>
            <p>Completed, cancelled, and delivered parcels in one place.</p>
          </div>
          <div className="glass-card stat-card">
            <h3>Help by Email</h3>
            <p>Human support for delivery issues, account questions, and escalations.</p>
          </div>
        </div>

        <div className="journey-grid">
          <section className="glass-card feature-panel">
            <div className="section-header">
              <div>
                <h2>Customer experience</h2>
                <p>Pages and flows the customer should see first.</p>
              </div>
            </div>

            <div className="feature-list">
              {customerHighlights.map((item) => (
                <article key={item.title} className="feature-item">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="glass-card feature-panel admin-panel">
            <div className="section-header">
              <div>
                <h2>Admin workspace</h2>
                <p>Operational visibility and delivery coordination.</p>
              </div>
            </div>

            <div className="admin-checklist">
              {adminHighlights.map((item) => (
                <div key={item} className="admin-check-item">
                  <span className="stage-dot"></span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
