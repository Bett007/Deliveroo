import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxMap.module.css";

export function MapboxMap({ origin, destination, originCoords, destinationCoords, routeGeoJson, onPOISelect, poiFilter }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxglRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  const canRenderMap = Boolean(accessToken);

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
        originCoords?.longitude ?? destinationCoords?.longitude ?? 37.9062,
        originCoords?.latitude ?? destinationCoords?.latitude ?? 0.0236,
      ];

      let backendLocations = null;

      async function initializeMap() {
        if (apiBaseUrl) {
          try {
            const response = await fetch(`${apiBaseUrl}/locations`);
            if (response.ok) {
              backendLocations = await response.json();
            } else {
              console.warn("Unable to load backend locations:", response.statusText);
            }
          } catch (error) {
            console.warn("Unable to load backend locations:", error);
          }
        }

        mapRef.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: initialCenter,
          zoom: originCoords || destinationCoords ? 11 : 6,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        mapRef.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

        mapRef.current.once("load", () => {
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
          } else if (originCoords) {
            mapRef.current.setCenter([originCoords.longitude, originCoords.latitude]);
            mapRef.current.setZoom(13);
          } else if (destinationCoords) {
            mapRef.current.setCenter([destinationCoords.longitude, destinationCoords.latitude]);
            mapRef.current.setZoom(13);
          }
        });

        if (originCoords) {
          const originMarker = document.createElement("div");
          originMarker.className = `${styles.mapboxMarker} ${styles.mapboxMarkerOrigin}`;
          originMarker.innerHTML = `<span class="${styles.markerLabel}">P</span>`;
          new mapboxgl.Marker(originMarker)
            .setLngLat([originCoords.longitude, originCoords.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Pickup</strong><p>${origin || "Pickup location"}</p>`))
            .addTo(mapRef.current);
        }

        if (destinationCoords) {
          const destinationMarker = document.createElement("div");
          destinationMarker.className = `${styles.mapboxMarker} ${styles.mapboxMarkerDestination}`;
          destinationMarker.innerHTML = `<span class="${styles.markerLabel}">D</span>`;
          new mapboxgl.Marker(destinationMarker)
            .setLngLat([destinationCoords.longitude, destinationCoords.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>Delivery</strong><p>${destination || "Destination"}</p>`))
            .addTo(mapRef.current);
        }

        if (backendLocations && backendLocations.features?.length > 0) {
          if (!mapRef.current.getSource("backend-locations")) {
            mapRef.current.addSource("backend-locations", {
              type: "geojson",
              data: backendLocations,
            });
          }

          if (!mapRef.current.getLayer("backend-location-points")) {
            mapRef.current.addLayer({
              id: "backend-location-points",
              type: "circle",
              source: "backend-locations",
              paint: {
                "circle-radius": 6,
                "circle-color": "#ff69b4",
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 1,
              },
            });

            mapRef.current.on("click", "backend-location-points", (e) => {
              if (!e.features || e.features.length === 0) return;
              const feature = e.features[0];
              const coordinates = feature.geometry.coordinates.slice();
              const name = feature.properties?.name || feature.properties?.address || "Location";
              const category = feature.properties?.category || "Location";

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<strong>${name}</strong><p>${category}</p>`)
                .addTo(mapRef.current);
            });

            mapRef.current.on("mouseenter", "backend-location-points", () => {
              mapRef.current.getCanvas().style.cursor = "pointer";
            });

            mapRef.current.on("mouseleave", "backend-location-points", () => {
              mapRef.current.getCanvas().style.cursor = "";
            });
          }
        }

        mapRef.current.on("click", (event) => {
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
      }

      initializeMap();
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
  }, [canRenderMap, origin, destination, originCoords, destinationCoords, routeGeoJson, poiFilter, onPOISelect]);

  if (!canRenderMap || mapError) {
    return <div className={styles.mapboxStatic}>Map preview unavailable</div>;
  }

  return <div ref={mapContainer} className={styles.mapboxContainer} />;
}

