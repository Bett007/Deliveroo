import { useEffect, useState } from "react";
import { fetchRoutePreview } from "../../services/mapbox";
import { formatDistance, formatDuration } from "../../utils/formatters/distance";
import { MapboxMap } from "./MapboxMap";
import styles from "./RouteMapCard.module.css";

const TERMINAL_STATUSES = new Set(["delivered", "cancelled"]);

export function RouteMapCard({
  origin,
  destination,
  originCoords,
  destinationCoords,
  distanceKm,
  durationMinutes,
  status,
  onRoutePreviewChange,
}) {
  const [routePreview, setRoutePreview] = useState(null);
  const isTerminalStatus = TERMINAL_STATUSES.has(String(status || "").toLowerCase());
  const effectiveOriginCoords = originCoords;
  const effectiveDestinationCoords = destinationCoords;
  const hasLocations = origin && destination;
  const canRenderMap = Boolean(effectiveOriginCoords && effectiveDestinationCoords);
  const shouldRenderMap = Boolean(hasLocations && canRenderMap);
  const displayDistanceKm = routePreview?.distanceKm ?? distanceKm;
  const displayDurationMinutes = routePreview?.durationMinutes ?? durationMinutes;

  useEffect(() => {
    let isActive = true;

    async function loadRoutePreview() {
      if (!effectiveOriginCoords || !effectiveDestinationCoords) {
        setRoutePreview(null);
        onRoutePreviewChange?.(null);
        return;
      }

      try {
        const preview = await fetchRoutePreview(effectiveOriginCoords, effectiveDestinationCoords);

        if (isActive) {
          setRoutePreview(preview);
          onRoutePreviewChange?.(preview);
        }
      } catch {
        if (isActive) {
          setRoutePreview(null);
          onRoutePreviewChange?.(null);
        }
      }
    }

    loadRoutePreview();

    return () => {
      isActive = false;
    };
  }, [
    effectiveOriginCoords?.latitude,
    effectiveOriginCoords?.longitude,
    effectiveDestinationCoords?.latitude,
    effectiveDestinationCoords?.longitude,
  ]);

  return (
    <section className={`glass-card map-card route-map-card ${styles.scope}`}>
      <div className="section-header">
        <div>
          <h2>Delivery Map</h2>
          <p>{origin} to {destination}</p>
        </div>
        <span className={`mini-badge ${isTerminalStatus ? "terminal" : ""}`}>{isTerminalStatus ? "Completed" : "Live"}</span>
      </div>

      {shouldRenderMap ? (
        <MapboxMap
          origin={origin}
          destination={destination}
          originCoords={effectiveOriginCoords}
          destinationCoords={effectiveDestinationCoords}
          routeGeoJson={routePreview?.geometry}
          mutedStops={isTerminalStatus}
        />
      ) : (
        <div className="fake-map route-map-fallback">
          <div className="map-route-line"></div>
          <div className={`map-stop map-stop-start ${isTerminalStatus ? "map-stop-terminal" : ""}`}>
            <span>P</span>
          </div>
          <div className={`map-stop map-stop-end ${isTerminalStatus ? "map-stop-terminal" : ""}`}>
            <span>D</span>
          </div>
        </div>
      )}

      <div className="map-meta-grid">
        <div className="map-meta-card">
          <p className="card-label">Distance</p>
          <h3>{formatDistance(displayDistanceKm)}</h3>
        </div>
        <div className="map-meta-card">
          <p className="card-label">Duration</p>
          <h3>{formatDuration(displayDurationMinutes)}</h3>
        </div>
      </div>
    </section>
  );
}
