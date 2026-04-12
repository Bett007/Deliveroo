import { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./HelpPage.module.css";

const helpTopics = [
  {
    icon: "D",
    title: "Order delays",
    description: "Order number, destination, current status.",
  },
  {
    icon: "A",
    title: "Account and access issues",
    description: "Email, role, sign-in or verification step.",
  },
  {
    icon: "B",
    title: "Billing or parcel concerns",
    description: "Parcel ID, charge details, short summary.",
  },
];

const faqItems = [
  "Use support@deliveroo-app.com for all customer and admin issues.",
  "Include your order ID in the subject line when the issue is tied to a parcel.",
  "For urgent delivery problems, mention the current status and destination in the first sentence.",
];

const roleCopy = {
  customer: {
    heading: "Get support faster",
    subtitle: "Parcel, account, and billing help in one place.",
    chip: "Customer queue",
  },
  rider: {
    heading: "Rider support center",
    subtitle: "Route, assignment, and account help in one place.",
    chip: "Rider queue",
  },
  admin: {
    heading: "Operations support",
    subtitle: "Dispatch, account, and escalation help in one place.",
    chip: "Admin queue",
  },
};

export function HelpPage() {
  const { user } = useSelector((state) => state.auth);
  const copy = useMemo(() => roleCopy[user?.role] || roleCopy.customer, [user?.role]);

  return (
    <section className={`workspace-page help-page ops-page compact-help-page ${styles.scope}`}>
      <header className="ops-topbar help-topbar">
        <div>
          <p className="eyebrow">Help & Support</p>
          <h1>{copy.heading}</h1>
          <p className="workspace-copy">{copy.subtitle}</p>
        </div>

        <div className="topbar-actions">
          <div className="rider-stats-strip customer-stats-strip" aria-label="Support summary">
            <span><strong>24h</strong> first reply</span>
            <span><strong>1</strong> shared inbox</span>
            <span><strong>{copy.chip}</strong></span>
          </div>
          <a
            className="primary-btn"
            href="mailto:support@deliveroo-app.com?subject=Deliveroo%20Support%20Request"
          >
            Email Support
          </a>
        </div>
      </header>

      <div className="help-layout-grid">
        <section className="glass-card workspace-panel help-issue-panel">
          <div className="section-header">
            <div>
              <h2>Choose your issue</h2>
              <p>Pick one, then send your note.</p>
            </div>
          </div>

          <div className="help-topic-list">
            {helpTopics.map((topic) => (
              <article key={topic.title} className="feature-item help-item compact-help-item">
                <span className="help-icon" aria-hidden="true">{topic.icon}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card workspace-panel help-contact-panel">
          <div className="section-header">
            <div>
              <h2>Contact</h2>
              <p>One support inbox for every role.</p>
            </div>
          </div>

          <div className="support-card-stack compact-support-stack">
            <div className="support-card">
              <p className="card-label">Support Email</p>
              <h3>support@deliveroo-app.com</h3>
              <p>Orders, accounts, parcels, escalations.</p>
            </div>

            <div className="support-card">
              <p className="card-label">Expected response</p>
              <h3>Within one business day</h3>
              <p>Mark urgent active orders in the subject.</p>
            </div>

            <div className="support-card faq-card">
              <p className="card-label">Quick notes</p>
              {faqItems.map((item) => (
                <div key={item} className="admin-check-item">
                  <span className="stage-dot"></span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
