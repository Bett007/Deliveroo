import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, registerUser } from "../features/auth/authSlice";

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

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/verify", {
        replace: true,
        state: { email: result.payload.user.email },
      });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card glass-card">
        <Link to="/" className="back-link">
          <span className="back-link-icon" aria-hidden="true">&lt;</span>
          <span>Back to Home</span>
        </Link>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the Deliveroo operations platform and manage deliveries.</p>
          {error ? <p className="form-status error">{error}</p> : null}
          {verificationEmail ? <p className="helper-text">Verification will continue for {verificationEmail} after registration.</p> : null}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="register-email" label="Email Address" error={fieldErrors.email?.[0]}>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="register-password" label="Password" error={fieldErrors.password?.[0]}>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="register-role" label="Account Type" error={fieldErrors.role?.[0]}>
            <select id="register-role" name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
          </FormField>

          <Button type="submit" className="primary-btn full-width" disabled={registerStatus === "loading"}>
            {registerStatus === "loading" ? "Creating Account..." : "Register"}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
