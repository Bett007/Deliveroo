import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { MapboxMap } from "../components/ui/MapboxMap";
import { clearOrderError, createOrder, loadOrderReferenceData } from "../features/orders/ordersSlice";
import { validateCreateOrderForm } from "../features/orders/orderValidators";
import { autocompleteAddress, fetchNairobiPlaceSuggestions, fetchRoutePreview, geocodeAddress, reverseGeocodeCoordinates } from "../services/mapbox";
import styles from "./CreateOrderPage.module.css";

const initialFormData = {
  parcelName: "",
  pickupLocation: "",
  destinationLocation: "",
  weightCategoryId: "",
  weightKg: "",
  description: "",
};

const NAIROBI_AREAS = [
  { name: "CBD", center: [36.8219, -1.2921] },
  { name: "Westlands", center: [36.805, -1.264] },
  { name: "Parklands", center: [36.8213, -1.2598] },
  { name: "Kilimani", center: [36.7981, -1.2839] },
  { name: "Lavington", center: [36.7679, -1.2833] },
  { name: "Upper Hill", center: [36.8148, -1.3024] },
  { name: "South B", center: [36.8442, -1.3078] },
  { name: "South C", center: [36.8302, -1.3193] },
  { name: "Karen", center: [36.685, -1.32] },
  { name: "Langata", center: [36.744, -1.35] },
  { name: "Embakasi", center: [36.902, -1.315] },
  { name: "Kasarani", center: [36.8947, -1.2289] },
  { name: "Roysambu", center: [36.8788, -1.2191] },
  { name: "Ngong Road", center: [36.7904, -1.3005] },
  { name: "Eastleigh", center: [36.85, -1.27] },
];

function normalizeSuggestion(feature) {
  return {
    id: feature.id,
    label: feature.label,
    address: feature.label,
    latitude: feature.latitude,
    longitude: feature.longitude,
  };
}

function getAreaByName(areaName) {
  return NAIROBI_AREAS.find((area) => area.name === areaName) || null;
}

function calculatePrice(basePrice, distanceKm) {
  const parsedBase = Number(basePrice || 0);
  if (!Number.isFinite(parsedBase) || parsedBase <= 0) {
    return null;
  }

  const deliveryFee = Number.isFinite(Number(distanceKm)) ? Number(distanceKm) * 15 : 0;
  return Number((parsedBase + deliveryFee).toFixed(2));
}

export function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { createStatus, error, fieldErrors, referenceData, referenceStatus } = useSelector((state) => state.orders);
  const didRetryReferenceLoad = useRef(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState("pickup");
  const [pickupAreaName, setPickupAreaName] = useState("");
  const [destinationAreaName, setDestinationAreaName] = useState("");

  const [routeStatus, setRouteStatus] = useState("idle");
  const [routeError, setRouteError] = useState("");
  const [nairobiSuggestions, setNairobiSuggestions] = useState([]);
  const [isLocatingPickup, setIsLocatingPickup] = useState(false);

  const selectedWeightCategory = useMemo(
    () => referenceData.weightCategories.find((item) => String(item.id) === String(formData.weightCategoryId)),
    [referenceData.weightCategories, formData.weightCategoryId],
  );

  useEffect(() => {
    dispatch(clearOrderError());
    if (!token) {
      return;
    }

    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
      return;
    }

    if (referenceStatus === "failed" && !didRetryReferenceLoad.current) {
      didRetryReferenceLoad.current = true;
      dispatch(loadOrderReferenceData());
    }

    if (referenceStatus === "succeeded") {
      didRetryReferenceLoad.current = false;
    }
  }, [dispatch, referenceStatus, token]);

  useEffect(() => {
    setErrors((current) => ({
      ...current,
      parcelName: fieldErrors.description?.[0] ?? current.parcelName,
      weightKg: fieldErrors.weight?.[0] ?? current.weightKg,
      weightCategoryId: fieldErrors.weight_category_id?.[0] ?? current.weightCategoryId,
      pickupLocation: fieldErrors.pickup_location?.[0] ?? current.pickupLocation,
      destinationLocation: fieldErrors.delivery_location?.[0] ?? current.destinationLocation,
    }));
  }, [fieldErrors]);

  useEffect(() => {
    let active = true;

    async function loadNairobiSuggestions() {
      try {
        const suggestions = await fetchNairobiPlaceSuggestions(4);
        if (active) {
          setNairobiSuggestions(suggestions);
        }
      } catch {
        if (active) {
          setNairobiSuggestions([]);
        }
      }
    }

    loadNairobiSuggestions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPickupSuggestions() {
      if (formData.pickupLocation.trim().length < 2) {
        setPickupSuggestions(nairobiSuggestions);
        return;
      }

      try {
        const results = await autocompleteAddress(formData.pickupLocation);
        if (active) {
          setPickupSuggestions(results.map(normalizeSuggestion));
        }
      } catch {
        if (active) {
          setPickupSuggestions([]);
        }
      }
    }

    const timer = setTimeout(loadPickupSuggestions, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.pickupLocation, nairobiSuggestions]);

  useEffect(() => {
    let active = true;

    async function loadDestinationSuggestions() {
      if (formData.destinationLocation.trim().length < 2) {
        setDestinationSuggestions(nairobiSuggestions);
        return;
      }

      try {
        const results = await autocompleteAddress(formData.destinationLocation);
        if (active) {
          setDestinationSuggestions(results.map(normalizeSuggestion));
        }
      } catch {
        if (active) {
          setDestinationSuggestions([]);
        }
      }
    }

    const timer = setTimeout(loadDestinationSuggestions, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.destinationLocation, nairobiSuggestions]);

  useEffect(() => {
    let cancelled = false;

    async function resolveRoute() {
      if (!pickup || !destination) {
        setRouteGeoJson(null);
        setDistance(null);
        setDuration(null);
        setRouteStatus("idle");
        return;
      }

      setRouteStatus("loading");
      setRouteError("");

      try {
        const preview = await fetchRoutePreview(pickup, destination);
        if (!cancelled) {
          setRouteGeoJson(preview.geometry);
          setDistance(preview.distanceKm);
          setDuration(preview.durationMinutes);
          setRouteStatus("success");
        }
      } catch (previewError) {
        if (!cancelled) {
          setRouteStatus("error");
          setRouteError(previewError.message || "Unable to preview route.");
          setRouteGeoJson(null);
          setDistance(null);
          setDuration(null);
        }
      }
    }

    resolveRoute();

    return () => {
      cancelled = true;
    };
  }, [pickup, destination]);

  useEffect(() => {
    setPrice(calculatePrice(selectedWeightCategory?.basePrice, distance));
  }, [selectedWeightCategory, distance]);

  function clearRouteState() {
    setRouteGeoJson(null);
    setDistance(null);
    setDuration(null);
    setRouteStatus("idle");
    setRouteError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    // When an area is selected, keep coordinates driven by the area selection.
    if (name === "pickupLocation" && pickupAreaName) {
      return;
    }
    if (name === "destinationLocation" && destinationAreaName) {
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
    dispatch(clearOrderError());

    if (name === "pickupLocation") {
      setPickup(null);
      setShowPickupSuggestions(true);
      clearRouteState();
    }

    if (name === "destinationLocation") {
      setDestination(null);
      setShowDestinationSuggestions(true);
      clearRouteState();
    }
  }

  function handleSelectPickup(suggestion) {
    setPickup({
      address: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setFormData((current) => ({ ...current, pickupLocation: suggestion.label }));
    setPickupSuggestions([]);
    setShowPickupSuggestions(false);
    setErrors((current) => ({ ...current, pickupLocation: "" }));
    setRouteError("");
    setActiveLocationField("pickup");
    setPickupAreaName("");
  }

  function handleSelectDestination(suggestion) {
    setDestination({
      address: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setFormData((current) => ({ ...current, destinationLocation: suggestion.label }));
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
    setErrors((current) => ({ ...current, destinationLocation: "" }));
    setRouteError("");
    setActiveLocationField("destination");
    setDestinationAreaName("");
  }

  function handleClearPickup() {
    setPickup(null);
    setFormData((current) => ({ ...current, pickupLocation: "" }));
    setPickupSuggestions([]);
    setShowPickupSuggestions(false);
    setPickupAreaName("");
    clearRouteState();
  }

  function handleClearDestination() {
    setDestination(null);
    setFormData((current) => ({ ...current, destinationLocation: "" }));
    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
    setDestinationAreaName("");
    clearRouteState();
  }

  function handleAreaSelect(target, areaName) {
    const area = NAIROBI_AREAS.find((item) => item.name === areaName);
    if (!area) {
      return;
    }

    const selected = {
      address: area.name,
      longitude: area.center[0],
      latitude: area.center[1],
    };

    if (target === "destination") {
      setDestination(selected);
      setDestinationAreaName(area.name);
      setFormData((current) => ({ ...current, destinationLocation: area.name }));
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      setErrors((current) => ({ ...current, destinationLocation: "" }));
      setActiveLocationField("destination");
    } else {
      setPickup(selected);
      setPickupAreaName(area.name);
      setFormData((current) => ({ ...current, pickupLocation: area.name }));
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      setErrors((current) => ({ ...current, pickupLocation: "" }));
      setActiveLocationField("pickup");
    }

    clearRouteState();
    setRouteError("");
  }

  async function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setErrors((current) => ({ ...current, pickupLocation: "Geolocation is not available in this browser." }));
      return;
    }

    setIsLocatingPickup(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const fallbackAddress = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        const selected = {
          address: fallbackAddress,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setPickup(selected);
        setFormData((current) => ({ ...current, pickupLocation: fallbackAddress }));
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
        setErrors((current) => ({ ...current, pickupLocation: "" }));
        setActiveLocationField("pickup");
        clearRouteState();
        setRouteError("");

        try {
          const resolved = await reverseGeocodeCoordinates(position.coords.latitude, position.coords.longitude);
          const resolvedPickup = {
            address: resolved.address,
            latitude: resolved.latitude,
            longitude: resolved.longitude,
          };

          setPickup(resolvedPickup);
          setFormData((current) => ({ ...current, pickupLocation: resolved.address }));
        } catch {
          // Keep fallback coordinate text if reverse-geocoding fails.
        } finally {
          setIsLocatingPickup(false);
        }
      },
      () => {
        setIsLocatingPickup(false);
        setErrors((current) => ({ ...current, pickupLocation: "Unable to access your current location." }));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  }

  async function resolveLocation(inputValue) {
    const resolved = await geocodeAddress(inputValue);
    return {
      address: resolved.address,
      latitude: resolved.latitude,
      longitude: resolved.longitude,
    };
  }

  async function handleMapLocationSelect(target, coords) {
    const fallbackAddress = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
    const selected = {
      address: fallbackAddress,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    if (target === "destination") {
      setDestination(selected);
      setFormData((current) => ({ ...current, destinationLocation: fallbackAddress }));
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
      setErrors((current) => ({ ...current, destinationLocation: "" }));
      setActiveLocationField("destination");
    } else {
      setPickup(selected);
      setFormData((current) => ({ ...current, pickupLocation: fallbackAddress }));
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      setErrors((current) => ({ ...current, pickupLocation: "" }));
      setActiveLocationField("pickup");
    }

    clearRouteState();
    setRouteError("");

    try {
      const resolved = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      const resolvedSelected = {
        address: resolved.address,
        latitude: resolved.latitude,
        longitude: resolved.longitude,
      };

      if (target === "destination") {
        setDestination(resolvedSelected);
        setFormData((current) => ({ ...current, destinationLocation: resolved.address }));
      } else {
        setPickup(resolvedSelected);
        setFormData((current) => ({ ...current, pickupLocation: resolved.address }));
      }
    } catch {
      // Keep fallback coordinate text if reverse-geocoding fails.
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCreateOrderForm(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    let pickupData = pickup;
    let destinationData = destination;

    if (!pickupData && pickupAreaName) {
      const area = getAreaByName(pickupAreaName);
      if (area) {
        pickupData = {
          address: area.name,
          longitude: area.center[0],
          latitude: area.center[1],
        };
        setPickup(pickupData);
      }
    }

    if (!destinationData && destinationAreaName) {
      const area = getAreaByName(destinationAreaName);
      if (area) {
        destinationData = {
          address: area.name,
          longitude: area.center[0],
          latitude: area.center[1],
        };
        setDestination(destinationData);
      }
    }

    try {
      if (!pickupData) {
        pickupData = await resolveLocation(formData.pickupLocation);
        setPickup(pickupData);
      }

      if (!destinationData) {
        destinationData = await resolveLocation(formData.destinationLocation);
        setDestination(destinationData);
      }
    } catch {
      setRouteError("Select valid pickup and destination locations from suggestions.");
      return;
    }

    let routePreview = null;
    try {
      routePreview = await fetchRoutePreview(pickupData, destinationData);
      setRouteGeoJson(routePreview.geometry);
      setDistance(routePreview.distanceKm);
      setDuration(routePreview.durationMinutes);
    } catch (previewError) {
      setRouteError(previewError.message || "Unable to preview route.");
      return;
    }

    const quotedPrice = calculatePrice(selectedWeightCategory?.basePrice, routePreview.distanceKm);
    if (quotedPrice == null) {
      setErrors((current) => ({ ...current, weightCategoryId: "Weight category is required." }));
      return;
    }

    const payload = {
      quoted_price: quotedPrice,
      pickup_location: {
        address: formData.pickupLocation.trim(),
        latitude: pickupData.latitude,
        longitude: pickupData.longitude,
      },
      delivery_location: {
        address: formData.destinationLocation.trim(),
        latitude: destinationData.latitude,
        longitude: destinationData.longitude,
      },
      distance_km: routePreview.distanceKm,
      estimated_duration_minutes: routePreview.durationMinutes,
      parcel: {
        description: formData.parcelName.trim(),
        weight: Number(formData.weightKg),
        weight_category_id: Number(formData.weightCategoryId),
        special_instructions: formData.description.trim(),
      },
    };

    const result = await dispatch(createOrder(payload));

    if (createOrder.fulfilled.match(result)) {
      navigate(`/orders/${result.payload.order.id}`, {
        replace: true,
        state: { message: "Order created successfully." },
      });
    }
  }

  return (
    <section className={`workspace-page ops-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Create Parcel</p>
          <h1>Create delivery order</h1>
          <p className="workspace-copy">Build the route, choose weight, confirm price.</p>
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <div className="create-order-grid">
        <section className="workspace-panel create-order-panel">
          <div className="section-header">
            <div>
              <h2>Parcel Details</h2>
              <p>Complete the required fields.</p>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? <p className="form-status error">{error}</p> : null}

            <FormField id="parcel-name" label="Parcel Name" error={errors.parcelName}>
              <input id="parcel-name" name="parcelName" value={formData.parcelName} onChange={handleChange} placeholder="e.g. Office documents" />
            </FormField>

            <FormField id="pickup-location" label="Pickup Location" error={errors.pickupLocation}>
              <div className="location-input-wrap">
                <select
                  id="pickup-area"
                  name="pickupArea"
                  className="form-select"
                  value={pickupAreaName}
                  onChange={(event) => handleAreaSelect("pickup", event.target.value)}
                  onFocus={() => setActiveLocationField("pickup")}
                >
                  <option value="">Select pickup area in Nairobi</option>
                  {NAIROBI_AREAS.map((area) => (
                    <option key={area.name} value={area.name}>{area.name}</option>
                  ))}
                </select>
                <input
                  id="pickup-location"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  onFocus={() => {
                    setShowPickupSuggestions(true);
                    setActiveLocationField("pickup");
                  }}
                  onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 120)}
                  placeholder="Search for a place..."
                  readOnly={Boolean(pickupAreaName)}
                />
                <div className="input-actions-row">
                  <button type="button" className="secondary-btn tiny-btn" onClick={handleUseMyLocation} disabled={isLocatingPickup}>
                    {isLocatingPickup ? "Locating..." : "Use my location"}
                  </button>
                  <button type="button" className="secondary-btn tiny-btn" onClick={handleClearPickup}>Reset pickup</button>
                </div>
                {showPickupSuggestions && pickupSuggestions.length ? (
                  <ul className="location-suggestions" role="listbox" aria-label="Pickup suggestions">
                    {pickupSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button type="button" onMouseDown={() => handleSelectPickup(suggestion)}>
                          {suggestion.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="helper-text">Tip: choose a Nairobi area above or click the map to place pickup.</p>
              </div>
            </FormField>

            <FormField id="destination-location" label="Destination Location" error={errors.destinationLocation}>
              <div className="location-input-wrap">
                <select
                  id="destination-area"
                  name="destinationArea"
                  className="form-select"
                  value={destinationAreaName}
                  onChange={(event) => handleAreaSelect("destination", event.target.value)}
                  onFocus={() => setActiveLocationField("destination")}
                >
                  <option value="">Select destination area in Nairobi</option>
                  {NAIROBI_AREAS.map((area) => (
                    <option key={area.name} value={area.name}>{area.name}</option>
                  ))}
                </select>
                <input
                  id="destination-location"
                  name="destinationLocation"
                  value={formData.destinationLocation}
                  onChange={handleChange}
                  onFocus={() => {
                    setShowDestinationSuggestions(true);
                    setActiveLocationField("destination");
                  }}
                  onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 120)}
                  placeholder="Search for a place..."
                  readOnly={Boolean(destinationAreaName)}
                />
                <div className="input-actions-row">
                  <button type="button" className="secondary-btn tiny-btn" onClick={handleClearDestination}>Reset destination</button>
                </div>
                {showDestinationSuggestions && destinationSuggestions.length ? (
                  <ul className="location-suggestions" role="listbox" aria-label="Destination suggestions">
                    {destinationSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button type="button" onMouseDown={() => handleSelectDestination(suggestion)}>
                          {suggestion.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="helper-text">Tip: choose area above or click map after focusing this field.</p>
              </div>
            </FormField>

            <div className="form-grid-two">
              <FormField id="weight-category" label="Weight Category" error={errors.weightCategoryId}>
                <select id="weight-category" name="weightCategoryId" className="form-select" value={formData.weightCategoryId} onChange={handleChange}>
                  <option value="">Select weight category</option>
                  {referenceData.weightCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.minWeight}kg - {category.maxWeight}kg)
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="weight-kg" label="Parcel Weight" error={errors.weightKg}>
                <input
                  id="weight-kg"
                  name="weightKg"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weightKg}
                  onChange={handleChange}
                  placeholder="e.g. 1.5"
                />
              </FormField>
            </div>

            <FormField id="description" label="Parcel Description" error={errors.description}>
              <textarea id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange} placeholder="Add handling notes or delivery instructions" />
            </FormField>

            <Button type="submit" className="primary-btn full-width" disabled={createStatus === "loading"}>
              {createStatus === "loading" ? "Creating Order..." : "Create Order"}
            </Button>
          </form>
        </section>

        <aside className="create-order-aside">
          <section className="workspace-panel route-summary-panel">
            <div className="section-header">
              <div>
                <h2>Map & Results</h2>
                <p>Distance, estimated time, and price are calculated automatically.</p>
              </div>
            </div>

            {routeStatus === "error" ? <p className="form-status error">{routeError}</p> : null}

            <div className="route-summary">
              <MapboxMap
                origin={pickup?.address}
                destination={destination?.address}
                originCoords={pickup}
                destinationCoords={destination}
                routeGeoJson={routeGeoJson}
                showNearbyPlaces={!pickup && !destination}
                clickTarget={activeLocationField}
                onPickupSelect={(coords) => handleMapLocationSelect("pickup", coords)}
                onDestinationSelect={(coords) => handleMapLocationSelect("destination", coords)}
              />
              {!pickup || !destination ? (
                <div className="route-summary empty">
                  <p className="helper-text">Select pickup and destination to draw a route. Nearby places are shown on the Kenya map.</p>
                </div>
              ) : null}

              <div className="route-stats-row single-column">
                <div>
                  <p className="card-label">Distance</p>
                  <h3>{distance != null ? `${distance} km` : "--"}</h3>
                </div>
                <div>
                  <p className="card-label">Estimated Time</p>
                  <h3>{duration != null ? `${duration} min` : "--"}</h3>
                </div>
                <div>
                  <p className="card-label">Price</p>
                  <h3>{price != null ? `KES ${price}` : "KES --"}</h3>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
