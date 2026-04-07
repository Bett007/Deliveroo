export function SectionCard({ title, description, children, action }) {
  return (
    <section className="glass-card workspace-panel">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
