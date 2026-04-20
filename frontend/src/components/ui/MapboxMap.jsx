import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapboxAccessToken } from "../../services/mapbox";
import styles from "./MapboxMap.module.css";

const DEFAULT_KENYA_CENTER = [37.9062, -0.0236];

function collectGeometryCoordinates(geometry, target) {
  if (!geometry) return;

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach((ring) => ring.forEach((point) => target.push(point)));
    return;
  }

  if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => ring.forEach((point) => target.push(point)));
    });
  }
}

function toBounds(mapboxgl, countyGeoJson, businessMarkers) {
  const points = [];

  if (countyGeoJson?.features?.length) {
    countyGeoJson.features.forEach((feature) => collectGeometryCoordinates(feature.geometry, points));
  }

  (businessMarkers || []).forEach((marker) => {
    if (marker?.longitude != null && marker?.latitude != null) {
      points.push([marker.longitude, marker.latitude]);
    }
  });

  if (!points.length) {
    return null;
  }

  return points.reduce(
    (acc, point) => acc.extend(point),
    new mapboxgl.LngLatBounds(points[0], points[0]),
  );
}

function markerStyleClass(category) {
  if (["pickup", "dropoff", "delivery_hub"].includes(category)) {
    return styles.mapboxMarkerHub;
  }

  return styles.mapboxMarkerBusiness;
}

function markerLabel(category) {
  const key = String(category || "").trim().toLowerCase();
  if (!key) return "B";

  if (key === "pickup") return "P";
  if (key === "dropoff") return "D";
  if (key === "delivery_hub") return "H";

  return key.slice(0, 1).toUpperCase();
}

export function MapboxMap({
  origin,
  destination,
  originCoords,
  destinationCoords,
  routeGeoJson,
  onPickupSelect,
  onDestinationSelect,
  clickTarget = "pickup",
  onPOISelect,
  poiFilter,
  countyGeoJson,
  showCountyBoundaries = false,
  businessMarkers = [],
  defaultCenter = null,
  defaultZoom = 6,
  mutedStops = false,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxglRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const accessToken = getMapboxAccessToken();

  const hasExplorerData = Boolean(showCountyBoundaries || countyGeoJson?.features?.length || businessMarkers?.length);
  const canRenderMap = Boolean(accessToken && (originCoords || destinationCoords || hasExplorerData || defaultCenter));

  useEffect(() => {
    let isMounted = true;
    let cancelled = false;

    async function initMapbox() {
      try {
        const mapboxModule = await import("mapbox-gl");
        if (!isMounted || cancelled) return;

        const mapboxgl = mapboxModule.default ?? mapboxModule;
        mapboxgl.accessToken = accessToken;
        mapboxglRef.current = mapboxgl;
      } catch (error) {
        console.error("Unable to load Mapbox GL:", error);
        if (isMounted) setMapError(true);
      }
    }

    if (canRenderMap) {
      initMapbox();
    }

    return () => {
      cancelled = true;
      isMounted = false;
    };
  }, [accessToken, canRenderMap]);

  useEffect(() => {
    if (!mapContainer.current || !canRenderMap || !mapboxglRef.current) return;

    const mapboxgl = mapboxglRef.current;

    if (mapRef.current?.remove) {
      try {
        mapRef.current.remove();
      } catch (cleanupError) {
        console.warn("Previous Mapbox cleanup failed:", cleanupError);
      }
      mapRef.current = null;
    }

    try {
      const initialCenter = [
        originCoords?.longitude
          ?? destinationCoords?.longitude
          ?? defaultCenter?.[0]
          ?? DEFAULT_KENYA_CENTER[0],
        originCoords?.latitude
          ?? destinationCoords?.latitude
          ?? defaultCenter?.[1]
          ?? DEFAULT_KENYA_CENTER[1],
      ];

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: initialCenter,
        zoom: routeGeoJson ? 11 : defaultZoom,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapRef.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

      mapRef.current.once("load", () => {
        if (showCountyBoundaries && countyGeoJson?.features?.length) {
          if (!mapRef.current.getSource("kenya-counties")) {
            mapRef.current.addSource("kenya-counties", {
              type: "geojson",
              data: countyGeoJson,
            });
          }

          if (!mapRef.current.getLayer("counties-fill")) {
            mapRef.current.addLayer({
              id: "counties-fill",
              type: "fill",
              source: "kenya-counties",
              paint: {
                "fill-color": "#16a34a",
                "fill-opacity": 0.08,
              },
            });
          }

          if (!mapRef.current.getLayer("counties-line")) {
            mapRef.current.addLayer({
              id: "counties-line",
              type: "line",
              source: "kenya-counties",
              paint: {
                "line-color": "#16a34a",
                "line-width": 2,
                "line-opacity": 0.7,
              },
            });
          }
        }

        if (routeGeoJson && originCoords && destinationCoords) {
          if (!mapRef.current.getSource("route")) {
            mapRef.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: routeGeoJson,
              },
            });
          }

          if (!mapRef.current.getLayer("route-line")) {
            mapRef.current.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#1ec8ff",
                "line-width": 5,
                "line-opacity": 0.85,
              },
            });
          }

          const bounds = routeGeoJson.coordinates.reduce(
            (acc, coordinate) => acc.extend(coordinate),
            new mapboxgl.LngLatBounds(routeGeoJson.coordinates[0], routeGeoJson.coordinates[0]),
          );

          mapRef.current.fitBounds(bounds, {
            padding: 40,
            maxZoom: 15,
          });
        } else if (originCoords && destinationCoords) {
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([originCoords.longitude, originCoords.latitude]);
          bounds.extend([destinationCoords.longitude, destinationCoords.latitude]);
          mapRef.current.fitBounds(bounds, { padding: 40, maxZoom: 14 });
        } else {
          const explorerBounds = toBounds(mapboxgl, countyGeoJson, businessMarkers);
          if (explorerBounds) {
            mapRef.current.fitBounds(explorerBounds, { padding: 42, maxZoom: 9 });
          }
        }

        if (originCoords) {
          const originMarker = document.createElement("div");
          originMarker.className = `${styles.mapboxMarker} ${styles.mapboxMarkerOrigin} ${mutedStops ? styles.mapboxMarkerMuted : ""}`;
          originMarker.innerHTML = `<span class="${styles.markerLabel}">P</span>`;
          new mapboxgl.Marker(originMarker)
            .setLngLat([originCoords.longitude, originCoords.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Pickup</strong><p>${origin || "Pickup location"}</p>`))
            .addTo(mapRef.current);
        }

        if (destinationCoords) {
          const destinationMarker = document.createElement("div");
          destinationMarker.className = `${styles.mapboxMarker} ${styles.mapboxMarkerDestination} ${mutedStops ? styles.mapboxMarkerMuted : ""}`;
          destinationMarker.innerHTML = `<span class="${styles.markerLabel}">D</span>`;
          new mapboxgl.Marker(destinationMarker)
            .setLngLat([destinationCoords.longitude, destinationCoords.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Delivery</strong><p>${destination || "Destination"}</p>`))
            .addTo(mapRef.current);
        }

        (businessMarkers || []).forEach((marker) => {
          if (marker?.longitude == null || marker?.latitude == null) {
            return;
          }

          const markerElement = document.createElement("div");
          markerElement.className = `${styles.mapboxMarker} ${markerStyleClass(marker.category)}`;
          markerElement.innerHTML = `<span class="${styles.markerLabel}">${markerLabel(marker.category)}</span>`;

          const popupBody = `
            <div style="padding: 8px; font-family: system-ui; font-size: 13px; max-width: 240px;">
              <strong>${marker.name || "Business"}</strong>
              <p style="margin: 6px 0 0 0; color: #334155;">${marker.categoryLabel || marker.category || "Category unavailable"}</p>
              ${marker.address ? `<p style="margin: 4px 0 0 0; color: #475569;">${marker.address}</p>` : ""}
            </div>
          `;

          new mapboxgl.Marker(markerElement)
            .setLngLat([marker.longitude, marker.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(popupBody))
            .addTo(mapRef.current);
        });

        mapRef.current.on("click", (event) => {
          if (onPickupSelect || onDestinationSelect) {
            const coords = {
              longitude: Number(event.lngLat.lng.toFixed(6)),
              latitude: Number(event.lngLat.lat.toFixed(6)),
            };

            if (clickTarget === "destination" && onDestinationSelect) {
              onDestinationSelect(coords);
            } else if (onPickupSelect) {
              onPickupSelect(coords);
            }

            return;
          }

          const features = mapRef.current.queryRenderedFeatures({ layers: ["poi-layer"], point: event.point });
          if (features.length > 0) {
            const feature = features[0];
            const poiData = {
              name: feature.properties.name || "Unnamed POI",
              category: feature.properties.category || "location",
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
              address: feature.properties.address || feature.place_name || "Address unavailable",
            };

            if (onPOISelect) {
              const popupContent = `
                <div style="padding: 8px; font-family: system-ui; font-size: 14px;">
                  <strong>${poiData.name}</strong>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${poiData.category}</p>
                  <p style="margin: 4px 0 0 0; font-size: 12px;">${poiData.address}</p>
                </div>
              `;
              new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setHTML(popupContent)
                .addTo(mapRef.current);
            }
          }
        });
      });
    } catch (error) {
      console.error("Failed to initialize Mapbox map:", error);
      setMapError(true);
    }

    return () => {
      if (mapRef.current?.remove) {
        try {
          mapRef.current.remove();
        } catch (cleanupError) {
          console.warn("Map cleanup failed:", cleanupError);
        }
        mapRef.current = null;
      }
    };
  }, [
    businessMarkers,
    canRenderMap,
    countyGeoJson,
    defaultCenter,
    defaultZoom,
    destination,
    destinationCoords,
    clickTarget,
    onPOISelect,
    onPickupSelect,
    onDestinationSelect,
    origin,
    originCoords,
    poiFilter,
    routeGeoJson,
    showCountyBoundaries,
    mutedStops,
  ]);

  if (!canRenderMap || mapError) {
    return <div className={styles.mapboxStatic}>Map preview unavailable</div>;
  }

  return <div ref={mapContainer} className={styles.mapboxContainer} />;
}
