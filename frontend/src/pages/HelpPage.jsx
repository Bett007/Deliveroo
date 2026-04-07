const helpTopics = [
  {
    title: "Order delays",
    description: "Share your order number, expected destination, and what changed so the team can investigate faster.",
  },
  {
    title: "Account and access issues",
    description: "Tell us whether the issue affects sign in, registration, or account verification so we route it correctly.",
  },
  {
    title: "Billing or parcel concerns",
    description: "Include the parcel ID, charge details, and a short summary of the issue in your email.",
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
          <h1>Need help with an order? Email the team directly.</h1>
          <p className="workspace-copy">
            Instead of an automated bot, this support flow encourages users to email the team with the details we need to help quickly.
          </p>
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
              <h2>What to include in your email</h2>
              <p>Giving the right context helps the team resolve issues faster.</p>
            </div>
          </div>

          <div className="feature-list">
            {helpTopics.map((topic) => (
              <article key={topic.title} className="feature-item help-item">
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Support details</h2>
              <p>Simple contact information for customers and admins.</p>
            </div>
          </div>

          <div className="support-card-stack">
            <div className="support-card">
              <p className="card-label">Support Email</p>
              <h3>support@deliveroo-app.com</h3>
              <p>Use this address for delivery issues, account concerns, and escalations.</p>
            </div>

            <div className="support-card">
              <p className="card-label">Expected response</p>
              <h3>Within one business day</h3>
              <p>Urgent active-order issues should be marked clearly in the subject line.</p>
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
