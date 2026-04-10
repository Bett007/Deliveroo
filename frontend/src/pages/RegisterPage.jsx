import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, registerUser } from "../features/auth/authSlice";
import { validateRegisterForm } from "../features/auth/authValidators";

const SIGNUP_PLACEHOLDER_IMAGE = "https://share.google/gklfk3Y9DNGtZGJmm";

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, error, fieldErrors, verificationEmail } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    agree: false,
  });
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 9)
            : value,
    }));

    setClientErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedPhone = `+254${formData.phone}`;
    const validationErrors = {
      ...validateRegisterForm({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }),
    };

    if (!formData.fullName.trim()) {
      validationErrors.fullName = "Full name is required.";
    }

    if (!/^\+254\d{9}$/.test(normalizedPhone)) {
      validationErrors.phone = "Use a valid Kenya phone number starting with +254.";
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agree) {
      validationErrors.agree = "You must accept the terms to continue.";
    }

    if (Object.keys(validationErrors).length) {
      setClientErrors(validationErrors);
      return;
    }

    const result = await dispatch(
      registerUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }),
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify", {
        replace: true,
        state: { email: result.payload.user.email },
      });
    }
  }

  return (
    <section className="auth-screen auth-screen-signup">
      <div className="auth-screen-shell signup-shell">
        <div className="auth-screen-form-panel light-panel">
          <div className="auth-top-links">
            <Link to="/login" className="auth-pill">SIGN IN</Link>
            <span className="auth-pill active">SIGN UP</span>
          </div>

          <div className="auth-logo-wrap small-logo-wrap">
            <img src={deliverooLogoFull} alt="Deliveroo" className="auth-screen-logo" />
          </div>

          <div className="visual-copy-block dark-copy-block compact-copy-block">
            <h1>Create Your Account</h1>
            <p>Join our community today.</p>
            {error ? <p className="form-status error">{error}</p> : null}
            {verificationEmail ? <p className="helper-text">Verification will continue for {verificationEmail} after registration.</p> : null}
          </div>

          <form className="auth-screen-form" onSubmit={handleSubmit}>
            <div className="form-grid-two">
              <FormField id="register-name" label="Full Name" error={clientErrors.fullName}>
                <input id="register-name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="auth-input" />
              </FormField>

              <FormField id="register-email" label="Email Address" error={clientErrors.email || fieldErrors.email?.[0]}>
                <input id="register-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="auth-input" />
              </FormField>
            </div>

            <FormField id="register-phone" label="Phone Number" error={clientErrors.phone}>
              <div className="phone-input-shell">
                <div className="phone-prefix-box" aria-hidden="true">
                  <span className="kenya-flag-badge">
                    <span className="kenya-flag-stripe kenya-flag-black"></span>
                    <span className="kenya-flag-stripe kenya-flag-white"></span>
                    <span className="kenya-flag-stripe kenya-flag-red"></span>
                    <span className="kenya-flag-stripe kenya-flag-white"></span>
                    <span className="kenya-flag-stripe kenya-flag-green"></span>
                  </span>
                  <span className="phone-prefix-code">+254</span>
                </div>
                <input
                  id="register-phone"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="712 345 678"
                  className="auth-input phone-number-input"
                />
              </div>
            </FormField>

            <div className="role-chip-row">
              <button type="button" className={`role-chip ${formData.role === "customer" ? "active" : ""}`} onClick={() => setFormData((current) => ({ ...current, role: "customer" }))}>Customer</button>
              <button type="button" className={`role-chip ${formData.role === "rider" ? "active" : ""}`} onClick={() => setFormData((current) => ({ ...current, role: "rider" }))}>Rider</button>
              <button type="button" className={`role-chip ${formData.role === "admin" ? "active" : ""}`} onClick={() => setFormData((current) => ({ ...current, role: "admin" }))}>Admin</button>
            </div>
            {clientErrors.role || fieldErrors.role?.[0] ? <p className="field-error">{clientErrors.role || fieldErrors.role?.[0]}</p> : null}

            <div className="form-grid-two">
              <FormField id="register-password" label="Create Password" error={clientErrors.password || fieldErrors.password?.[0]}>
                <input id="register-password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="auth-input" />
              </FormField>

              <FormField id="register-confirm-password" label="Confirm Password" error={clientErrors.confirmPassword}>
                <input id="register-confirm-password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="auth-input" />
              </FormField>
            </div>

            <label className="terms-row">
              <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />
              <span>I agree to the Terms &amp; Conditions and Privacy Policy.</span>
            </label>
            {clientErrors.agree ? <p className="field-error">{clientErrors.agree}</p> : null}

            <Button type="submit" className="primary-btn auth-submit-btn light-submit-btn full-width" disabled={registerStatus === "loading"}>
              {registerStatus === "loading" ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="auth-footer-note light-footer">Already have an account? <Link to="/login" className="accent-link">[Sign In]</Link></p>
        </div>

        <div className="auth-screen-visual light-visual">
          <figure className="scene-image-card scene-image-card-light">
            <img src={SIGNUP_PLACEHOLDER_IMAGE} alt="Deliveroo delivery placeholder" className="scene-image" />
          </figure>
        </div>
      </div>
    </section>
  );
}
