import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { validateLoginForm } from "../features/auth/authValidators";

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
    <section className="auth-page auth-page-split">
      <div className="auth-card auth-card-wide glass-card">
        <div className="auth-content-grid">
          <div className="auth-panel">
            <div className="auth-header">
              <p className="eyebrow">Sign In First</p>
              <h1>Access your role-specific workspace</h1>
              <p>Admins go to the operations portal. Customers and riders go to the parcel workspace.</p>
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
            label="Auth Preview"
            title="A clean sign-in surface ready for real photography"
            caption="This placeholder block can later hold branded delivery photography, rider portraits, or onboarding illustrations."
          />
        </div>
      </div>
    </section>
  );
}
