import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError } from "../features/auth/authSlice";
import { validateResetPasswordForm } from "../features/auth/authValidators";
import { resetPasswordRequest } from "../services/api/authApi";
import styles from "./AuthPages.module.css";

export function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    code: location.state?.code || "",
    new_password: "",
    confirm_password: "",
  });
  const [clientErrors, setClientErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateResetPasswordForm(formData);
    if (Object.keys(validationErrors).length) {
      setClientErrors(validationErrors);
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const response = await resetPasswordRequest({
        email: formData.email.trim(),
        code: formData.code.trim(),
        new_password: formData.new_password,
      });
      navigate("/login", { replace: true, state: { message: response.message } });
    } catch (requestError) {
      setStatus("failed");
      setError(requestError?.message || "Unable to reset password right now.");
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
              <Link to="/login" className="back-link">
                <span className="back-link-icon" aria-hidden="true">&lt;</span>
                <span>Back to sign in</span>
              </Link>
            </div>

            <div className="auth-header">
              <p className="eyebrow">Set New Password</p>
              <h1>Reset password</h1>
              <p>Use the reset code sent to your email to set a new password.</p>
              {error ? <p className="form-status error">{error}</p> : null}
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <FormField id="reset-email" label="Email Address" error={clientErrors.email}>
                <input id="reset-email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </FormField>

              <FormField id="reset-code" label="Reset Code" error={clientErrors.code}>
                <input id="reset-code" name="code" inputMode="numeric" placeholder="6-digit code" value={formData.code} onChange={handleChange} />
              </FormField>

              <FormField id="new-password" label="New Password" error={clientErrors.new_password}>
                <input id="new-password" name="new_password" type="password" placeholder="Enter new password" value={formData.new_password} onChange={handleChange} />
              </FormField>

              <FormField id="confirm-password" label="Confirm Password" error={clientErrors.confirm_password}>
                <input id="confirm-password" name="confirm_password" type="password" placeholder="Confirm new password" value={formData.confirm_password} onChange={handleChange} />
              </FormField>

              <Button type="submit" className="primary-btn full-width" disabled={status === "loading"}>
                {status === "loading" ? "Resetting password..." : "Reset password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

