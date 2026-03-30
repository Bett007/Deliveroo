import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="landing-page">
      <div className="landing-glow landing-glow-1"></div>
      <div className="landing-glow landing-glow-2"></div>

      <div className="landing-card glass-card">
        <div className="hero-badge">Frontend Lead Pack • Deliveroo UI</div>

        <h1 className="hero-title">
          Build smarter delivery operations with a clean, modern dashboard.
        </h1>

        <p className="hero-subtitle">
          A mobile-friendly, glassmorphism-inspired logistics interface for
          orders, riders, customers, and delivery tracking.
        </p>

        <div className="hero-actions">
          <Link to="/dashboard" className="primary-btn">
            Open Dashboard
          </Link>
          <Link to="/login" className="secondary-btn">
            Sign In
          </Link>
        </div>

        <div className="hero-stats">
          <div className="glass-card stat-card">
            <h3>1,248</h3>
            <p>Orders Processed</p>
          </div>
          <div className="glass-card stat-card">
            <h3>92%</h3>
            <p>On-time Delivery</p>
          </div>
          <div className="glass-card stat-card">
            <h3>4.8/5</h3>
            <p>Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}