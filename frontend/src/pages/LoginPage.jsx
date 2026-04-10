import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, loginUser } from "../features/auth/authSlice";
import { validateLoginForm } from "../features/auth/authValidators";

const SIGNIN_PLACEHOLDER_IMAGE = "https://share.google/BJQShXRk9Ue3HxzWh";

function nextRoute(role) {
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
      navigate(nextRoute(user.role), { replace: true });
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
      navigate(nextRoute(result.payload.user.role), { replace: true });
    }
  }

  return (
    <section className="auth-screen auth-screen-signin">
      <div className="auth-screen-shell signin-shell">
        <div className="auth-screen-visual dark-visual">
          <div className="auth-logo-wrap">
            <img src={deliverooLogoFull} alt="Deliveroo" className="auth-screen-logo" />
          </div>
          <figure className="scene-image-card">
            <img src={SIGNIN_PLACEHOLDER_IMAGE} alt="Deliveroo support team placeholder" className="scene-image" />
            <figcaption className="support-name-tag">Njeri M.</figcaption>
          </figure>
          <div className="visual-copy-block light-copy-block">
            <h1>Welcome Back, User!</h1>
            <p>Enter your details to access your account.</p>
          </div>
        </div>

        <div className="auth-screen-form-panel dark-panel">
          <div className="auth-top-links">
            <span className="auth-pill active">SIGN IN</span>
            <Link to="/register" className="auth-pill">SIGN UP</Link>
          </div>

          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}

          <form className="auth-screen-form" onSubmit={handleSubmit}>
            <FormField id="login-email" label="Email Address" error={clientErrors.email || fieldErrors.email?.[0]}>
              <input id="login-email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="auth-input auth-input-dark" />
            </FormField>

            <FormField id="login-password" label="Password" error={clientErrors.password || fieldErrors.password?.[0]}>
              <input id="login-password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="auth-input auth-input-dark" />
            </FormField>

            <div className="auth-inline-end-row">
              <button type="button" className="text-link dark-link">Forgot Password?</button>
            </div>

            <div className="social-auth-row">
              <button type="button" className="social-auth-btn">Google</button>
              <button type="button" className="social-auth-btn">Apple</button>
              <button type="button" className="social-auth-btn">Facebook</button>
            </div>

            <Button type="submit" className="primary-btn auth-submit-btn full-width" disabled={status === "loading"}>
              {status === "loading" ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="auth-footer-note">New to Deliveroo? <Link to="/register" className="accent-link">[Sign Up Now]</Link></p>
        </div>
      </div>
    </section>
  );
}
