import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { cancelOrder, clearOrderError, fetchOrderById, fetchTrackingUpdates, updateOrderDestination } from "../features/orders/ordersSlice";
import { validateDestination } from "../features/orders/orderValidators";
import { formatReadableDate } from "../utils/formatters/date";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentOrders,
    orderHistory,
    selectedOrder,
    trackingUpdates,
    detailsStatus,
    trackingStatus,
    mutationStatus,
    error,
    fieldErrors,
  } = useSelector((state) => state.orders);
  const [destination, setDestination] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [destinationError, setDestinationError] = useState("");

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    dispatch(fetchTrackingUpdates(orderId));

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch, orderId]);

  const order = useMemo(() => {
    const mergedOrders = [...currentOrders, ...orderHistory];
    return mergedOrders.find((item) => String(item.id) === String(orderId)) || (String(selectedOrder?.id) === String(orderId) ? selectedOrder : null);
  }, [currentOrders, orderHistory, orderId, selectedOrder]);

  const orderTracking = trackingUpdates[String(orderId)] || [];

  if (detailsStatus === "loading" && !order) {
    return (
      <section className="workspace-page">
        <EmptyState title="Loading order" description="Fetching order details from the backend..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="workspace-page">
        <EmptyState title="Order not found" description="We could not find that order in the backend response for your account." action={<Link to="/orders" className="primary-btn">Back to Orders</Link>} />
      </section>
    );
  }

  const canEditDestination = !["delivered", "cancelled"].includes(order.status);
  const canCancel = order.status === "pending";

  async function handleUpdateDestination(event) {
    event.preventDefault();
    const validationMessage = validateDestination(destination);

    if (validationMessage) {
      setDestinationError(validationMessage);
      return;
    }

    const result = await dispatch(
      updateOrderDestination({
        orderId: order.id,
        deliveryLocationId: Number(destination),
      }),
    );

    if (updateOrderDestination.fulfilled.match(result)) {
      setDestination("");
      setDestinationError("");
    }
  }

  async function handleCancelOrder() {
    if (!canCancel) {
      return;
    }

    const confirmed = window.confirm("Are you sure you want to cancel this order?");

    if (!confirmed) {
      return;
    }

    const result = await dispatch(
      cancelOrder({
        orderId: order.id,
        reason: cancelReason.trim() || undefined,
      }),
    );

    if (cancelOrder.fulfilled.match(result)) {
      navigate("/orders", { replace: true, state: { message: `Order #${order.id} was cancelled.` } });
    }
  }

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Order Details</p>
          <h1>Order #{order.id}</h1>
          <p className="workspace-copy">
            Check delivery progress, review parcel details, and manage available order actions.
          </p>
          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <div className="workspace-grid">
        <SectionCard title="Order Summary" description="Key details for this order.">
          <div className="detail-list">
            <div><strong>Order ID:</strong> {order.id}</div>
            <div><strong>Parcel ID:</strong> {order.parcelId ?? "--"}</div>
            <div><strong>Status:</strong> <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
            <div><strong>Pickup Location:</strong> {order.pickupLocation}</div>
            <div><strong>Delivery Location:</strong> {order.destination}</div>
            <div><strong>Current Location:</strong> {order.currentLocation}</div>
            <div><strong>Quoted Price:</strong> KES {Number(order.quotedPrice || 0).toFixed(2)}</div>
            <div><strong>Distance:</strong> {order.distanceKm ?? "--"} km</div>
            <div><strong>Estimated Duration:</strong> {order.durationMinutes ?? "--"} minutes</div>
            <div><strong>Parcel Note:</strong> {order.description}</div>
            <div><strong>Created:</strong> {formatReadableDate(order.createdAt)}</div>
            <div><strong>Last Updated:</strong> {formatReadableDate(order.updatedAt)}</div>
          </div>
        </SectionCard>

        <SectionCard title="Manage Delivery" description="Update the destination or cancel this order when it is still eligible.">
          {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
          <form className="auth-form" onSubmit={handleUpdateDestination}>
            <FormField id="new-destination" label="New Delivery Location ID" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
              <input
                id="new-destination"
                name="destination"
                placeholder="Enter a new numeric location ID"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setDestinationError("");
                }}
                disabled={!canEditDestination || mutationStatus === "loading"}
                inputMode="numeric"
              />
            </FormField>

            <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination || mutationStatus === "loading"}>
              {mutationStatus === "loading" ? "Updating Destination..." : "Update Destination"}
            </Button>
          </form>

          <FormField id="cancel-reason" label="Cancellation Reason (Optional)" error={fieldErrors.reason?.[0]}>
            <textarea
              id="cancel-reason"
              name="cancelReason"
              className="form-textarea"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Add a short reason if you want it included in the cancel request"
              disabled={!canCancel || mutationStatus === "loading"}
            />
          </FormField>

          {canCancel ? (
            <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={mutationStatus === "loading"}>
              {mutationStatus === "loading" ? "Saving Changes..." : "Cancel Order"}
            </Button>
          ) : (
            <p className="helper-text">Only pending orders can be cancelled from this screen.</p>
          )}
        </SectionCard>
      </div>

      <div className="workspace-grid">
        <RouteMapCard
          origin={order.pickupLocation}
          destination={order.destination}
          distanceKm={order.distanceKm}
          durationMinutes={order.durationMinutes}
        />

        <SectionCard title="Tracking Updates" description="Latest route and status updates for this order.">
          {trackingStatus === "loading" ? (
            <p className="helper-text">Loading tracking updates...</p>
          ) : orderTracking.length ? (
            <div className="notification-list">
              {orderTracking.map((update) => (
                <article key={update.id} className="notification-item">
                  <div className="notification-avatar">#{update.id}</div>
                  <div>
                    <p><strong>{update.status.replaceAll("_", " ")}</strong> at {update.locationLabel}</p>
                    <p className="helper-text">{update.note}</p>
                    <span className="helper-text">{formatReadableDate(update.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No tracking updates yet" description="The backend has not returned any tracking updates for this order yet." />
          )}
        </SectionCard>
      </div>
    </section>
  );
}
