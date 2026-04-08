import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearOrderError, loadOrderReferenceData, submitOrder } from "../features/orders/ordersSlice";
import { validateCreateOrderForm } from "../features/orders/orderValidators";

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
    }));
  }, [fieldErrors]);

  const selectedWeightCategory = useMemo(
    () => referenceData.weightCategories.find((item) => String(item.id) === String(formData.weightCategoryId)),
    [referenceData.weightCategories, formData.weightCategoryId],
  );

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

    const quotedPrice = selectedWeightCategory?.basePrice ?? 0;
    const payload = {
      pickup_location_id: Number(formData.pickupLocationId),
      delivery_location_id: Number(formData.destinationLocationId),
      quoted_price: Number(quotedPrice),
      parcel: {
        description: formData.parcelName.trim(),
        weight: Number(formData.weightKg),
        weight_category_id: Number(formData.weightCategoryId),
        special_instructions: formData.description.trim(),
      },
    };

    try {
      const result = await dispatch(submitOrder(payload)).unwrap();
      navigate(`/orders/${result.order.id}`, { replace: true });
    } catch {
      return;
    }
  }

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Create Parcel</p>
          <h1>Create a new parcel delivery order</h1>
          <p className="workspace-copy">Capture the parcel details, pickup point, and destination before sending it into the delivery flow.</p>
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <section className="glass-card workspace-panel form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="parcel-name" label="Parcel Name" error={errors.parcelName}>
            <input id="parcel-name" name="parcelName" value={formData.parcelName} onChange={handleChange} placeholder="e.g. Office documents" />
          </FormField>

          {error ? <p className="form-status error">{error}</p> : null}

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

          <FormField id="weight-category" label="Weight Category">
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

          <FormField id="description" label="Parcel Description" error={errors.description}>
            <textarea id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange} placeholder="Add handling notes or delivery instructions" />
          </FormField>

          {selectedWeightCategory ? (
            <p className="helper-text">Quoted price: KES {selectedWeightCategory.basePrice}</p>
          ) : null}

          <Button type="submit" className="primary-btn full-width" disabled={createStatus === "loading"}>
            {createStatus === "loading" ? "Creating Order..." : "Create Order"}
          </Button>
        </form>
      </section>
    </section>
  );
}
