import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, fieldErrors, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else if (user) {
      navigate("/orders", { replace: true });
    }
  }, [navigate, user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(role === "admin" ? "/dashboard" : "/orders", { replace: true });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card glass-card">
        <Link to="/" className="back-link">
          <span className="back-link-icon" aria-hidden="true">&lt;</span>
          <span>Back to Home</span>
        </Link>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue managing orders and deliveries.</p>
          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="login-email" label="Email Address" error={fieldErrors.email?.[0]}>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="login-password" label="Password" error={fieldErrors.password?.[0]}>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormField>

          <Button type="submit" className="primary-btn full-width" disabled={status === "loading"}>
            {status === "loading" ? "Signing In..." : "Login"}
          </Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
