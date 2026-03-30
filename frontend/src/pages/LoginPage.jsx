import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue managing orders and deliveries.</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className="primary-btn full-width">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}