import { AppIcon } from "./AppIcon";
import styles from "./AuthValuePanel.module.css";

export function AuthValuePanel({ label, title, description, items, tone = "customer", imageSrc, imageAlt }) {
  return (
    <aside className={`auth-value-panel auth-value-panel-${tone} ${styles.scope}`} aria-label={label}>
      <div className="auth-value-shell glass-card">
        {imageSrc ? (
          <div className="auth-value-media">
            <img src={imageSrc} alt={imageAlt} className="auth-value-image" />
          </div>
        ) : null}

        <div className="auth-value-hero">
          <span className="auth-value-pill">{label}</span>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <div className="auth-value-grid">
          {items.map((item) => (
            <article key={item.title} className="auth-value-card">
              <span className="auth-value-icon" aria-hidden="true">
                <AppIcon name={item.icon} size={20} />
              </span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
