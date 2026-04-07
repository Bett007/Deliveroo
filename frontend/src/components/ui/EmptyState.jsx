export function EmptyState({ title, description, action }) {
  return (
    <div className="glass-card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
