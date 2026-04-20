import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import supportVisual from "../assets/images/parcel-support.jpg";
import { AppIcon } from "../components/ui/AppIcon";
import styles from "./HelpPage.module.css";

const helpTopics = [
  {
    icon: "clock",
    title: "Order delays",
    description: "Order number, destination, current status.",
  },
  {
    icon: "shield",
    title: "Account and access issues",
    description: "Email, role, sign-in or verification step.",
  },
  {
    icon: "wallet",
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
  const [selectedTopic, setSelectedTopic] = useState(helpTopics[0]);
  const [activePane, setActivePane] = useState("issue");
  const supportHref = useMemo(() => {
    const subject = encodeURIComponent(`Deliveroo Support: ${selectedTopic.title}`);
    const body = encodeURIComponent(
      `Issue type: ${selectedTopic.title}\n\nWhat happened:\n\nOrder or parcel reference:\n\nWhat help do you need next:\n`,
    );

    return `mailto:support@deliveroo-app.com?subject=${subject}&body=${body}`;
  }, [selectedTopic]);

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
            href={supportHref}
          >
            <AppIcon name="support" size={18} />
            Email Support
          </a>
        </div>
      </header>

      <section className="workspace-panel panel-toggle-bar">
        <div className="panel-toggle-actions" role="tablist" aria-label="Help views">
          <button type="button" className={`panel-toggle-btn ${activePane === "issue" ? "active" : ""}`} onClick={() => setActivePane("issue")}>Choose Issue</button>
          <button type="button" className={`panel-toggle-btn ${activePane === "contact" ? "active" : ""}`} onClick={() => setActivePane("contact")}>Contact</button>
        </div>
      </section>

      <div className="help-layout-grid single-pane-layout">
        {activePane === "issue" ? (
        <section className="glass-card workspace-panel help-issue-panel">
          <div className="section-header">
            <div>
              <h2>Choose your issue</h2>
              <p>Pick one, then send your note.</p>
            </div>
          </div>

          <div className="help-topic-list">
            {helpTopics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                className={`feature-item help-item compact-help-item help-topic-button ${selectedTopic.title === topic.title ? "active" : ""}`}
                onClick={() => setSelectedTopic(topic)}
              >
                <span className="help-icon" aria-hidden="true">
                  <AppIcon name={topic.icon} size={18} />
                </span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </button>
            ))}
          </div>
        </section>
        ) : null}

        {activePane === "contact" ? (
        <section className="glass-card workspace-panel help-contact-panel">
          <div className="section-header">
            <div>
              <h2>Contact</h2>
              <p>Choose an issue and open a ready-to-send support message.</p>
            </div>
          </div>

          <div className="support-card-stack compact-support-stack">
            <div className="support-card">
              <p className="card-label">Selected issue</p>
              <h3>{selectedTopic.title}</h3>
              <p>{selectedTopic.description}</p>
            </div>

            <a className="support-card support-card-link" href={supportHref}>
              <p className="card-label">Open support draft</p>
              <h3>support@deliveroo-app.com</h3>
              <p>Open a prefilled message for this issue.</p>
            </a>

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
              <img
                src={supportVisual}
                alt="Courier handing a parcel to a customer during support handoff"
                className="support-illustration"
              />
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
        ) : null}
      </div>
    </section>
  );
}
