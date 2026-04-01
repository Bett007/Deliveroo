import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { cancelOrder, updateOrderDestination } from "../features/orders/ordersSlice";
import { validateDestination } from "../features/orders/orderValidators";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrders, orderHistory } = useSelector((state) => state.orders);
  const [destination, setDestination] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const order = useMemo(() => [...currentOrders, ...orderHistory].find((item) => item.id === orderId), [currentOrders, orderHistory, orderId]);

  if (!order) {
    return (
      <section className="workspace-page">
        <EmptyState title="Order not found" description="We could not find that parcel order." action={<Link to="/orders" className="primary-btn">Back to Orders</Link>} />
      </section>
    );
  }

  const canEditDestination = !["delivered", "cancelled"].includes(order.status);
  const canCancel = !["delivered", "cancelled"].includes(order.status);

  function handleUpdateDestination(event) {
    event.preventDefault();
    const error = validateDestination(destination);

    if (error) {
      setDestinationError(error);
      return;
    }

    dispatch(updateOrderDestination({ id: order.id, destination: destination.trim() }));
    setDestination("");
    setDestinationError("");
  }

  function handleCancelOrder() {
    dispatch(cancelOrder(order.id));
    navigate("/orders", { replace: true, state: { message: `${order.id} was cancelled.` } });
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
          </div>
        </SectionCard>

        <SectionCard title="Manage Delivery" description="Change destination or cancel before the parcel is marked as delivered.">
          {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
          <form className="auth-form" onSubmit={handleUpdateDestination}>
            <FormField id="new-destination" label="Change Destination" error={destinationError}>
              <input
                id="new-destination"
                name="destination"
                placeholder="Enter a new destination"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setDestinationError("");
                }}
                disabled={!canEditDestination}
              />
            </FormField>

            <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination}>
              Update Destination
            </Button>
          </form>

          <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel}>
            Cancel Order
          </Button>
        </SectionCard>
      </div>
    </section>
  );
}
