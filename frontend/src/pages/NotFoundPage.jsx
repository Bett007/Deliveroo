import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <section className={`notfound-page ${styles.scope}`}>
      <div className="glass-card notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you’re looking for does not exist or was moved.</p>
        <Link to="/" className="primary-btn">
          Go Home
        </Link>
      </div>
    </section>
  );
}
