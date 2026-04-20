/* global __MAPBOX_FALLBACK_TOKEN__ */

function normalizeToken(value) {
  const token = String(value || "").trim().replace(/^['"]|['"]$/g, "");
  return token || null;
}

function isPublicToken(value) {
  return typeof value === "string" && value.startsWith("pk.");
}

export function getMapboxAccessToken() {
  const envTokenCandidate = normalizeToken(
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    || import.meta.env.VITE_MAPBOX_TOKEN
    || import.meta.env.MAPBOX_ACCESS_TOKEN
    || import.meta.env.MAPBOX_PUBLIC_TOKEN,
  );
  const envToken = isPublicToken(envTokenCandidate) ? envTokenCandidate : null;

  if (envToken) {
    return envToken;
  }

  const buildFallbackCandidate = normalizeToken(
    typeof __MAPBOX_FALLBACK_TOKEN__ !== "undefined" ? __MAPBOX_FALLBACK_TOKEN__ : "",
  );
  const buildFallbackToken = isPublicToken(buildFallbackCandidate) ? buildFallbackCandidate : null;
  if (buildFallbackToken) {
    return buildFallbackToken;
  }

  if (typeof window !== "undefined") {
    const localTokenCandidate = normalizeToken(
      window.localStorage.getItem("VITE_MAPBOX_ACCESS_TOKEN")
      || window.localStorage.getItem("VITE_MAPBOX_TOKEN")
      || window.localStorage.getItem("MAPBOX_ACCESS_TOKEN")
      || window.localStorage.getItem("MAPBOX_PUBLIC_TOKEN"),
    );
    const localToken = isPublicToken(localTokenCandidate) ? localTokenCandidate : null;
    if (localToken) {
      return localToken;
    }
  }

  return "";
}

const ACCESS_TOKEN = getMapboxAccessToken();
const GEOCODING_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const DIRECTIONS_BASE_URL = "https://api.mapbox.com/directions/v5/mapbox/driving";

function assertToken() {
  if (!ACCESS_TOKEN) {
    throw new Error("Map services are temporarily unavailable. Please continue with location inputs and try again shortly.");
  }
  if (!ACCESS_TOKEN.startsWith("pk.")) {
    throw new Error("Map services are temporarily unavailable. Please continue with location inputs and try again shortly.");
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if ([401, 403].includes(response.status)) {
      throw new Error("Map services are unavailable right now. Please continue with location inputs.");
    }

    if (response.status >= 500) {
      throw new Error("Map services are temporarily unavailable. Please try again shortly.");
    }

    throw new Error(body.message || "Unable to load map results right now.");
  }
  return response.json();
}

export async function geocodeAddress(address) {
  assertToken();
  const encoded = encodeURIComponent(address.trim());
  const url = `${GEOCODING_BASE_URL}/${encoded}.json?access_token=${ACCESS_TOKEN}&limit=1&autocomplete=true&country=ke`;
  const payload = await fetchJson(url);

  const feature = payload.features?.[0];
  if (!feature) {
    throw new Error(`Unable to resolve address: ${address}`);
  }

  const [longitude, latitude] = feature.center || [];
  return {
    address: feature.place_name,
    latitude,
    longitude,
    city: feature.context?.find((item) => item.id.startsWith("place"))?.text || null,
    country: feature.context?.find((item) => item.id.startsWith("country"))?.text || null,
  };
}

export async function autocompleteAddress(text, county) {
  assertToken();
  const normalized = String(text || "").trim();
  const region = county ? String(county || "").trim() : "";
  const query = region && !normalized.toLowerCase().includes(region.toLowerCase())
    ? `${normalized}, ${region}, Kenya`
    : normalized;

  const encoded = encodeURIComponent(query);
  const url = `${GEOCODING_BASE_URL}/${encoded}.json?access_token=${ACCESS_TOKEN}&autocomplete=true&limit=6&country=ke&types=poi,address`;
  const payload = await fetchJson(url);

  return (payload.features || []).map((feature) => {
    const [longitude, latitude] = feature.center || [];
    return {
      id: feature.id,
      label: feature.place_name,
      latitude,
      longitude,
      address: feature.place_name,
    };
  });
}

export async function reverseGeocodeCoordinates(latitude, longitude) {
  assertToken();
  const encoded = encodeURIComponent(`${longitude},${latitude}`);
  const url = `${GEOCODING_BASE_URL}/${encoded}.json?access_token=${ACCESS_TOKEN}&limit=1&country=ke`;
  const payload = await fetchJson(url);

  const feature = payload.features?.[0];
  if (!feature) {
    throw new Error("Unable to resolve coordinates.");
  }

  const [resolvedLng, resolvedLat] = feature.center || [longitude, latitude];
  return {
    address: feature.place_name,
    latitude: resolvedLat,
    longitude: resolvedLng,
    city: feature.context?.find((item) => item.id.startsWith("place"))?.text || null,
    country: feature.context?.find((item) => item.id.startsWith("country"))?.text || null,
  };
}

export async function fetchNairobiPlaceSuggestions(limitPerCategory = 4) {
  assertToken();
  const categories = ["restaurant", "cafe", "business", "hotel", "hospital", "mall"];

  const requests = categories.map(async (category) => {
    const query = encodeURIComponent(`${category} in Nairobi`);
    const url = `${GEOCODING_BASE_URL}/${query}.json?access_token=${ACCESS_TOKEN}&autocomplete=true&limit=${limitPerCategory}&country=ke&types=poi,address`;
    const payload = await fetchJson(url);

    return (payload.features || []).map((feature) => {
      const [longitude, latitude] = feature.center || [];
      return {
        id: `${category}-${feature.id}`,
        label: feature.place_name,
        latitude,
        longitude,
        address: feature.place_name,
      };
    });
  });

  const suggestions = (await Promise.all(requests)).flat();
  const seen = new Set();

  return suggestions.filter((item) => {
    if (!item.label || seen.has(item.label)) {
      return false;
    }
    seen.add(item.label);
    return true;
  });
}

export async function fetchRoutePreview(originCoords, destinationCoords) {
  assertToken();

  if (!originCoords || !destinationCoords) {
    throw new Error("Origin and destination coordinates are required for route preview.");
  }

  const coordinates = `${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}`;
  const url = `${DIRECTIONS_BASE_URL}/${coordinates}?access_token=${ACCESS_TOKEN}&overview=full&geometries=geojson&alternatives=false&steps=false`;
  const payload = await fetchJson(url);

  if (!payload.routes?.length) {
    throw new Error("No route could be retrieved for the selected locations.");
  }

  const route = payload.routes[0];

  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMinutes: Math.round(route.duration / 60),
    geometry: route.geometry,
  };
}

export async function searchPOIs(query, county, poiType = null) {
  assertToken();
  const normalized = String(query || "").trim();
  if (!normalized) {
    return [];
  }

  const region = county ? String(county || "").trim() : "";
  const searchQuery = region && !normalized.toLowerCase().includes(region.toLowerCase())
    ? `${normalized}, ${region}, Kenya`
    : normalized;

  const encoded = encodeURIComponent(searchQuery);
  const types = poiType ? `poi.${poiType}` : "poi,place";
  const url = `${GEOCODING_BASE_URL}/${encoded}.json?access_token=${ACCESS_TOKEN}&autocomplete=true&limit=10&country=ke&types=${types}`;
  const payload = await fetchJson(url);

  return (payload.features || []).map((feature) => {
    const [longitude, latitude] = feature.center || [];
    const category = feature.properties?.category || feature.properties?.short_code?.split("_")[1] || "place";
    return {
      id: feature.id,
      name: feature.text || feature.place_name,
      label: feature.place_name,
      latitude,
      longitude,
      category,
      address: feature.place_name,
      relevance: feature.relevance,
      poiCategory: feature.properties?.category || null,
    };
  });
}

export const POI_CATEGORIES = [
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafés" },
  { value: "store", label: "Shops & Malls" },
  { value: "bank", label: "Banks" },
  { value: "park", label: "Parks" },
  { value: "hospital", label: "Hospitals" },
  { value: "hotel", label: "Hotels" },
];
