import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import deliverooLogoFull from "../../assets/deliveroo-logo-full.svg";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { clearAuthError, loginUser, registerUser } from "../../features/auth/authSlice";
import { validateLoginForm, validateRegisterForm } from "../../features/auth/authValidators";

const initialRegisterForm = {
  fullName: "",
  email: "",
  phone: "+254",
  password: "",
  confirmPassword: "",
  role: "customer",
  agree: false,
};

function getNextRouteForRole(role) {
  if (role === "admin") {
    return "/dashboard";
  }

  if (role === "rider") {
    return "/rider";
  }

  return "/orders";
}

function SocialButton({ label }) {
  return <button type="button" className="social-auth-btn">{label}</button>;
}

function RoleOption({ value, currentValue, onChange, children }) {
  const isActive = currentValue === value;

  return (
    <button
      type="button"
      className={`role-chip ${isActive ? "active" : ""}`}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
}

export function CombinedAuthPanel({ activeMode = "signin" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, registerStatus, error, fieldErrors, verificationEmail, user } = useSelector((state) => state.auth);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate(getNextRouteForRole(user.role), { replace: true });
    }
  }, [navigate, user]);

  const authPanels = useMemo(
    () => ({
      signin: {
        title: "Welcome Back, User!",
        subtitle: "Enter your details to access your account.",
      },
      signup: {
        title: "Create Your Account",
        subtitle: "Join our community today.",
      },
    }),
    [],
  );

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
    setLoginErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleRegisterChange(event) {
    const { name, value, type, checked } = event.target;
    setRegisterForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setRegisterErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLoginForm(loginForm);

    if (Object.keys(validationErrors).length) {
      setLoginErrors(validationErrors);
      return;
    }

    const result = await dispatch(loginUser(loginForm));

    if (loginUser.fulfilled.match(result)) {
      navigate(getNextRouteForRole(result.payload.user.role), { replace: true });
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    const validationErrors = {
      ...validateRegisterForm({
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
      }),
    };

    if (!registerForm.fullName.trim()) {
      validationErrors.fullName = "Full name is required.";
    }

    if (!/^\+254\d{9}$/.test(registerForm.phone.replace(/\s+/g, ""))) {
      validationErrors.phone = "Use a valid Kenya phone number starting with +254.";
    }

    if (!registerForm.confirmPassword) {
      validationErrors.confirmPassword = "Confirm your password.";
    } else if (registerForm.confirmPassword !== registerForm.password) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (!registerForm.agree) {
      validationErrors.agree = "You must accept the terms to continue.";
    }

    if (Object.keys(validationErrors).length) {
      setRegisterErrors(validationErrors);
      return;
    }

    const result = await dispatch(
      registerUser({
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
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
    <section className="auth-ecosystem-page">
      <div className="auth-ecosystem-shell">
        <div className="auth-segmented-header glass-card">
          <div className="auth-brand-lockup">
            <img src={deliverooLogoFull} alt="Deliveroo" className="auth-brand-logo" />
          </div>
          <div className="auth-segmented-control">
            <Link to="/login" className={`auth-segment ${activeMode === "signin" ? "active" : ""}`}>
              SIGN IN
            </Link>
            <Link to="/register" className={`auth-segment ${activeMode === "signup" ? "active" : ""}`}>
              SIGN UP
            </Link>
          </div>
        </div>

        <div className="auth-ecosystem-panels glass-card">
          <section className={`auth-panel auth-panel-dark ${activeMode === "signin" ? "active" : "inactive"}`}>
            <div className="auth-visual-card support-visual-card">
              <div className="support-photo-scene">
                <div className="support-avatar"></div>
                <div className="support-monitor"></div>
                <div className="support-desk"></div>
                <div className="support-badge">Njeri M.</div>
              </div>
            </div>

            <div className="auth-copy-block">
              <h2>{authPanels.signin.title}</h2>
              <p>{authPanels.signin.subtitle}</p>
              {activeMode === "signin" && error ? <p className="form-status error">{error}</p> : null}
            </div>

            <form className="auth-reference-form" onSubmit={handleLoginSubmit}>
              <FormField id="signin-email" label="Email Address" error={loginErrors.email || fieldErrors.email?.[0]}>
                <input id="signin-email" name="email" type="email" value={loginForm.email} onChange={handleLoginChange} placeholder="Email Address" className="auth-input auth-input-dark" />
              </FormField>

              <FormField id="signin-password" label="Password" error={loginErrors.password || fieldErrors.password?.[0]}>
                <input id="signin-password" name="password" type="password" value={loginForm.password} onChange={handleLoginChange} placeholder="Password" className="auth-input auth-input-dark" />
              </FormField>

              <div className="auth-inline-row auth-inline-end">
                <button type="button" className="text-link dark-link">Forgot Password?</button>
              </div>

              <div className="social-auth-row">
                <SocialButton label="Google" />
                <SocialButton label="Apple" />
                <SocialButton label="Facebook" />
              </div>

              <Button type="submit" className="primary-btn auth-submit-btn" disabled={status === "loading"}>
                {status === "loading" ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="auth-footer-note">New to Deliveroo? <Link to="/register" className="accent-link">[Sign Up Now]</Link></p>
          </section>

          <section className={`auth-panel auth-panel-light ${activeMode === "signup" ? "active" : "inactive"}`}>
            <div className="auth-visual-card delivery-visual-card">
              <div className="delivery-scene">
                <div className="delivery-rider"></div>
                <div className="delivery-customer"></div>
                <div className="delivery-package">
                  <span>DELIVEROO</span>
                  <span>CUSTOMER</span>
                </div>
              </div>
            </div>

            <div className="auth-copy-block light-copy">
              <h2>{authPanels.signup.title}</h2>
              <p>{authPanels.signup.subtitle}</p>
              {activeMode === "signup" && error ? <p className="form-status error">{error}</p> : null}
              {verificationEmail ? <p className="helper-text">Verification will continue for {verificationEmail} after registration.</p> : null}
            </div>

            <form className="auth-reference-form" onSubmit={handleRegisterSubmit}>
              <div className="form-grid-two">
                <FormField id="signup-name" label="Full Name" error={registerErrors.fullName}>
                  <input id="signup-name" name="fullName" value={registerForm.fullName} onChange={handleRegisterChange} placeholder="Full Name" className="auth-input" />
                </FormField>

                <FormField id="signup-email" label="Email Address" error={registerErrors.email || fieldErrors.email?.[0]}>
                  <input id="signup-email" name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="Email Address" className="auth-input" />
                </FormField>
              </div>

              <FormField id="signup-phone" label="Phone Number" error={registerErrors.phone}>
                <input id="signup-phone" name="phone" value={registerForm.phone} onChange={handleRegisterChange} placeholder="+254 712 345 678" className="auth-input" />
              </FormField>

              <div className="role-chip-row">
                <RoleOption value="customer" currentValue={registerForm.role} onChange={(value) => setRegisterForm((current) => ({ ...current, role: value }))}>Customer</RoleOption>
                <RoleOption value="rider" currentValue={registerForm.role} onChange={(value) => setRegisterForm((current) => ({ ...current, role: value }))}>Rider</RoleOption>
                <RoleOption value="admin" currentValue={registerForm.role} onChange={(value) => setRegisterForm((current) => ({ ...current, role: value }))}>Admin</RoleOption>
              </div>
              {registerErrors.role || fieldErrors.role?.[0] ? <p className="field-error">{registerErrors.role || fieldErrors.role?.[0]}</p> : null}

              <div className="form-grid-two">
                <FormField id="signup-password" label="Create Password" error={registerErrors.password || fieldErrors.password?.[0]}>
                  <input id="signup-password" name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="Create Password" className="auth-input" />
                </FormField>

                <FormField id="signup-confirm-password" label="Confirm Password" error={registerErrors.confirmPassword}>
                  <input id="signup-confirm-password" name="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={handleRegisterChange} placeholder="Confirm Password" className="auth-input" />
                </FormField>
              </div>

              <label className="terms-row">
                <input type="checkbox" name="agree" checked={registerForm.agree} onChange={handleRegisterChange} />
                <span>I agree to the Terms &amp; Conditions and Privacy Policy.</span>
              </label>
              {registerErrors.agree ? <p className="field-error">{registerErrors.agree}</p> : null}

              <Button type="submit" className="primary-btn auth-submit-btn light-submit-btn" disabled={registerStatus === "loading"}>
                {registerStatus === "loading" ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="auth-footer-note light-footer">Already have an account? <Link to="/login" className="accent-link">[Sign In]</Link></p>
          </section>
        </div>
      </div>
    </section>
  );
}
