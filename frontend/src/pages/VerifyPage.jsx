import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { completeVerificationStep } from "../features/auth/authSlice";

export function VerifyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationEmail } = useSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code sent to your email.");
      return;
    }

    dispatch(completeVerificationStep());
    navigate("/login", {
      replace: true,
      state: {
        message: "Verification step complete. You can sign in now.",
      },
    });
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
          <p>Enter the verification code for {location.state?.email || verificationEmail || "your account"} to finish setup.</p>
          <p className="helper-text">This frontend step is ready for the backend verification endpoint when the team adds it.</p>
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="verification-code" label="Verification Code">
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
                setError("");
              }}
            />
          </FormField>

          <Button type="submit" className="primary-btn full-width">
            Verify Account
          </Button>
        </form>
      </div>
    </section>
  );
}
