const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const GEOCODING_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const DIRECTIONS_BASE_URL = "https://api.mapbox.com/directions/v5/mapbox/driving";

function assertToken() {
  if (!ACCESS_TOKEN) {
    throw new Error("Mapbox access token is required. Set VITE_MAPBOX_ACCESS_TOKEN in your environment.");
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Mapbox request failed with status ${response.status}`);
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
  const url = `${GEOCODING_BASE_URL}/${encoded}.json?access_token=${ACCESS_TOKEN}&autocomplete=true&limit=6&country=ke&types=address,poi,place`;
  const payload = await fetchJson(url);

  return (payload.features || []).map((feature) => ({
    id: feature.id,
    label: feature.place_name,
  }));
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
