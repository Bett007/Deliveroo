import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { validateLoginForm } from "../features/auth/authValidators";
import styles from "./AuthPages.module.css";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, fieldErrors, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user?.role === "rider") {
      navigate("/rider/dashboard", { replace: true });
    } else if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length) {
      setClientErrors(validationErrors);
      return;
    }

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "rider") {
        navigate("/rider/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }

  return (
    <section className={`auth-page auth-page-split ${styles.scope}`}>
      <div className="auth-card auth-card-wide glass-card">
        <div className="auth-content-grid">
          <div className="auth-panel">
            <div className="auth-home-link-row">
              <Link to="/" aria-label="Deliveroo home">
                <img src={deliverooLogoFull} alt="Deliveroo Courier Service" className="auth-form-logo" />
              </Link>
              <Link to="/" className="back-link">
                <span className="back-link-icon" aria-hidden="true">&lt;</span>
                <span>Return to home</span>
              </Link>
            </div>
            <div className="auth-header">
              <p className="eyebrow">Sign In First</p>
              <h1>Welcome back</h1>
              <p>Sign in once and continue with the tools that match your role.</p>
              {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
              {error ? <p className="form-status error">{error}</p> : null}
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <FormField id="login-email" label="Email Address" error={clientErrors.email || fieldErrors.email?.[0]}>
                <input id="login-email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </FormField>

              <FormField id="login-password" label="Password" error={clientErrors.password || fieldErrors.password?.[0]}>
                <input id="login-password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              </FormField>

              <Button type="submit" className="primary-btn full-width" disabled={status === "loading"}>
                {status === "loading" ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="auth-footer">Need an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}
