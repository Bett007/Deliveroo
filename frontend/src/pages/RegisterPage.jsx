import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-card glass-card">
        <Link to="/" className="back-link">
          <span className="back-link-icon" aria-hidden="true">
            &lt;
          </span>
          <span>Back to Home</span>
        </Link>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the Deliveroo operations platform and manage deliveries.</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
          </div>

          <button type="submit" className="primary-btn full-width">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
