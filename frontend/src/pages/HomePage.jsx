import { Link } from "react-router-dom";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import onlineShoppingDeliveryIllustration from "../assets/images/online-shopping-delivery-illustration.jpg";
import redDeliveryTruckImage from "../assets/images/red-delivery-truck-3d.jpg";
import scooterRiderIllustration from "../assets/images/scooter-rider-illustration.jpg";
import warehouseForkliftAisleImage from "../assets/images/warehouse-forklift-aisle.jpg";
import warehouseShelvesImage from "../assets/images/warehouse-shelves.jpg";
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

const workflowCards = [
  {
    title: "Orders are prepared with care",
    description: "Pickup details, parcel handling, and dispatch steps stay clear before a rider heads out.",
    imageSrc: warehouseForkliftAisleImage,
    imageAlt: "Forklift moving through a warehouse aisle during order preparation",
  },
  {
    title: "Busy delivery days stay organized",
    description: "Parcel volume, fulfillment flow, and delivery status stay easier to manage as orders grow.",
    imageSrc: warehouseShelvesImage,
    imageAlt: "Warehouse shelves filled with organized parcel stock",
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
  { label: "Support", href: "mailto:support@deliveroo-app.com" },
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
              <div className="hero-stage-media">
                <img src={scooterRiderIllustration} alt="Illustration of a scooter rider navigating a delivery route" className="hero-stage-image" />
              </div>

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
            <div className="overview-card-media">
              <img
                src={onlineShoppingDeliveryIllustration}
                alt="Illustration of a customer placing an online delivery order while a rider heads out"
                className="overview-card-image"
              />
            </div>
            <div className="overview-card-content">
              <h3>Everything important in one place</h3>
              <p>
                Customers can place and track orders while riders stay focused on active deliveries without losing the bigger picture.
              </p>
            </div>
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
          <span className="landing-section-kicker">Behind Every Delivery</span>
          <h2>Preparation and parcel handling stay visible from the start.</h2>
          <p>From packing to dispatch, the delivery flow stays easier to understand before a parcel goes on the road.</p>
        </div>

        <div className="landing-workflow-grid">
          {workflowCards.map((card) => (
            <article key={card.title} className="landing-workflow-card">
              <img src={card.imageSrc} alt={card.imageAlt} className="landing-workflow-image" />
              <div className="landing-workflow-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
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
          <article className="landing-trust-card landing-trust-card-image">
            <img src={redDeliveryTruckImage} alt="3D red delivery truck representing fast and dependable shipping" className="landing-trust-image" />
            <div className="landing-trust-copy">
              <strong>Trusted handoffs</strong>
              <span>Customers and riders both see a clearer delivery finish.</span>
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
          <p>Parcel delivery support for customers and riders.</p>
        </div>

        <div className="landing-footer-meta">
          <a href="mailto:support@deliveroo-app.com">support@deliveroo-app.com</a>
          <span>Deliveroo Courier Service</span>
        </div>
      </footer>
    </main>
  );
}
