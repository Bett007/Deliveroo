import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError } from "../features/auth/authSlice";
import { validateForgotPasswordForm } from "../features/auth/authValidators";
import { forgotPasswordRequest } from "../services/api/authApi";
import styles from "./AuthPages.module.css";

export function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [clientErrors, setClientErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState("");

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
    const validationErrors = validateForgotPasswordForm(formData);
    if (Object.keys(validationErrors).length) {
      setClientErrors(validationErrors);
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const response = await forgotPasswordRequest({ email: formData.email.trim() });
      setResetCode(response.reset?.code || "");
      setStatus("succeeded");
    } catch (requestError) {
      setStatus("failed");
      setError(requestError?.message || "Unable to process password reset request.");
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
              <p className="eyebrow">Reset Access</p>
              <h1>Forgot password</h1>
              <p>Enter your email and we will generate a reset code.</p>
              {error ? <p className="form-status error">{error}</p> : null}
              {status === "succeeded" ? (
                <p className="form-status success">Reset code generated. Continue to set a new password.</p>
              ) : null}
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <FormField id="forgot-email" label="Email Address" error={clientErrors.email}>
                <input id="forgot-email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </FormField>

              <Button type="submit" className="primary-btn full-width" disabled={status === "loading"}>
                {status === "loading" ? "Generating code..." : "Generate reset code"}
              </Button>
            </form>

            {status === "succeeded" ? (
              <div className="form-status success">
                {resetCode ? <p>Demo reset code: <strong>{resetCode}</strong></p> : null}
                <Button
                  type="button"
                  className="secondary-btn full-width"
                  onClick={() => navigate("/reset-password", { state: { email: formData.email.trim(), code: resetCode } })}
                >
                  Continue to reset password
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

