import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-card">
      <h1>Page not found</h1>
      <p>The route you tried does not exist yet.</p>
      <Link to="/">Back to home</Link>
    </section>
  );
}
