import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import authCourierImage from "../assets/images/auth-courier.jpg";
import { Button } from "../components/ui/Button";
import { AuthValuePanel } from "../components/ui/AuthValuePanel";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { validateLoginForm } from "../features/auth/authValidators";
import styles from "./AuthPages.module.css";

const authHighlights = [
  {
    icon: "package",
    title: "For customers",
    description: "Create parcel orders, track deliveries, and get help quickly when something changes.",
  },
  {
    icon: "rider",
    title: "For riders",
    description: "Check assigned deliveries, follow route details, and keep updates moving smoothly.",
  },
];

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
            <img src={deliverooLogoFull} alt="Deliveroo Courier Service" className="auth-form-logo" />
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

          <AuthValuePanel
            label="Why Deliveroo"
            title="One sign-in, the right experience"
            description="Use one secure account to place orders, track deliveries, or manage assigned delivery work."
            items={authHighlights}
            tone="customer"
            imageSrc={authCourierImage}
            imageAlt="Customer confirming a parcel delivery on a phone"
          />
        </div>
      </div>
    </section>
  );
}
