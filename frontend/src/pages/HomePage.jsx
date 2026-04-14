import { Link } from "react-router-dom";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import landingCourierImage from "../assets/images/landing-courier.jpg";
import courierBikeImage from "../assets/images/courier-bike.jpg";
import { AppIcon } from "../components/ui/AppIcon";
import styles from "./HomePage.module.css";

const featureCards = [
  {
    icon: "package",
    eyebrow: "Booking",
    title: "Easy parcel booking",
    description: "Create a delivery request in minutes with clear pickup, drop-off, and parcel details.",
  },
  {
    icon: "route",
    eyebrow: "Tracking",
    title: "Live order tracking",
    description: "Follow delivery progress with updates that make it easy to see where each parcel stands.",
  },
  {
    icon: "rider",
    eyebrow: "Riders",
    title: "Rider delivery workflow",
    description: "Help riders move through assigned deliveries with clear route and status steps.",
  },
];

const roleCards = [
  {
    icon: "customer",
    title: "Customers",
    description: "Place parcel orders, review current deliveries, and get help quickly when something needs attention.",
  },
  {
    icon: "rider",
    title: "Riders",
    description: "Manage assigned deliveries, follow the route ahead, and keep each status update moving forward.",
  },
];

const productPoints = [
  "Book deliveries without confusion",
  "Track progress without constant follow-up",
  "Support every role with the right tools",
];

const trustStats = [
  { value: "5000+", label: "users served" },
  { value: "12000+", label: "parcels tracked" },
  { value: "98%", label: "successful deliveries" },
];

const footerLinks = [
  { label: "Sign In", path: "/login" },
  { label: "Create Account", path: "/register" },
  { label: "Support", href: "mailto:support@deliveroo-app.com" },
];

export function HomePage() {
  return (
    <main className={`landing-root ${styles.scope}`}>
      <section className="landing-hero">
        <div className="landing-nav">
          <Link to="/" className="landing-brand" aria-label="Deliveroo home">
            <img src={deliverooLogoFull} alt="Deliveroo" className="landing-brand-logo" />
          </Link>

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-nav-link">Sign In</Link>
            <Link to="/register" className="landing-nav-cta">Create Account</Link>
          </div>
        </div>

        <div className="landing-hero-grid">
          <div className="landing-copy-column">
            <span className="landing-kicker">Parcel delivery made clearer</span>
            <h1>Move parcels with confidence from booking to delivery.</h1>
            <p className="landing-subtitle">
              Deliveroo helps customers send parcels and riders manage deliveries with a clear, dependable flow from start to finish.
            </p>

            <div className="landing-cta-row">
              <Link to="/register" className="landing-primary-cta">Sign Up</Link>
              <Link to="/login" className="landing-secondary-cta">Sign In</Link>
            </div>

            <div className="landing-proof-row" aria-label="Deliveroo trust indicators">
              {trustStats.map((item) => (
                <div key={item.label} className="landing-proof-chip">
                  <span className="landing-proof-icon" aria-hidden="true">
                    <AppIcon
                      name={item.label.includes("users") ? "customer" : item.label.includes("tracked") ? "route" : "check"}
                      size={18}
                    />
                  </span>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-visual-column" aria-label="Deliveroo product preview">
            <div className="hero-orb hero-orb-a"></div>
            <div className="hero-orb hero-orb-b"></div>

            <section className="hero-stage-card">
              <div className="hero-stage-surface">
                <div className="hero-panel hero-panel-primary">
                  <img
                    src={landingCourierImage}
                    alt="Customer confirming a parcel delivery with a courier"
                    className="hero-panel-image"
                  />
                  <div className="hero-panel-copy">
                    <span className="hero-panel-tag">
                      <AppIcon name="check" size={14} />
                      Delivery confirmation
                    </span>
                    <h3>See the whole journey clearly</h3>
                    <p>Follow each parcel from pickup to destination with updates that feel simple and useful.</p>
                  </div>
                </div>

                <div className="hero-panel hero-panel-secondary">
                  <p className="hero-panel-label">Today&apos;s activity</p>
                  <div className="hero-mini-stats">
                    <div>
                      <AppIcon name="package" size={18} className="hero-mini-icon" />
                      <strong>42</strong>
                      <span>active orders</span>
                    </div>
                    <div>
                      <AppIcon name="rider" size={18} className="hero-mini-icon" />
                      <strong>18</strong>
                      <span>riders moving</span>
                    </div>
                  </div>
                </div>

                <div className="hero-panel hero-panel-tertiary">
                  <div className="hero-support-grid">
                    <img
                      src={courierBikeImage}
                      alt="Courier bike staged in an urban pickup area"
                      className="hero-support-image"
                    />
                    <div className="hero-support-copy">
                      <p className="hero-panel-label">Why teams stay on top of delivery flow</p>
                      <ul className="hero-benefit-list">
                        <li>Clear order status</li>
                        <li>Role-based visibility</li>
                        <li>Faster support follow-up</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="landing-section landing-overview-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Product Overview</span>
          <h2>Deliveroo keeps parcel delivery easy to understand.</h2>
          <p>
            From the moment an order is created to the final drop-off, the app helps every user see what matters and act quickly.
          </p>
        </div>

        <div className="landing-overview-grid">
          <article className="overview-card overview-card-large">
            <h3>Everything important in one place</h3>
            <p>
              Customers can place and track orders while riders stay focused on active deliveries without losing the bigger picture.
            </p>
          </article>

          <div className="overview-points">
            {productPoints.map((point) => (
              <article key={point} className="overview-point-card">
                <span className="overview-point-dot" aria-hidden="true"></span>
                <p>{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Features</span>
          <h2>Built around the moments that matter most.</h2>
          <p>Every feature is designed to help people move parcels with less friction and more confidence.</p>
        </div>

        <div className="landing-feature-grid">
          {featureCards.map((card) => (
            <article key={card.title} className="landing-feature-card">
              <span className="landing-card-icon" aria-hidden="true">
                <AppIcon name={card.icon} size={20} />
              </span>
              <span className="landing-feature-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Built For Delivery Teams</span>
          <h2>The right experience for customers and riders.</h2>
          <p>Each role gets a clearer path through the delivery process without unnecessary clutter.</p>
        </div>

        <div className="landing-role-grid">
          {roleCards.map((card) => (
            <article key={card.title} className="landing-role-card">
              <span className="landing-card-icon" aria-hidden="true">
                <AppIcon name={card.icon} size={20} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-trust-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Why Teams Trust Deliveroo</span>
          <h2>A delivery experience that feels dependable.</h2>
          <p>These metrics show the kind of confidence and consistency the product is built to support.</p>
        </div>

        <div className="landing-trust-grid">
          {trustStats.map((item) => (
            <article key={item.label} className="landing-trust-card">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-final-cta">
        <div className="landing-final-cta-card">
          <div>
            <span className="landing-section-kicker">Get Started</span>
            <h2>Start sending, tracking, and managing deliveries today.</h2>
            <p>Create an account to get started or sign in if you already use Deliveroo.</p>
          </div>

          <div className="landing-cta-row">
            <Link to="/register" className="landing-primary-cta">Create Account</Link>
            <Link to="/login" className="landing-secondary-cta">Sign In</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src={deliverooLogoFull} alt="Deliveroo" className="landing-footer-logo" />
          <p>Parcel delivery support for customers and riders.</p>
        </div>

        <nav className="landing-footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) =>
            item.href ? (
              <a key={item.label} href={item.href}>{item.label}</a>
            ) : (
              <Link key={item.label} to={item.path}>{item.label}</Link>
            ),
          )}
        </nav>

        <div className="landing-footer-meta">
          <a href="mailto:support@deliveroo-app.com">support@deliveroo-app.com</a>
          <span>Deliveroo Courier Service</span>
        </div>
      </footer>
    </main>
  );
}
