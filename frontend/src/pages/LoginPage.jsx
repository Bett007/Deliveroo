import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { validateLoginForm } from "../features/auth/authValidators";

function getRoleRoute(role) {
  if (role === "admin") return "/dashboard";
  if (role === "rider") return "/rider";
  return "/orders";
}

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
    if (user) {
      navigate(getRoleRoute(user.role), { replace: true });
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
      navigate(getRoleRoute(result.payload.user.role), { replace: true });
    }
  }

  return (
    <section className="auth-page auth-page-split">
      <div className="auth-card auth-card-wide glass-card">
        <div className="auth-content-grid">
          <div className="auth-panel">
            <img src={deliverooLogoFull} alt="Deliveroo Courier Service" className="auth-form-logo" />
            <div className="auth-header">
              <p className="eyebrow">Sign In First</p>
              <h1>Welcome back</h1>
              <p>One sign-in, the right workspace.</p>
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

          <PlaceholderArtwork
            variant="auth"
            label="Fast Access"
            title="Dispatch, delivery, and tracking in one place"
            caption="Sign in to continue from the exact role your account belongs to."
          />
        </div>
      </div>
    </section>
  );
}
