import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearOrderError, createOrder, loadOrderReferenceData } from "../features/orders/ordersSlice";
import { validateCreateOrderForm } from "../features/orders/orderValidators";
import "./CreateOrderPage.module.css";

const initialFormData = {
  parcelName: "",
  pickupLocationId: "",
  destinationLocationId: "",
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

  useEffect(() => {
    dispatch(clearOrderError());
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  useEffect(() => {
    setErrors((current) => ({
      ...current,
      pickupLocation: fieldErrors.pickup_location_id?.[0] ?? current.pickupLocation,
      destination: fieldErrors.delivery_location_id?.[0] ?? current.destination,
      parcelName: fieldErrors.description?.[0] ?? current.parcelName,
      weightKg: fieldErrors.weight?.[0] ?? current.weightKg,
      weightCategoryId: fieldErrors.weight_category_id?.[0] ?? current.weightCategoryId,
    }));
  }, [fieldErrors]);

  const selectedWeightCategory = useMemo(
    () => referenceData.weightCategories.find((item) => String(item.id) === String(formData.weightCategoryId)),
    [referenceData.weightCategories, formData.weightCategoryId],
  );
  const selectedPickup = useMemo(
    () => referenceData.locations.find((item) => String(item.id) === String(formData.pickupLocationId)),
    [formData.pickupLocationId, referenceData.locations],
  );
  const selectedDestination = useMemo(
    () => referenceData.locations.find((item) => String(item.id) === String(formData.destinationLocationId)),
    [formData.destinationLocationId, referenceData.locations],
  );
  const completedSteps = [
    formData.parcelName,
    formData.pickupLocationId,
    formData.destinationLocationId,
    formData.weightCategoryId,
    formData.weightKg,
  ].filter(Boolean).length;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    dispatch(clearOrderError());
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCreateOrderForm(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      pickup_location_id: Number(formData.pickupLocationId),
      delivery_location_id: Number(formData.destinationLocationId),
      quoted_price: Number(selectedWeightCategory?.basePrice ?? 0),
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
    <section className="workspace-page ops-page">
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

            <div className="form-grid-two">
              <FormField id="pickup-location" label="Pickup Location" error={errors.pickupLocation}>
                <select
                  id="pickup-location"
                  name="pickupLocationId"
                  className="form-select"
                  value={formData.pickupLocationId}
                  onChange={handleChange}
                  disabled={referenceStatus === "loading"}
                >
                  <option value="">Select pickup location</option>
                  {referenceData.locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField id="destination" label="Destination" error={errors.destination}>
                <select
                  id="destination"
                  name="destinationLocationId"
                  className="form-select"
                  value={formData.destinationLocationId}
                  onChange={handleChange}
                  disabled={referenceStatus === "loading"}
                >
                  <option value="">Select destination</option>
                  {referenceData.locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.label}</option>
                  ))}
                </select>
              </FormField>
            </div>

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

            <Button type="submit" className="primary-btn full-width" disabled={createStatus === "loading"}>
              {createStatus === "loading" ? "Creating Order..." : "Create Order"}
            </Button>
          </form>
        </section>

        <aside className="create-order-aside">
          <section className="ops-insight-card quote-card">
            <p className="card-label">Quoted Price</p>
            <h2>{selectedWeightCategory ? `KES ${selectedWeightCategory.basePrice}` : "KES --"}</h2>
            <p className="helper-text">Calculated from the selected weight band.</p>
          </section>

          <section className="ops-insight-card">
            <p className="card-label">Route Preview</p>
            <h2>{selectedPickup && selectedDestination ? "Ready" : "Choose route"}</h2>
            <div className="route-preview">
              <div>
                <span>P</span>
                <strong>{selectedPickup?.label || "Pickup location"}</strong>
              </div>
              <i aria-hidden="true"></i>
              <div>
                <span>D</span>
                <strong>{selectedDestination?.label || "Drop-off location"}</strong>
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
