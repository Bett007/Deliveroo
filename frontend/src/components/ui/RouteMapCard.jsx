import { formatDistance, formatDuration } from "../../utils/formatters/distance";
import { MapboxMap } from "./MapboxMap";
import styles from "./RouteMapCard.module.css";

const TERMINAL_STATUSES = new Set(["delivered", "cancelled"]);

export function RouteMapCard({ origin, destination, originCoords, destinationCoords, distanceKm, durationMinutes, status }) {
  const isTerminalStatus = TERMINAL_STATUSES.has(String(status || "").toLowerCase());
  const effectiveOriginCoords = isTerminalStatus ? null : originCoords;
  const effectiveDestinationCoords = isTerminalStatus ? null : destinationCoords;
  const hasLocations = origin && destination;
  const canRenderMap = Boolean(effectiveOriginCoords && effectiveDestinationCoords);
  const shouldRenderMap = Boolean((hasLocations && canRenderMap) || isTerminalStatus);

  return (
    <section className={`glass-card map-card route-map-card ${styles.scope}`}>
      <div className="section-header">
        <div>
          <h2>Delivery Map</h2>
          <p>{origin} to {destination}</p>
        </div>
        <span className="mini-badge">Live</span>
      </div>

      {shouldRenderMap ? (
        <MapboxMap
          origin={origin}
          destination={destination}
          originCoords={effectiveOriginCoords}
          destinationCoords={effectiveDestinationCoords}
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
