import { Link } from "react-router-dom";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import onlineShoppingDeliveryIllustration from "../assets/images/online-shopping-delivery-illustration.jpg";
import redDeliveryTruckImage from "../assets/images/red-delivery-truck-3d.jpg";
import scooterRiderIllustration from "../assets/images/scooter-rider-illustration.jpg";
import warehouseForkliftAisleImage from "../assets/images/warehouse-forklift-aisle.jpg";
import warehouseShelvesImage from "../assets/images/warehouse-shelves.jpg";
import { AppIcon } from "../components/ui/AppIcon";
import styles from "./HomePage.module.css";

const processSteps = [
  {
    number: "01",
    icon: "package",
    title: "Book",
    description: "Create a parcel request with clear pickup, drop-off, and item details in minutes.",
    imageSrc: onlineShoppingDeliveryIllustration,
    imageAlt: "Illustration of a customer creating a parcel order",
  },
  {
    number: "02",
    icon: "route",
    title: "Track",
    description: "Follow delivery progress with live status updates that remove uncertainty.",
    imageSrc: warehouseForkliftAisleImage,
    imageAlt: "Warehouse workflow representing order progress tracking",
  },
  {
    number: "03",
    icon: "check",
    title: "Deliver",
    description: "Complete handoff with clear confirmation for both the customer and rider.",
    imageSrc: warehouseShelvesImage,
    imageAlt: "Organized delivery operations representing reliable handoff",
  },
];

const roleCards = [
  {
    icon: "customer",
    title: "Customers",
    description: "Book deliveries fast, track parcels in real time, and get support quickly when plans change.",
  },
  {
    icon: "rider",
    title: "Riders",
    description: "Manage assigned orders, follow route context, and update status without extra friction.",
  },
];

const trustStats = [
  { value: "5000+", label: "users served" },
  { value: "12000+", label: "parcels tracked" },
  { value: "98%", label: "successful deliveries" },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Book Delivery", path: "/register" },
      { label: "Track Orders", path: "/login" },
      { label: "For Riders", path: "/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Deliveroo", href: "#" },
      { label: "Reliability", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "mailto:support@deliveroo-app.com" },
      { label: "Contact", href: "mailto:support@deliveroo-app.com" },
      { label: "Create Account", path: "/register" },
    ],
  },
];

export function HomePage() {
  return (
    <main className={`landing-root ${styles.scope}`}>
      <section className="landing-hero" id="hero-auth">
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
              <img src={scooterRiderIllustration} alt="Illustration of a scooter rider navigating a delivery route" className="hero-stage-image" />

              <div className="hero-stage-copy">
                <span className="hero-panel-tag">
                  <AppIcon name="check" size={14} />
                  Delivery confirmation
                </span>
                <h3>Clear progress from pickup to handoff</h3>
                <p>See where a parcel is, what happens next, and who needs to act without digging through app screens.</p>
              </div>

              <div className="hero-stage-stats" aria-label="Today's activity">
                <div className="hero-stat-card">
                  <AppIcon name="package" size={18} className="hero-mini-icon" />
                  <strong>42</strong>
                  <span>active orders</span>
                </div>
                <div className="hero-stat-card">
                  <AppIcon name="rider" size={18} className="hero-mini-icon" />
                  <strong>18</strong>
                  <span>riders moving</span>
                </div>
              </div>

              <div className="hero-stage-support">
                <div className="hero-support-copy">
                  <p className="hero-panel-label">Everything you need to manage deliveries clearly</p>
                  <ul className="hero-benefit-list">
                    <li>Track orders in one place</li>
                    <li>See progress without guesswork</li>
                    <li>Get help quickly when plans change</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="landing-section landing-process-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">How It Works</span>
          <h2>A simple 3-step delivery flow.</h2>
          <p>Everything on Deliveroo follows a single clear path so users always know what happens next.</p>
        </div>

        <div className="landing-process-grid" aria-label="Three step delivery flow">
          {processSteps.map((step) => (
            <article key={step.number} className="landing-process-card">
              <img src={step.imageSrc} alt={step.imageAlt} className="landing-process-image" />
              <div className="landing-process-copy">
                <span className="landing-process-number">Step {step.number}</span>
                <span className="landing-card-icon" aria-hidden="true">
                  <AppIcon name={step.icon} size={20} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <span className="landing-section-kicker">Built For Delivery Teams</span>
          <h2>The right experience for customers and riders.</h2>
          <p>Each role gets a clear path through delivery without extra clutter.</p>
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
          <span className="landing-section-kicker">Proof</span>
          <h2>Dependable delivery outcomes at scale.</h2>
          <p>Reliability is visible in the numbers and in the handoff experience across every order.</p>
        </div>

        <div className="landing-trust-grid">
          <article className="landing-trust-card landing-trust-card-image">
            <img src={redDeliveryTruckImage} alt="3D red delivery truck representing fast and dependable shipping" className="landing-trust-image" />
            <div className="landing-trust-copy">
              <strong>Trusted handoffs</strong>
              <span>Customers and riders both see a clear delivery finish.</span>
            </div>
          </article>
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
            <p className="landing-final-cta-note">
              Ready to start? <a href="#hero-auth" className="landing-inline-link">Sign in or create an account above.</a>
            </p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src={deliverooLogoFull} alt="Deliveroo" className="landing-footer-logo" />
          <p>Clear parcel operations for customers, riders, and delivery teams.</p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} className="landing-footer-group" aria-label={`${group.title} links`}>
            <strong>{group.title}</strong>
            <div className="landing-footer-links">
              {group.links.map((item) => (
                item.href
                  ? <a key={item.label} href={item.href}>{item.label}</a>
                  : <Link key={item.label} to={item.path}>{item.label}</Link>
              ))}
            </div>
          </nav>
        ))}

        <div className="landing-footer-meta">
          <a href="mailto:support@deliveroo-app.com">support@deliveroo-app.com</a>
          <span>Mon - Sat, 8:00 AM - 8:00 PM</span>
          <span>Kenya-wide delivery support</span>
        </div>

        <div className="landing-footer-legal">
          <span>© {new Date().getFullYear()} Deliveroo Courier Service</span>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
