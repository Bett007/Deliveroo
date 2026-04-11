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

export function HelpPage() {
  return (
    <section className="workspace-page help-page">
      <header className="workspace-hero glass-card help-hero">
        <div>
          <p className="eyebrow">Help & Support</p>
          <h1>Get support faster</h1>
          <p className="workspace-copy">Send the right details and the team can move quickly.</p>
        </div>

        <a
          className="primary-btn"
          href="mailto:support@deliveroo-app.com?subject=Deliveroo%20Support%20Request"
        >
          Email Support
        </a>
      </header>

      <div className="workspace-grid">
        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Choose your issue</h2>
              <p>Copy the matching details into your email.</p>
            </div>
          </div>

          <div className="feature-list">
            {helpTopics.map((topic) => (
              <article key={topic.title} className="feature-item help-item">
                <span className="help-icon" aria-hidden="true">{topic.icon}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Contact</h2>
              <p>One support inbox for every role.</p>
            </div>
          </div>

          <div className="support-card-stack">
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
