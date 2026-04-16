import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { MapboxMap } from "../components/ui/MapboxMap";
import { clearOrderError, createOrder, loadOrderReferenceData } from "../features/orders/ordersSlice";
import { validateCreateOrderForm } from "../features/orders/orderValidators";
import { autocompleteAddress, geocodeAddress, fetchRoutePreview } from "../services/mapbox";
import styles from "./CreateOrderPage.module.css";

const counties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kiambu",
  "Machakos",
];

const initialFormData = {
  parcelName: "",
  pickupCounty: "",
  pickupStreet: "",
  destinationCounty: "",
  destinationStreet: "",
  weightCategoryId: "",
  weightKg: "",
  description: "",
};

export function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error, fieldErrors, referenceData, referenceStatus } = useSelector((state) => state.orders);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [routePreview, setRoutePreview] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupLiveCoords, setPickupLiveCoords] = useState(null);
  const [destinationLiveCoords, setDestinationLiveCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [routeStatus, setRouteStatus] = useState("idle");
  const [routeError, setRouteError] = useState("");


  useEffect(() => {
    dispatch(clearOrderError());
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  useEffect(() => {
    setErrors((current) => ({
      ...current,
      parcelName: fieldErrors.description?.[0] ?? current.parcelName,
      weightKg: fieldErrors.weight?.[0] ?? current.weightKg,
      weightCategoryId: fieldErrors.weight_category_id?.[0] ?? current.weightCategoryId,
    }));
  }, [fieldErrors]);

  useEffect(() => {
    let active = true;

    async function loadPickupSuggestions() {
      if (!formData.pickupCounty || formData.pickupStreet.trim().length < 2) {
        setPickupSuggestions([]);
        return;
      }

      try {
        const results = await autocompleteAddress(formData.pickupStreet, formData.pickupCounty);
        if (active) {
          setPickupSuggestions(results);
        }
      } catch (suggestionError) {
        console.warn("Pickup autocomplete error:", suggestionError);
        if (active) {
          setPickupSuggestions([]);
        }
      }
    }

    const timer = setTimeout(() => {
      loadPickupSuggestions();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.pickupCounty, formData.pickupStreet]);

  useEffect(() => {
    let active = true;

    async function loadDestinationSuggestions() {
      if (!formData.destinationCounty || formData.destinationStreet.trim().length < 2) {
        setDestinationSuggestions([]);
        return;
      }

      try {
        const results = await autocompleteAddress(formData.destinationStreet, formData.destinationCounty);
        if (active) {
          setDestinationSuggestions(results);
        }
      } catch (suggestionError) {
        console.warn("Destination autocomplete error:", suggestionError);
        if (active) {
          setDestinationSuggestions([]);
        }
      }
    }

    const timer = setTimeout(() => {
      loadDestinationSuggestions();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.destinationCounty, formData.destinationStreet]);

  useEffect(() => {
    let active = true;
    const query = buildLocationQuery(formData.pickupStreet, formData.pickupCounty);

    if (!formData.pickupCounty) {
      setPickupLiveCoords(null);
      return () => {
        active = false;
      };
    }

    const timer = setTimeout(async () => {
      if (!active) return;
      console.log('Pickup geocode query:', query);
      try {
        const location = await geocodeAddress(query);
        console.log('Pickup location:', location);
        if (active) {
          setPickupLiveCoords(location);
        }
      } catch (err) {
        console.error('Pickup geocode error:', err);
        if (active) {
          setPickupLiveCoords(null);
        }
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.pickupCounty, formData.pickupStreet]);

  useEffect(() => {
    let active = true;
    const query = buildLocationQuery(formData.destinationStreet, formData.destinationCounty);

    if (!formData.destinationCounty) {
      setDestinationLiveCoords(null);
      return () => {
        active = false;
      };
    }

    const timer = setTimeout(async () => {
      if (!active) return;
      console.log('Destination geocode query:', query);
      try {
        const location = await geocodeAddress(query);
        console.log('Destination location:', location);
        if (active) {
          setDestinationLiveCoords(location);
        }
      } catch (err) {
        console.error('Destination geocode error:', err);
        if (active) {
          setDestinationLiveCoords(null);
        }
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [formData.destinationCounty, formData.destinationStreet]);

  // Auto-preview route when both live coords ready
  useEffect(() => {
    let cancelled = false;

    async function autoPreview() {
      if (pickupLiveCoords && destinationLiveCoords && routeStatus !== "loading") {
        console.log('Auto-previewing live route...');
        setRouteStatus("loading");
        try {
          const preview = await fetchRoutePreview(pickupLiveCoords, destinationLiveCoords);
          if (!cancelled) {
            setPickupCoords(pickupLiveCoords);
            setDestinationCoords(destinationLiveCoords);
            setRoutePreview(preview);
            setRouteStatus("success");
          }
        } catch (err) {
          console.error('Live route preview error:', err);
          if (!cancelled) {
            setRouteStatus("error");
            setRouteError(err.message || "Live route preview failed");
          }
        }
      }
    }

    autoPreview();

    return () => {
      cancelled = true;
    };
  }, [pickupLiveCoords, destinationLiveCoords, routeStatus]);

  const selectedWeightCategory = useMemo(
    () => referenceData.weightCategories.find((item) => String(item.id) === String(formData.weightCategoryId)),
    [referenceData.weightCategories, formData.weightCategoryId],
  );
  const pickupLocationLabel = buildAddress(formData.pickupStreet, formData.pickupCounty) || formData.pickupCounty;
  const destinationLocationLabel = buildAddress(formData.destinationStreet, formData.destinationCounty) || formData.destinationCounty;
  const mapOriginCoords = pickupCoords || pickupLiveCoords;
  const mapDestinationCoords = destinationCoords || destinationLiveCoords;
  const completedSteps = [
    formData.parcelName,
    formData.pickupCounty && formData.pickupStreet,
    formData.destinationCounty && formData.destinationStreet,
    formData.weightCategoryId,
    formData.weightKg,
  ].filter(Boolean).length;

  function buildLocationQuery(street, county) {
    const streetText = String(street || "").trim();
    const countyText = String(county || "").trim();

    if (!countyText) {
      return "";
    }

    if (!streetText) {
      return `${countyText}, Kenya`;
    }

    // Better for businesses: always append county if not included
    return streetText.toLowerCase().includes(countyText.toLowerCase())
      ? `${streetText}, Kenya`
      : `${streetText}, ${countyText}`;
  }

  function buildAddress(street, county) {
    const streetText = String(street || "").trim();
    const countyText = String(county || "").trim();

    if (!streetText || !countyText) {
      return streetText || countyText || "";
    }

    return streetText.toLowerCase().includes(countyText.toLowerCase())
      ? streetText
      : `${streetText}, ${countyText}`;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "pickupCounty" ? { pickupStreet: "" } : {}),
      ...(name === "destinationCounty" ? { destinationStreet: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setRouteError("");
    setRoutePreview(null);
    setPickupCoords(null);
    setDestinationCoords(null);
    setRouteStatus("idle");
    if (name === "pickupCounty") {
      setPickupSuggestions([]);
    }
    if (name === "destinationCounty") {
      setDestinationSuggestions([]);
    }
    dispatch(clearOrderError());
  }

  async function handleRoutePreview() {
    const pickupAddress = buildLocationQuery(formData.pickupStreet, formData.pickupCounty);
    const destinationAddress = buildLocationQuery(formData.destinationStreet, formData.destinationCounty);

    if (!pickupAddress || !destinationAddress) {
      setErrors({
        pickupCounty: !formData.pickupCounty ? "Pickup county is required." : undefined,
        pickupStreet: !formData.pickupStreet ? "Pickup street or location is required." : undefined,
        destinationCounty: !formData.destinationCounty ? "Destination county is required." : undefined,
        destinationStreet: !formData.destinationStreet ? "Destination street or location is required." : undefined,
      });
      setRouteStatus("error");
      setRouteError("Choose both a pickup and destination location before previewing the route.");
      return null;
    }

    setRouteStatus("loading");
    setRouteError("");
    setRoutePreview(null);

    try {
      const pickup = await geocodeAddress(pickupAddress);
      const destination = await geocodeAddress(destinationAddress);
      const preview = await fetchRoutePreview(pickup, destination);

      setPickupCoords(pickup);
      setDestinationCoords(destination);
      setRoutePreview(preview);
      setRouteStatus("success");
      return { pickup, destination, preview };
    } catch (previewError) {
      setRouteStatus("error");
      setRouteError(previewError.message || "Unable to preview route.");
      return null;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCreateOrderForm(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    let previewData = routePreview;
    if (!previewData) {
      const result = await handleRoutePreview();
      if (!result) {
        return;
      }
      previewData = result.preview;
    }

    const pickupAddress = buildAddress(formData.pickupStreet, formData.pickupCounty);
    const destinationAddress = buildAddress(formData.destinationStreet, formData.destinationCounty);
    const payload = {
      quoted_price: Number(selectedWeightCategory?.basePrice ?? 0),
      pickup_location: {
        address: pickupAddress,
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
      },
      delivery_location: {
        address: destinationAddress,
        latitude: destinationCoords.latitude,
        longitude: destinationCoords.longitude,
      },
      distance_km: previewData.distanceKm,
      estimated_duration_minutes: previewData.durationMinutes,
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
              <p>{completedSteps}/5 required details complete.</p>
            </div>
          </div>
          <div className="order-builder-progress" aria-label="Order creation progress">
            {["Parcel", "Pickup", "Drop-off", "Weight", "Price"].map((item, index) => (
              <span key={item} className={completedSteps > index ? "complete" : ""}>{item}</span>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? <p className="form-status error">{error}</p> : null}

            <FormField id="parcel-name" label="Parcel Name" error={errors.parcelName}>
              <input id="parcel-name" name="parcelName" value={formData.parcelName} onChange={handleChange} placeholder="e.g. Office documents" />
            </FormField>

            {/* Counties side by side */}
            <div className="form-grid-two">
              <FormField id="pickup-county" label="Pickup County" error={errors.pickupCounty}>
                <select id="pickup-county" name="pickupCounty" className="form-select" value={formData.pickupCounty} onChange={handleChange}>
                  <option value="">Choose county</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </FormField>

              <FormField id="destination-county" label="Destination County" error={errors.destinationCounty}>
                <select id="destination-county" name="destinationCounty" className="form-select" value={formData.destinationCounty} onChange={handleChange}>
                  <option value="">Choose county</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Pickup street */}
            <FormField id="pickup-street" label="Pickup Street or Location" error={errors.pickupStreet}>
              <input
                id="pickup-street"
                name="pickupStreet"
                value={formData.pickupStreet}
                onChange={handleChange}
                list="pickup-street-suggestions"
                placeholder="Start typing a street or landmark"
                disabled={!formData.pickupCounty}
              />
              <datalist id="pickup-street-suggestions">
                {pickupSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.label} />
                ))}
              </datalist>
            </FormField>

            {/* Destination street */}
            <FormField id="destination-street" label="Destination Street or Location" error={errors.destinationStreet}>
              <input
                id="destination-street"
                name="destinationStreet"
                value={formData.destinationStreet}
                onChange={handleChange}
                list="destination-street-suggestions"
                placeholder="Start typing a street or landmark"
                disabled={!formData.destinationCounty}
              />
              <datalist id="destination-street-suggestions">
                {destinationSuggestions.map((suggestion) => (
                  <option key={suggestion.id} value={suggestion.label} />
                ))}
              </datalist>
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

              <FormField id="weight-kg" label="Parcel Weight (kg)" error={errors.weightKg}>
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

            <div className="route-action-row">
              <Button
                type="button"
                className="secondary-btn"
                onClick={handleRoutePreview}
                disabled={
                  !formData.pickupCounty ||
                  !formData.pickupStreet ||
                  !formData.destinationCounty ||
                  !formData.destinationStreet ||
                  routeStatus === "loading"
                }
              >
                {routeStatus === "loading" ? "Previewing route..." : "Preview Route"}
              </Button>
            </div>

            <Button type="submit" className="primary-btn full-width" disabled={createStatus === "loading"}>
              {createStatus === "loading" ? "Creating Order..." : "Create Order"}
            </Button>
          </form>
        </section>

        <aside className="create-order-aside">
          <section className="workspace-panel route-summary-panel">
            <div className="section-header">
              <div>
                <h2>Route details</h2>
                <p>Map preview, travel distance, and estimated delivery time.</p>
              </div>
            </div>
            {routeStatus === "error" ? <p className="form-status error">{routeError}</p> : null}
            {(mapOriginCoords || mapDestinationCoords) ? (
              <div className="route-summary">
                {routePreview ? (
                  <div className="route-stats-row">
                    <div>
                      <p className="card-label">Distance</p>
                      <h3>{routePreview.distanceKm} km</h3>
                    </div>
                    <div>
                      <p className="card-label">Duration</p>
                      <h3>{routePreview.durationMinutes} min</h3>
                    </div>
                  </div>
                ) : (
                  <div className="route-stats-row">
                    <div>
                      <p className="card-label">Live map</p>
                      <h3>{formData.pickupCounty ? "County / street preview" : "Choose pickup"}</h3>
                    </div>
                  </div>
                )}
                <MapboxMap
                  origin={pickupLocationLabel}
                  destination={destinationLocationLabel}
                  originCoords={mapOriginCoords}
                  destinationCoords={mapDestinationCoords}
                  routeGeoJson={routePreview?.geometry}
                />
              </div>
            ) : (
              <div className="route-summary empty">
                <p className="helper-text">Select a pickup county and destination county to show the live map.</p>
              </div>
            )}
          </section>

          <section className="ops-insight-card quote-card">
            <p className="card-label">Quoted Price</p>
            <h2>{selectedWeightCategory ? `KES ${selectedWeightCategory.basePrice}` : "KES --"}</h2>
            <p className="helper-text">Calculated from the selected weight band.</p>
          </section>

          <section className="ops-insight-card">
            <p className="card-label">Route Preview</p>
            <h2>{formData.pickupStreet && formData.destinationStreet ? "Ready to preview" : "Enter route details"}</h2>
            <div className="route-preview">
              <div>
                <span>P</span>
                <strong>
                  {formData.pickupStreet && formData.pickupCounty
                    ? `${formData.pickupStreet}, ${formData.pickupCounty}`
                    : "Pickup location"}
                </strong>
              </div>
              <i aria-hidden="true"></i>
              <div>
                <span>D</span>
                <strong>
                  {formData.destinationStreet && formData.destinationCounty
                    ? `${formData.destinationStreet}, ${formData.destinationCounty}`
                    : "Destination location"}
                </strong>
              </div>
            </div>
          </section>

          <section className="ops-insight-card">
            <p className="card-label">Catalog</p>
            <h2>{referenceStatus === "loading" ? "Loading" : "Ready"}</h2>
            <div className="metric-pills">
              <span><strong>{referenceData.locations.length}</strong> locations</span>
              <span><strong>{referenceData.weightCategories.length}</strong> weight bands</span>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
