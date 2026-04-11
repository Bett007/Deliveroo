import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, resendVerificationCode, verifyRegistration } from "../features/auth/authSlice";

export function VerifyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, fieldErrors, resendStatus, verificationCode, verificationEmail, verificationExpiresAt, verifyStatus } = useSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const [clientError, setClientError] = useState("");
  const email = location.state?.email || verificationEmail || "";

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthError());

    if (!/^\d{6}$/.test(code)) {
      setClientError("Enter the 6-digit verification code sent to your email.");
      return;
    }

    const result = await dispatch(verifyRegistration({ email, code }));

    if (verifyRegistration.fulfilled.match(result)) {
      navigate("/login", {
        replace: true,
        state: {
          message: result.payload.message,
        },
      });
    }
  }

  async function handleResend() {
    if (!email) {
      return;
    }

    dispatch(clearAuthError());
    await dispatch(resendVerificationCode({ email }));
  }

  return (
    <section className="auth-page">
      <div className="auth-card glass-card verification-card">
        <Link to="/register" className="back-link">
          <span className="back-link-icon" aria-hidden="true">&lt;</span>
          <span>Back to Register</span>
        </Link>

        <div className="auth-header">
          <h1>Two-Step Verification</h1>
          <p>Enter the verification code for {email || "your account"} to finish setup.</p>
          {verificationCode ? <p className="helper-text">Demo verification code: <strong>{verificationCode}</strong></p> : null}
          {verificationExpiresAt ? <p className="helper-text">This code expires at {new Date(verificationExpiresAt).toLocaleString()}.</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
          {clientError ? <p className="form-status error">{clientError}</p> : null}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="verification-code" label="Verification Code" error={fieldErrors.code?.[0]}>
            <input
              id="verification-code"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                setClientError("");
              }}
            />
          </FormField>

          <Button type="submit" className="primary-btn full-width" disabled={verifyStatus === "loading"}>
            {verifyStatus === "loading" ? "Verifying..." : "Verify Account"}
          </Button>

          <Button
            type="button"
            className="secondary-btn full-width"
            disabled={!email || resendStatus === "loading"}
            onClick={handleResend}
          >
            {resendStatus === "loading" ? "Generating New Code..." : "Resend Code"}
          </Button>
        </form>
      </div>
    </section>
  );
}
