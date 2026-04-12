import styles from "./EmptyState.module.css";

export function EmptyState({ title, description, action }) {
  return (
    <div className={`glass-card empty-state ${styles.scope}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
