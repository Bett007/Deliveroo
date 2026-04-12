import styles from "./StatusBadge.module.css";

export function StatusBadge({ children }) {
  return <span className={`status-badge ${styles.scope}`}>{children}</span>;
}
