import { formatDistance, formatDuration } from "../../utils/formatters/distance";
import styles from "./RouteMapCard.module.css";

function buildDirectionsUrl(origin, destination) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY;

  if (!apiKey || !origin || !destination) {
    return "";
  }

  const params = new URLSearchParams({
    key: apiKey,
    origin,
    destination,
    mode: "driving",
  });

  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

export function RouteMapCard({ origin, destination, distanceKm, durationMinutes }) {
  const directionsUrl = buildDirectionsUrl(origin, destination);

  return (
    <section className={`glass-card map-card route-map-card ${styles.scope}`}>
      <div className="section-header">
        <div>
          <h2>Delivery Map</h2>
          <p>{origin} to {destination}</p>
        </div>
        <span className="mini-badge">Live</span>
      </div>

      {directionsUrl ? (
        <iframe
          title="Delivery route map"
          src={directionsUrl}
          className="map-embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="fake-map route-map-fallback">
          <div className="map-route-line"></div>
          <div className="map-stop map-stop-start">
            <span>P</span>
          </div>
          <div className="map-stop map-stop-end">
            <span>D</span>
          </div>
        </div>
      )}

      <div className="map-meta-grid">
        <div className="map-meta-card">
          <p className="card-label">Distance</p>
          <h3>{formatDistance(distanceKm)}</h3>
        </div>
        <div className="map-meta-card">
          <p className="card-label">Duration</p>
          <h3>{formatDuration(durationMinutes)}</h3>
        </div>
      </div>
    </section>
  );
}
