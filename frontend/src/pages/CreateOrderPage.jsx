import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { createOrder } from "../features/orders/ordersSlice";

const initialFormData = {
  parcelName: "",
  pickupLocation: "",
  destination: "",
  weightCategory: "light",
  description: "",
};

export function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const action = createOrder(formData);
    dispatch(action);
    navigate(`/orders/${action.payload.id || ""}`, { replace: true });
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
          <FormField id="parcel-name" label="Parcel Name">
            <input id="parcel-name" name="parcelName" value={formData.parcelName} onChange={handleChange} placeholder="e.g. Office documents" />
          </FormField>

          <FormField id="pickup-location" label="Pickup Location">
            <input id="pickup-location" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} placeholder="Enter pickup location" />
          </FormField>

          <FormField id="destination" label="Destination">
            <input id="destination" name="destination" value={formData.destination} onChange={handleChange} placeholder="Enter destination" />
          </FormField>

          <FormField id="weight-category" label="Weight Category">
            <select id="weight-category" name="weightCategory" className="form-select" value={formData.weightCategory} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </FormField>

          <FormField id="description" label="Parcel Description">
            <textarea id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange} placeholder="Describe what is being delivered" />
          </FormField>

          <Button type="submit" className="primary-btn full-width">Create Order</Button>
        </form>
      </section>
    </section>
  );
}
