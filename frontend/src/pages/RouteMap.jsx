import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MapboxMap } from "../components/ui/MapboxMap";
import { loadOrderReferenceData } from "../features/orders/ordersSlice";
import { kenyaCountiesSampleGeoJson } from "../data/kenyaCountiesSample";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "restaurant", label: "Restaurants" },
  { value: "cafe", label: "Cafes" },
  { value: "hotel", label: "Hotels" },
  { value: "pharmacy", label: "Chemists" },
  { value: "veterinary", label: "Vets" },
  { value: "mall", label: "Malls" },
  { value: "petrol_station", label: "Petrol" },
  { value: "delivery_hub", label: "Delivery hubs" },
  { value: "pickup", label: "Pickups" },
  { value: "dropoff", label: "Drop-offs" },
];

const SAMPLE_BUSINESS_MARKERS = [
  {
    id: "sample-1",
    name: "Westlands Food Court",
    address: "Westlands, Nairobi",
    county: "Nairobi",
    latitude: -1.2676,
    longitude: 36.8108,
    category: "restaurant",
    categoryLabel: "Restaurant",
  },
  {
    id: "sample-2",
    name: "Kilimani Coffee Spot",
    address: "Kilimani, Nairobi",
    county: "Nairobi",
    latitude: -1.2921,
    longitude: 36.7831,
    category: "cafe",
    categoryLabel: "Cafe",
  },
  {
    id: "sample-3",
    name: "Mombasa Beach Hotel",
    address: "Mombasa Town",
    county: "Mombasa",
    latitude: -4.0435,
    longitude: 39.6682,
    category: "hotel",
    categoryLabel: "Hotel",
  },
  {
    id: "sample-4",
    name: "CBD Chemist",
    address: "CBD, Nairobi",
    county: "Nairobi",
    latitude: -1.2864,
    longitude: 36.8172,
    category: "pharmacy",
    categoryLabel: "Pharmacy",
  },
  {
    id: "sample-5",
    name: "Kisumu Mall Centre",
    address: "Kisumu Central",
    county: "Kisumu",
    latitude: -0.0917,
    longitude: 34.768,
    category: "mall",
    categoryLabel: "Shopping Mall",
  },
  {
    id: "sample-6",
    name: "Nakuru Petrol Station",
    address: "Nakuru City",
    county: "Nakuru",
    latitude: -0.3031,
    longitude: 36.08,
    category: "petrol_station",
    categoryLabel: "Petrol Station",
  },
  {
    id: "sample-7",
    name: "Eldoret Vet Centre",
    address: "Eldoret, Uasin Gishu",
    county: "Uasin Gishu",
    latitude: 0.5143,
    longitude: 35.2698,
    category: "veterinary",
    categoryLabel: "Veterinary",
  },
];

function inferLocationCategory(label) {
  const text = String(label || "").toLowerCase();

  if (text.includes("hotel")) return { key: "hotel", label: "Hotel" };
  if (text.includes("restaurant") || text.includes("kitchen")) return { key: "restaurant", label: "Restaurant" };
  if (text.includes("cafe") || text.includes("coffee")) return { key: "cafe", label: "Cafe" };
  if (text.includes("mall") || text.includes("centre") || text.includes("center") || text.includes("shop")) {
    return { key: "mall", label: "Shopping Mall" };
  }
  if (text.includes("pharmacy") || text.includes("chemist")) return { key: "pharmacy", label: "Pharmacy" };
  if (text.includes("petrol") || text.includes("fuel") || text.includes("station")) {
    return { key: "petrol_station", label: "Petrol Station" };
  }

  return { key: "delivery_hub", label: "Delivery Hub" };
}

export function RouteMap() {
  const dispatch = useDispatch();
  const { currentOrders, referenceData, referenceStatus } = useSelector((state) => state.orders);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  const activeOrders = useMemo(
    () => currentOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)),
    [currentOrders],
  );

  const [selectedOrderId, setSelectedOrderId] = useState(activeOrders[0]?.id || null);
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!activeOrders.length) {
      setSelectedOrderId(null);
      return;
    }

    const exists = activeOrders.some((order) => String(order.id) === String(selectedOrderId));
    if (!exists) {
      setSelectedOrderId(activeOrders[0].id);
    }
  }, [activeOrders, selectedOrderId]);

  const selectedOrder = activeOrders.find((order) => String(order.id) === String(selectedOrderId)) || activeOrders[0] || null;

  const countyOptions = useMemo(
    () => [
      "All Counties",
      ...kenyaCountiesSampleGeoJson.features.map((feature) => feature.properties?.name).filter(Boolean),
    ],
    [],
  );

  const countyCenter = useMemo(() => {
    if (selectedCounty === "All Counties") return [37.9062, -0.0236];

    const countyFeature = kenyaCountiesSampleGeoJson.features.find(
      (feature) => feature.properties?.name === selectedCounty,
    );

    if (!countyFeature || countyFeature.geometry.type !== "Polygon") {
      return [37.9062, -0.0236];
    }

    const ring = countyFeature.geometry.coordinates[0] || [];
    if (!ring.length) return [37.9062, -0.0236];

    const [sumLng, sumLat] = ring.reduce(
      (acc, point) => [acc[0] + point[0], acc[1] + point[1]],
      [0, 0],
    );

    return [sumLng / ring.length, sumLat / ring.length];
  }, [selectedCounty]);

  const locationMarkers = useMemo(
    () =>
      (referenceData.locations || [])
        .filter((location) => location.latitude != null && location.longitude != null)
        .map((location) => {
          const inferred = inferLocationCategory(location.label || location.address);
          return {
            id: `loc-${location.id}`,
            name: location.label,
            address: location.address,
            county: location.city || "",
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            category: inferred.key,
            categoryLabel: inferred.label,
          };
        }),
    [referenceData.locations],
  );

  const orderMarkers = useMemo(
    () =>
      activeOrders.flatMap((order) => {
        const markers = [];

        if (order.pickupCoords?.latitude != null && order.pickupCoords?.longitude != null) {
          markers.push({
            id: `order-${order.id}-pickup`,
            name: `Order #${order.id} Pickup`,
            address: order.pickupLocation,
            county: "",
            latitude: order.pickupCoords.latitude,
            longitude: order.pickupCoords.longitude,
            category: "pickup",
            categoryLabel: "Order Pickup",
          });
        }

        if (order.destinationCoords?.latitude != null && order.destinationCoords?.longitude != null) {
          markers.push({
            id: `order-${order.id}-dropoff`,
            name: `Order #${order.id} Drop-off`,
            address: order.destination,
            county: "",
            latitude: order.destinationCoords.latitude,
            longitude: order.destinationCoords.longitude,
            category: "dropoff",
            categoryLabel: "Order Drop-off",
          });
        }

        return markers;
      }),
    [activeOrders],
  );

  const explorerMarkers = useMemo(() => {
    const allMarkers = [...orderMarkers, ...locationMarkers, ...SAMPLE_BUSINESS_MARKERS];

    return allMarkers.filter((marker) => {
      const matchesCategory = selectedCategory === "all" || marker.category === selectedCategory;
      const matchesCounty =
        selectedCounty === "All Counties"
        || String(marker.county || "").toLowerCase().includes(selectedCounty.toLowerCase())
        || String(marker.address || "").toLowerCase().includes(selectedCounty.toLowerCase());

      return matchesCategory && matchesCounty;
    });
  }, [locationMarkers, orderMarkers, selectedCategory, selectedCounty]);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Route Map</p>
          <h1>Delivery route planning and county business view</h1>
          <p className="workspace-copy">
            Use the route tracker for active orders and the county explorer to view categories like restaurants,
            cafes, chemists, malls, hotels, vets, and petrol stops.
          </p>
        </div>
        <Link to="/rider/dashboard" className="secondary-btn">Back to Rider Dashboard</Link>
      </header>

      {selectedOrder ? (
        <div className="workspace-grid">
          <RouteMapCard
            origin={selectedOrder.pickupLocation}
            destination={selectedOrder.destination}
            originCoords={selectedOrder.pickupCoords}
            destinationCoords={selectedOrder.destinationCoords}
            distanceKm={selectedOrder.distanceKm}
            durationMinutes={selectedOrder.durationMinutes}
            status={selectedOrder.status}
          />

          <SectionCard title="Active Orders" description="Select an order to focus its route map details.">
            <div className="order-card-list">
              {activeOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <h3>#{order.id}</h3>
                    <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  <p className="order-route">{order.pickupLocation} to {order.destination}</p>
                  <div className="order-meta-row">
                    <span>{order.distanceKm || 0} km</span>
                    <span>{order.durationMinutes || 0} min</span>
                  </div>
                  <div className="order-actions-row">
                    <button type="button" className="secondary-btn" onClick={() => setSelectedOrderId(order.id)}>
                      Focus Route
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      ) : (
        <SectionCard title="No Active Routes" description="There are no active deliveries available for map tracking right now.">
          <p className="helper-text">Once deliveries are assigned and active, they will appear here.</p>
        </SectionCard>
      )}

      <SectionCard
        title="Kenya Counties and Categories"
        description="Temporary county boundaries with category filters. Marker data combines live order points, backend locations, and temporary business samples."
      >
        <div className="map-filter-row" style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <label style={{ display: "grid", gap: "0.35rem", minWidth: "220px" }}>
            <span className="helper-text">County</span>
            <select className="form-select" value={selectedCounty} onChange={(event) => setSelectedCounty(event.target.value)}>
              {countyOptions.map((county) => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.35rem", minWidth: "220px" }}>
            <span className="helper-text">Category</span>
            <select className="form-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </label>
        </div>

        <MapboxMap
          showCountyBoundaries
          countyGeoJson={kenyaCountiesSampleGeoJson}
          businessMarkers={explorerMarkers}
          defaultCenter={countyCenter}
          defaultZoom={selectedCounty === "All Counties" ? 6 : 9}
        />

        <p className="helper-text" style={{ marginTop: "0.75rem" }}>
          Showing {explorerMarkers.length} markers for {selectedCategory === "all" ? "all categories" : selectedCategory.replaceAll("_", " ")}
          {selectedCounty === "All Counties" ? " across Kenya." : ` in ${selectedCounty}.`}
        </p>
      </SectionCard>
    </section>
  );
}
