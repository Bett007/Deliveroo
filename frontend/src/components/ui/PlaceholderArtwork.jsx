import logisticsImage from "../../assets/images/parcel-logistics.jpg";
import supportImage from "../../assets/images/parcel-support.jpg";
import routeImage from "../../assets/images/delivery-map.jpg";
import { AppIcon } from "./AppIcon";
import styles from "./PlaceholderArtwork.module.css";

export function PlaceholderArtwork({ variant = "customer", label = "Preview", title, caption }) {
  const artworkMap = {
    customer: {
      primary: routeImage,
      secondary: supportImage,
      icon: "route",
      stat: "Live delivery updates",
      detail: "Order status, pickup confirmation, and parcel handoff progress.",
      primaryAlt: "Parcel logistics team working inside a loading area",
      secondaryAlt: "Courier handing a parcel to a customer during delivery",
    },
    admin: {
      primary: logisticsImage,
      secondary: routeImage,
      icon: "chart",
      stat: "Operations snapshot",
      detail: "Dispatch flow, parcel handling, and delivery readiness at a glance.",
      primaryAlt: "Parcel logistics team working inside a loading area",
      secondaryAlt: "Parcel logistics team working inside a loading area",
    },
    auth: {
      primary: supportImage,
      secondary: logisticsImage,
      icon: "shield",
      stat: "Trusted delivery access",
      detail: "Simple onboarding with secure access for customers and riders.",
      primaryAlt: "Courier handing a parcel to a customer during delivery",
      secondaryAlt: "Parcel logistics team working inside a loading area",
    },
  };

  const artwork = artworkMap[variant] || artworkMap.customer;

  return (
    <aside className={`placeholder-art placeholder-art-${variant} ${styles.scope}`} aria-label={label}>
      <div className="placeholder-art-glow"></div>
      <div className="placeholder-art-frame glass-card">
        <div className="placeholder-art-hero">
          <span className="placeholder-pill">{label}</span>
          <div>
            <h3>{title}</h3>
            <p>{caption}</p>
          </div>
        </div>

        <div className="placeholder-scene">
          <div className="scene-card scene-card-large">
            <img
              src={artwork.primary}
              alt={artwork.primaryAlt}
              className="scene-image scene-image-main"
            />
            <div className="scene-copy-block">
              <strong>{artwork.stat}</strong>
              <p>{artwork.detail}</p>
            </div>
          </div>

          <div className="scene-card-grid">
            <div className="scene-card scene-card-small">
              <img
                src={artwork.secondary}
                alt={artwork.secondaryAlt}
                className="scene-image scene-image-alt"
              />
              <div className="scene-copy-compact">
                <strong>Parcel support</strong>
                <p>Useful updates when customers need clarity quickly.</p>
              </div>
            </div>

            <div className="scene-card scene-card-small floating-card">
              <div className="scene-badge">
                <AppIcon name={artwork.icon} size={24} />
              </div>
              <div className="scene-copy-compact">
                <strong>Delivery flow</strong>
                <p>Track status, route movement, and parcel handling clearly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
