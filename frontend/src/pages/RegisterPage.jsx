import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../assets/deliveroo-logo-full.svg";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { clearAuthError, registerUser } from "../features/auth/authSlice";
import { validateRegisterForm } from "../features/auth/authValidators";
import styles from "./AuthPages.module.css";

const initialFormData = {
  email: "",
  password: "",
  role: "customer",
};

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, error, fieldErrors, verificationEmail } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialFormData);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setClientErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length) {
      setClientErrors(validationErrors);
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify", {
        replace: true,
        state: { email: result.payload.user.email },
      });
    }
  }

  return (
    <section className={`auth-page auth-page-split ${styles.scope}`}>
      <div className="auth-card auth-card-wide glass-card">
        <div className="auth-content-grid reverse-layout">
          <PlaceholderArtwork
            variant="customer"
            label="New Account"
            title="Start with the workspace you need"
            caption="Customers place parcels, riders accept routes, admins coordinate the floor."
          />

          <div className="auth-panel">
            <img src={deliverooLogoFull} alt="Deliveroo Courier Service" className="auth-form-logo" />
            <div className="auth-header">
              <p className="eyebrow">Create Access</p>
              <h1>Create your account</h1>
              <p>Pick a role and verify your email to continue.</p>
              {error ? <p className="form-status error">{error}</p> : null}
              {verificationEmail ? <p className="helper-text">Verification will continue for {verificationEmail} after registration.</p> : null}
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <FormField id="register-email" label="Email Address" error={clientErrors.email || fieldErrors.email?.[0]}>
                <input id="register-email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </FormField>

              <FormField id="register-password" label="Password" error={clientErrors.password || fieldErrors.password?.[0]}>
                <input id="register-password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
              </FormField>

              <FormField id="register-role" label="Account Type" error={clientErrors.role || fieldErrors.role?.[0]}>
                <select id="register-role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                  <option value="customer">Customer</option>
                  <option value="rider">Rider</option>
                  <option value="admin">Admin</option>
                </select>
              </FormField>

              <Button type="submit" className="primary-btn full-width" disabled={registerStatus === "loading"}>
                {registerStatus === "loading" ? "Creating Account..." : "Register"}
              </Button>
            </form>

            <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}
