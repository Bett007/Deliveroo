import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  clearOrderError,
  loadOrderReferenceData,
  submitOrderCancellation,
  submitOrderDestinationUpdate,
} from "../features/orders/ordersSlice";
import { validateDestination } from "../features/orders/orderValidators";
import { formatReadableDate } from "../utils/formatters/date";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrders, orderHistory, referenceData, referenceStatus, updateStatus, status, error } = useSelector((state) => state.orders);
  const [destination, setDestination] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const order = useMemo(() => [...currentOrders, ...orderHistory].find((item) => item.id === orderId), [currentOrders, orderHistory, orderId]);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  if (!order && status === "loading") {
    return (
      <section className="workspace-page">
        <EmptyState title="Loading order" description="We are fetching the latest parcel details for you." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="workspace-page">
        <EmptyState title="Order not found" description="We could not find that parcel order." action={<Link to="/orders" className="primary-btn">Back to Orders</Link>} />
      </section>
    );
  }

  const canEditDestination = !["delivered", "cancelled"].includes(order.status);
  const canCancel = !["delivered", "cancelled"].includes(order.status);

  async function handleUpdateDestination(event) {
    event.preventDefault();
    const error = validateDestination(destination);

    if (error) {
      setDestinationError(error);
      return;
    }

    try {
      await dispatch(
        submitOrderDestinationUpdate({
          orderId: order.backendId,
          payload: { delivery_location_id: Number(destination) },
        }),
      ).unwrap();
      setDestination("");
      setDestinationError("");
    } catch {
      return;
    }
  }

  async function handleCancelOrder() {
    try {
      await dispatch(
        submitOrderCancellation({
          orderId: order.backendId,
          reason: "Cancelled by customer from order details.",
        }),
      ).unwrap();
      navigate("/orders", { replace: true, state: { message: `${order.id} was cancelled.` } });
    } catch {
      return;
    }
  }

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Order Details</p>
          <h1>{order.parcelName}</h1>
          <p className="workspace-copy">Track the parcel, review its route, and manage the destination or cancellation when the delivery rules allow it.</p>
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <div className="workspace-grid">
        <SectionCard title="Parcel Summary" description="Key details for this delivery order.">
          <div className="detail-list">
            <div><strong>Order ID:</strong> {order.id}</div>
            <div><strong>Status:</strong> <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
            <div><strong>Pickup:</strong> {order.pickupLocation}</div>
            <div><strong>Destination:</strong> {order.destination}</div>
            <div><strong>Weight:</strong> {order.weightCategory}</div>
            <div><strong>Description:</strong> {order.description}</div>
            <div><strong>Created:</strong> {formatReadableDate(order.createdAt)}</div>
            <div><strong>Last Updated:</strong> {formatReadableDate(order.updatedAt)}</div>
          </div>
        </SectionCard>

        <SectionCard title="Manage Delivery" description="Change destination or cancel before the parcel is marked as delivered.">
          {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
          <form className="auth-form" onSubmit={handleUpdateDestination}>
            <FormField id="new-destination" label="Change Destination" error={destinationError}>
              <select
                id="new-destination"
                name="destination"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setDestinationError("");
                  dispatch(clearOrderError());
                }}
                disabled={!canEditDestination || referenceStatus === "loading"}
                className="form-select"
              >
                <option value="">Select a new destination</option>
                {referenceData.locations
                  .filter((location) => String(location.id) !== String(order.destinationLocationId))
                  .map((location) => (
                    <option key={location.id} value={location.id}>{location.label}</option>
                  ))}
              </select>
            </FormField>

            <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination || updateStatus === "loading"}>
              {updateStatus === "loading" ? "Saving..." : "Update Destination"}
            </Button>
          </form>

          <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel || updateStatus === "loading"}>
            {updateStatus === "loading" ? "Updating..." : "Cancel Order"}
          </Button>
        </SectionCard>
      </div>

      <RouteMapCard origin={order.pickupLocation} destination={order.destination} distanceKm={order.distanceKm} durationMinutes={order.durationMinutes} />
    </section>
  );
}
