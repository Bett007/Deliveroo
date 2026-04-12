import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, updateProfile } from "../features/auth/authSlice";
import styles from "./ProfilePage.module.css";

function getInitials(user) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const email = user?.email?.trim()?.[0];
  return `${first || email || "U"}${last || ""}`.toUpperCase();
}

export function ProfilePage() {
  const dispatch = useDispatch();
  const { error, fieldErrors, profileStatus, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    avatar_url: user?.avatar_url || "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      avatar_url: user?.avatar_url || "",
    });
  }, [user]);

  const displayName = useMemo(() => {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    return name || user?.email || "Profile";
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, avatar_url: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await dispatch(updateProfile(formData));
  }

  return (
    <section className={`workspace-page ops-page profile-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{displayName}</h1>
          <p className="workspace-copy">Avatar, contact, account details.</p>
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <span className="user-chip">{user?.role || "user"}</span>
      </header>

      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-avatar">
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="" />
            ) : (
              <span>{getInitials(user)}</span>
            )}
          </div>
          <h2>{displayName}</h2>
          <p>{user?.email}</p>
          <label className="secondary-btn avatar-upload-btn">
            Upload Photo
            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </section>

        <section className="workspace-panel profile-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid-two">
              <FormField id="first-name" label="First Name" error={fieldErrors.first_name?.[0]}>
                <input id="first-name" name="first_name" value={formData.first_name} onChange={handleChange} />
              </FormField>

              <FormField id="last-name" label="Last Name" error={fieldErrors.last_name?.[0]}>
                <input id="last-name" name="last_name" value={formData.last_name} onChange={handleChange} />
              </FormField>
            </div>

            <FormField id="phone" label="Phone" error={fieldErrors.phone?.[0]}>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254..." />
            </FormField>

            <div className="profile-facts">
              <span><strong>Email</strong>{user?.email}</span>
              <span><strong>Role</strong>{user?.role}</span>
            </div>

            <Button type="submit" className="primary-btn full-width" disabled={profileStatus === "loading"}>
              {profileStatus === "loading" ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </section>
      </div>
    </section>
  );
}
