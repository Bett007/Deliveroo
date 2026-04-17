import supportImage from "../../assets/images/parcel-support.jpg";
import onlineShoppingImage from "../../assets/images/online-shopping-delivery-illustration.jpg";
import scooterRiderImage from "../../assets/images/scooter-rider-illustration.jpg";
import warehouseForkliftImage from "../../assets/images/warehouse-forklift-aisle.jpg";
import warehouseShelvesImage from "../../assets/images/warehouse-shelves.jpg";
import { AppIcon } from "./AppIcon";
import styles from "./PlaceholderArtwork.module.css";

export function PlaceholderArtwork({ variant = "customer", label = "Preview", title, caption }) {
  const artworkMap = {
    customer: {
      primary: onlineShoppingImage,
      secondary: scooterRiderImage,
      icon: "route",
      stat: "Live delivery updates",
      detail: "Order status, pickup confirmation, and parcel handoff progress.",
      primaryAlt: "Illustration of a customer placing an order while a rider heads out for delivery",
      secondaryAlt: "Illustration of a scooter rider navigating a parcel delivery route",
    },
    admin: {
      primary: warehouseShelvesImage,
      secondary: warehouseForkliftImage,
      icon: "chart",
      stat: "Operations snapshot",
      detail: "Dispatch flow, parcel handling, and delivery readiness at a glance.",
      primaryAlt: "Warehouse shelves organized for parcel handling and operations",
      secondaryAlt: "Forklift moving through a warehouse aisle during dispatch preparation",
    },
    auth: {
      primary: supportImage,
      secondary: scooterRiderImage,
      icon: "shield",
      stat: "Trusted delivery access",
      detail: "Simple onboarding with secure access for customers and riders.",
      primaryAlt: "Courier handing a parcel to a customer during delivery",
      secondaryAlt: "Illustration of a scooter rider navigating a parcel delivery route",
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
