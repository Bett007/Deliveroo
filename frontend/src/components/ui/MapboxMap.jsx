import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxMap.module.css";

const DEFAULT_NAIROBI_CENTER = [36.8219, -1.2921];
const DEFAULT_NEARBY_CATEGORIES = ["restaurant", "cafe", "hospital", "petrol station", "supermarket"];

const CATEGORY_COLORS = {
  restaurant: "#ef4444",
  cafe: "#f59e0b",
  hospital: "#2563eb",
  "petrol station": "#16a34a",
  supermarket: "#7c3aed",
};

export function MapboxMap({
  origin,
  destination,
  originCoords,
  destinationCoords,
  routeGeoJson,
  showNearbyPlaces = false,
  nearbyCategories = DEFAULT_NEARBY_CATEGORIES,
  clickTarget = "pickup",
  onPickupSelect,
  onDestinationSelect,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const mapboxglRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [isMapboxReady, setIsMapboxReady] = useState(false);
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const canRenderMap = Boolean(accessToken);

  useEffect(() => {
    let isMounted = true;

    async function initMapbox() {
      try {
        const mapboxModule = await import("mapbox-gl");
        if (!isMounted) return;

        const mapboxgl = mapboxModule.default ?? mapboxModule;
        mapboxgl.accessToken = accessToken;
        mapboxglRef.current = mapboxgl;
        setIsMapboxReady(true);
      } catch (error) {
        console.error("Unable to load Mapbox GL:", error);
        if (isMounted) setMapError(true);
      }
    }

    if (canRenderMap) {
      setIsMapboxReady(false);
      initMapbox();
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, canRenderMap]);

  useEffect(() => {
    if (!mapContainer.current || !canRenderMap || !isMapboxReady || !mapboxglRef.current) return;

    const mapboxgl = mapboxglRef.current;

    if (mapRef.current?.remove) {
      try {
        mapRef.current.remove();
      } catch (cleanupError) {
        console.warn("Previous Mapbox cleanup failed:", cleanupError);
      }
      mapRef.current = null;
    }

    const initialCenter = [
      destinationCoords?.longitude ?? DEFAULT_NAIROBI_CENTER[0],
      destinationCoords?.latitude ?? DEFAULT_NAIROBI_CENTER[1],
    ];

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCenter,
      zoom: originCoords || destinationCoords ? 11 : 11,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    const createdMarkers = [];

    function addMarker(marker) {
      createdMarkers.push(marker);
      return marker;
    }

    function replacePickupMarker(lngLat, popupText = origin || "Pickup location") {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }

      pickupMarkerRef.current = new mapboxgl.Marker({ color: "#16a34a" })
        .setLngLat(lngLat)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Pickup</strong><p>${popupText}</p>`))
        .addTo(map);
    }

    function replaceDestinationMarker(lngLat, popupText = destination || "Destination") {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }

      destinationMarkerRef.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(lngLat)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Delivery</strong><p>${popupText}</p>`))
        .addTo(map);
    }

    function addStopMarker(label, coords, popupTitle, popupText, markerClassName) {
      const markerElement = document.createElement("div");
      markerElement.className = `${styles.mapboxMarker} ${markerClassName}`;
      markerElement.innerHTML = `<span class="${styles.markerLabel}">${label}</span>`;

      return addMarker(
        new mapboxgl.Marker(markerElement)
          .setLngLat([coords.longitude, coords.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${popupTitle}</strong><p>${popupText}</p>`))
          .addTo(map),
      );
    }

    function replaceRouteLayer(routeGeometry) {
      if (map.getLayer("route-line")) {
        map.removeLayer("route-line");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: routeGeometry,
        },
      });

      map.addLayer({
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

    async function loadNearbyCategoryMarkers() {
      const baseLng = originCoords?.longitude ?? destinationCoords?.longitude ?? DEFAULT_NAIROBI_CENTER[0];
      const baseLat = originCoords?.latitude ?? destinationCoords?.latitude ?? DEFAULT_NAIROBI_CENTER[1];

      const requests = nearbyCategories.map(async (category) => {
        const encodedCategory = encodeURIComponent(category);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedCategory}.json?proximity=${baseLng},${baseLat}&access_token=${accessToken}&limit=5&country=ke&types=poi`;
        const response = await fetch(url);
        if (!response.ok) {
          return [];
        }

        const payload = await response.json();
        return (payload.features || []).map((feature) => ({
          id: feature.id,
          category,
          label: feature.place_name,
          center: feature.center,
        }));
      });

      const allCategories = await Promise.all(requests);
      const places = allCategories.flat();

      places.forEach((place) => {
        if (!Array.isArray(place.center) || place.center.length < 2) {
          return;
        }

        addMarker(
          new mapboxgl.Marker({
            color: CATEGORY_COLORS[place.category] || "#334155",
          })
            .setLngLat(place.center)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<strong>${place.category}</strong><p>${place.label}</p>`,
              ),
            )
            .addTo(map),
        );
      });
    }

    map.once("load", async () => {
      if (routeGeoJson && originCoords && destinationCoords) {
        replaceRouteLayer(routeGeoJson);

        const bounds = routeGeoJson.coordinates.reduce(
          (accumulator, coordinate) => accumulator.extend(coordinate),
          new mapboxgl.LngLatBounds(routeGeoJson.coordinates[0], routeGeoJson.coordinates[0]),
        );

        map.fitBounds(bounds, {
          padding: 40,
          maxZoom: 15,
        });
      } else if (originCoords && destinationCoords) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([originCoords.longitude, originCoords.latitude]);
        bounds.extend([destinationCoords.longitude, destinationCoords.latitude]);
        map.fitBounds(bounds, { padding: 40, maxZoom: 14 });
      } else if (originCoords) {
        map.flyTo({
          center: [originCoords.longitude, originCoords.latitude],
          zoom: 14,
          essential: true,
          duration: 700,
        });
      } else if (destinationCoords) {
        map.flyTo({
          center: [destinationCoords.longitude, destinationCoords.latitude],
          zoom: 14,
          essential: true,
          duration: 700,
        });
      }

      if (originCoords) {
        const pickupLngLat = [originCoords.longitude, originCoords.latitude];
        map.flyTo({
          center: pickupLngLat,
          zoom: 14,
          essential: true,
          duration: 900,
        });

        replacePickupMarker(pickupLngLat, origin || "Pickup location");
      }

      if (destinationCoords) {
        const destinationLngLat = [destinationCoords.longitude, destinationCoords.latitude];
        replaceDestinationMarker(destinationLngLat, destination || "Destination");
      }

      if (showNearbyPlaces && !originCoords && !destinationCoords) {
        try {
          await loadNearbyCategoryMarkers();
        } catch (error) {
          console.warn("Unable to load nearby places:", error);
        }
      }
    });

    const handleMapClick = (e) => {
      const longitude = e.lngLat.lng;
      const latitude = e.lngLat.lat;
      const lngLat = [longitude, latitude];

      map.flyTo({
        center: lngLat,
        zoom: Math.max(map.getZoom(), 14),
        essential: true,
        duration: 700,
      });

      if (clickTarget === "destination") {
        replaceDestinationMarker(lngLat);
        if (onDestinationSelect) {
          onDestinationSelect({ longitude, latitude });
        }
        return;
      }

      replacePickupMarker(lngLat);
      if (onPickupSelect) {
        onPickupSelect({ longitude, latitude });
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      createdMarkers.forEach((marker) => {
        try {
          marker.remove();
        } catch {
          // Ignore marker cleanup failures.
        }
      });
      if (pickupMarkerRef.current) {
        try {
          pickupMarkerRef.current.remove();
        } catch {
          // Ignore marker cleanup failures.
        }
        pickupMarkerRef.current = null;
      }
      if (destinationMarkerRef.current) {
        try {
          destinationMarkerRef.current.remove();
        } catch {
          // Ignore marker cleanup failures.
        }
        destinationMarkerRef.current = null;
      }

      if (mapRef.current?.remove) {
        try {
          mapRef.current.remove();
        } catch (cleanupError) {
          console.warn("Map cleanup failed:", cleanupError);
        }
        mapRef.current = null;
      }
    };
  }, [accessToken, canRenderMap, isMapboxReady, origin, destination, originCoords, destinationCoords, routeGeoJson, showNearbyPlaces, nearbyCategories, clickTarget, onPickupSelect, onDestinationSelect]);

  if (!canRenderMap || mapError) {
    return <div className={styles.mapboxStatic}>Map preview unavailable</div>;
  }

  return <div ref={mapContainer} className={styles.mapboxContainer} />;
}
