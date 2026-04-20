import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearAuthError, updateProfile } from "../features/auth/authSlice";
import styles from "./ProfilePage.module.css";

const MAX_AVATAR_DIMENSION = 640;
const MAX_AVATAR_BASE64_LENGTH = 1_500_000;

function getInitials(user) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const email = user?.email?.trim()?.[0];
  return `${first || email || "U"}${last || ""}`.toUpperCase();
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read selected image."));
      image.src = String(reader.result || "");
    };
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
}

function canvasToJpegDataUrl(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not process selected image."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not process selected image."));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function optimizeAvatarToDataUrl(file) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process selected image.");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const qualities = [0.85, 0.75, 0.65, 0.55];
  for (const quality of qualities) {
    const dataUrl = await canvasToJpegDataUrl(canvas, quality);
    if (dataUrl.length <= MAX_AVATAR_BASE64_LENGTH) {
      return dataUrl;
    }
  }

  throw new Error("Selected image is too large. Please choose a smaller image.");
}

export function ProfilePage() {
  const dispatch = useDispatch();
  const { error, fieldErrors, profileStatus, user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });
  const [avatarDraft, setAvatarDraft] = useState(user?.avatar_url || "");
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [avatarClientError, setAvatarClientError] = useState("");
  const [activePane, setActivePane] = useState("profile");
  const isSaving = profileStatus === "loading";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    setProfileData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
    });
  }, [user?.id]);

  useEffect(() => {
    if (!isAvatarDirty) {
      setAvatarDraft(user?.avatar_url || "");
    }
  }, [isAvatarDirty, user?.avatar_url]);

  const displayName = useMemo(() => {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    return name || user?.email || "Profile";
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfileData((current) => ({ ...current, [name]: value }));
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarClientError("");
    dispatch(clearAuthError());

    optimizeAvatarToDataUrl(file)
      .then((optimizedDataUrl) => {
        setAvatarDraft(optimizedDataUrl);
        setIsAvatarDirty(true);
      })
      .catch((uploadError) => {
        setAvatarClientError(uploadError.message || "Unable to process selected image.");
      });

    event.target.value = "";
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setIsSavingProfile(true);
    await dispatch(updateProfile(profileData));
    setIsSavingProfile(false);
  }

  async function handleAvatarSave() {
    if (!isAvatarDirty) return;
    setIsSavingPhoto(true);
    const result = await dispatch(updateProfile({ avatar_url: avatarDraft }));
    if (updateProfile.fulfilled.match(result)) {
      setIsAvatarDirty(false);
    }
    setIsSavingPhoto(false);
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

      <section className="workspace-panel panel-toggle-bar">
        <div className="panel-toggle-actions" role="tablist" aria-label="Profile views">
          <button type="button" className={`panel-toggle-btn ${activePane === "profile" ? "active" : ""}`} onClick={() => setActivePane("profile")}>Profile Form</button>
          <button type="button" className={`panel-toggle-btn ${activePane === "avatar" ? "active" : ""}`} onClick={() => setActivePane("avatar")}>Avatar</button>
        </div>
      </section>

      <div className="profile-grid single-pane-layout">
        {activePane === "avatar" ? (
        <section className="profile-card">
          <div className="profile-avatar">
            {avatarDraft ? (
              <img src={avatarDraft} alt="" />
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
          {avatarClientError ? <p className="form-status error">{avatarClientError}</p> : null}
          {fieldErrors.avatar_url?.[0] ? <p className="form-status error">{fieldErrors.avatar_url[0]}</p> : null}
          {isAvatarDirty ? (
            <Button
              type="button"
              className="primary-btn"
              onClick={handleAvatarSave}
              disabled={(isSaving && !isSavingPhoto) || isSavingPhoto}
            >
              {(isSaving && isSavingPhoto) || isSavingPhoto ? "Saving photo..." : "Save Photo"}
            </Button>
          ) : null}
        </section>
        ) : null}

        {activePane === "profile" ? (
        <section className="workspace-panel profile-form-panel">
          <form className="auth-form" onSubmit={handleProfileSubmit}>
            <div className="form-grid-two">
              <FormField id="first-name" label="First Name" error={fieldErrors.first_name?.[0]}>
                <input id="first-name" name="first_name" value={profileData.first_name} onChange={handleChange} />
              </FormField>

              <FormField id="last-name" label="Last Name" error={fieldErrors.last_name?.[0]}>
                <input id="last-name" name="last_name" value={profileData.last_name} onChange={handleChange} />
              </FormField>
            </div>

            <FormField id="phone" label="Phone" error={fieldErrors.phone?.[0]}>
              <input id="phone" name="phone" value={profileData.phone} onChange={handleChange} placeholder="+254..." />
            </FormField>

            <div className="profile-facts">
              <span><strong>Email</strong>{user?.email}</span>
              <span><strong>Role</strong>{user?.role}</span>
            </div>

            <Button type="submit" className="primary-btn full-width" disabled={(isSaving && !isSavingProfile) || isSavingProfile}>
              {(isSaving && isSavingProfile) || isSavingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </section>
        ) : null}
      </div>
    </section>
  );
}
