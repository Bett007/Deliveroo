import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { clearOrderError, createOrder } from "../features/orders/ordersSlice";
import { validateCreateOrderForm } from "../features/orders/orderValidators";

const initialFormData = {
  pickupLocationId: "",
  deliveryLocationId: "",
  quotedPrice: "",
  parcelDescription: "",
  weight: "",
  weightCategoryId: "",
  specialInstructions: "",
  imageUrl: "",
};

export function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error, fieldErrors } = useSelector((state) => state.orders);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const backendTips = useMemo(
    () => [
      "Use numeric location IDs because the backend does not expose a location lookup endpoint yet.",
      "Use the weight category ID created by the backend team for your database seed data.",
      "Optional parcel fields like image URL and instructions can be left blank.",
    ],
    [],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
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
      delivery_location_id: Number(formData.deliveryLocationId),
      quoted_price: Number(formData.quotedPrice),
      parcel: {
        description: formData.parcelDescription.trim(),
        weight: Number(formData.weight),
        weight_category_id: Number(formData.weightCategoryId),
        image_url: formData.imageUrl.trim() || null,
        special_instructions: formData.specialInstructions.trim() || null,
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
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Create Parcel</p>
          <h1>Create a backend-ready delivery order</h1>
          <p className="workspace-copy">
            This form now matches the API the backend team shipped, including numeric location and weight category identifiers.
          </p>
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <div className="workspace-grid">
        <section className="glass-card workspace-panel form-panel">
          <div className="section-header">
            <div>
              <h2>Order payload</h2>
              <p>Enter the required IDs and parcel values expected by <code>POST /api/orders/</code>.</p>
            </div>
          </div>

          {error ? <p className="form-status error">{error}</p> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <FormField id="pickup-location-id" label="Pickup Location ID" error={errors.pickupLocationId || fieldErrors.pickup_location_id?.[0]}>
              <input id="pickup-location-id" name="pickupLocationId" value={formData.pickupLocationId} onChange={handleChange} placeholder="e.g. 1" inputMode="numeric" />
            </FormField>

            <FormField id="delivery-location-id" label="Delivery Location ID" error={errors.deliveryLocationId || fieldErrors.delivery_location_id?.[0]}>
              <input id="delivery-location-id" name="deliveryLocationId" value={formData.deliveryLocationId} onChange={handleChange} placeholder="e.g. 2" inputMode="numeric" />
            </FormField>

            <FormField id="quoted-price" label="Quoted Price" error={errors.quotedPrice || fieldErrors.quoted_price?.[0]}>
              <input id="quoted-price" name="quotedPrice" value={formData.quotedPrice} onChange={handleChange} placeholder="e.g. 1450" inputMode="decimal" />
            </FormField>

            <FormField id="parcel-description" label="Parcel Description" error={errors.parcelDescription || fieldErrors.description?.[0] || fieldErrors.parcel?.[0]}>
              <textarea id="parcel-description" name="parcelDescription" className="form-textarea" value={formData.parcelDescription} onChange={handleChange} placeholder="Describe what is being delivered" />
            </FormField>

            <FormField id="parcel-weight" label="Parcel Weight" error={errors.weight || fieldErrors.weight?.[0]}>
              <input id="parcel-weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 2.5" inputMode="decimal" />
            </FormField>

            <FormField id="weight-category-id" label="Weight Category ID" error={errors.weightCategoryId || fieldErrors.weight_category_id?.[0]}>
              <input id="weight-category-id" name="weightCategoryId" value={formData.weightCategoryId} onChange={handleChange} placeholder="e.g. 1" inputMode="numeric" />
            </FormField>

            <FormField id="special-instructions" label="Special Instructions">
              <textarea id="special-instructions" name="specialInstructions" className="form-textarea" value={formData.specialInstructions} onChange={handleChange} placeholder="Optional handling notes" />
            </FormField>

            <FormField id="image-url" label="Parcel Image URL">
              <input id="image-url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Optional public image URL" />
            </FormField>

            <Button type="submit" className="primary-btn full-width" disabled={createStatus === "loading"}>
              {createStatus === "loading" ? "Creating Order..." : "Create Order"}
            </Button>
          </form>
        </section>

        <section className="glass-card workspace-panel">
          <div className="section-header">
            <div>
              <h2>Backend notes</h2>
              <p>These constraints come from the APIs available so far.</p>
            </div>
          </div>

          <div className="feature-list">
            {backendTips.map((tip) => (
              <article key={tip} className="feature-item">
                <p>{tip}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
