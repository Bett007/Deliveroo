import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { cancelOrder, clearOrderError, fetchOrderById, fetchTrackingUpdates, loadOrderReferenceData, updateOrderDestination } from "../features/orders/ordersSlice";
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
    referenceData,
    referenceStatus,
    detailsStatus,
    trackingStatus,
    mutationStatus,
    error,
    fieldErrors,
  } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [destinationArea, setDestinationArea] = useState("");
  const [destinationPlace, setDestinationPlace] = useState("");
  const [destinationLocationId, setDestinationLocationId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [activePane, setActivePane] = useState("summary");
  const isRider = user?.role === "rider";

  const availablePanes = useMemo(
    () => (isRider ? ["summary"] : ["summary", "manage", "tracking"]),
    [isRider],
  );

  useEffect(() => {
    if (!availablePanes.includes(activePane)) {
      setActivePane("summary");
    }
  }, [activePane, availablePanes]);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    dispatch(fetchTrackingUpdates(orderId));

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  const order = useMemo(() => {
    const mergedOrders = [...currentOrders, ...orderHistory];
    return mergedOrders.find((item) => String(item.id) === String(orderId)) || (String(selectedOrder?.id) === String(orderId) ? selectedOrder : null);
  }, [currentOrders, orderHistory, orderId, selectedOrder]);

  const destinationAreas = useMemo(() => {
    const cities = new Set(
      referenceData.locations
        .map((location) => (location.city || "").trim())
        .filter(Boolean),
    );
    return Array.from(cities).sort((a, b) => a.localeCompare(b));
  }, [referenceData.locations]);

  const destinationPlaces = useMemo(() => {
    return referenceData.locations.filter((location) => {
      if (!destinationArea) {
        return true;
      }
      return String(location.city || "").trim().toLowerCase() === destinationArea.trim().toLowerCase();
    });
  }, [referenceData.locations, destinationArea]);

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
  const isDeliveredCustomerOrder = user?.role === "customer" && order.status === "delivered";
  const isFulfilledOrder = order.status === "delivered";

  async function handleUpdateDestination(event) {
    event.preventDefault();
    const matchedLocation = destinationPlaces.find(
      (location) => location.label.toLowerCase() === destinationPlace.trim().toLowerCase(),
    );
    const resolvedLocationId = destinationLocationId || (matchedLocation ? String(matchedLocation.id) : "");

    if (!resolvedLocationId) {
      setDestinationError("Select a destination place from the suggestions.");
      return;
    }

    const result = await dispatch(
      updateOrderDestination({
        orderId: order.id,
        deliveryLocationId: Number(resolvedLocationId),
      }),
    );

    if (updateOrderDestination.fulfilled.match(result)) {
      setDestinationArea("");
      setDestinationPlace("");
      setDestinationLocationId("");
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

      <div className="orders-pane-switch" role="tablist" aria-label="Order details views">
        <button type="button" className={`panel-toggle-btn ${activePane === "summary" ? "active" : ""}`} onClick={() => setActivePane("summary")}>Summary</button>
        {!isRider ? <button type="button" className={`panel-toggle-btn ${activePane === "manage" ? "active" : ""}`} onClick={() => setActivePane("manage")}>Manage</button> : null}
        {!isRider ? <button type="button" className={`panel-toggle-btn ${activePane === "tracking" ? "active" : ""}`} onClick={() => setActivePane("tracking")}>Tracking</button> : null}
      </div>

      <div className="order-details-split">
        <section className="workspace-panel order-details-left-pane">
          {activePane === "summary" ? (
            <>
              <div className="section-header">
                <div>
                  <h2>Order Summary</h2>
                  <p>Key details for this order.</p>
                </div>
              </div>
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
            </>
          ) : null}

          {activePane === "manage" ? (
            <>
              <div className="section-header">
                <div>
                  <h2>Manage Delivery</h2>
                  <p>Update destination or cancel while eligible.</p>
                </div>
              </div>
              {isDeliveredCustomerOrder ? (
                <p className="form-status success">This order has already been fulfilled.</p>
              ) : (
                <>
                  {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
                  <form className="auth-form" onSubmit={handleUpdateDestination}>
                    <FormField id="destination-location" label="Destination Location" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                      <select
                        id="destination-area"
                        name="destinationArea"
                        className="form-select"
                        value={destinationArea}
                        onChange={(event) => {
                          setDestinationArea(event.target.value);
                          setDestinationPlace("");
                          setDestinationLocationId("");
                          setDestinationError("");
                        }}
                        disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                      >
                        <option value="">Select destination location area</option>
                        {destinationAreas.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField id="destination-place" label="Place" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                      <input
                        id="destination-place"
                        name="destinationPlace"
                        placeholder="Search for a place..."
                        value={destinationPlace}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDestinationPlace(value);
                          setDestinationError("");

                          const matchedLocation = destinationPlaces.find(
                            (location) => location.label.toLowerCase() === value.trim().toLowerCase(),
                          );
                          setDestinationLocationId(matchedLocation ? String(matchedLocation.id) : "");
                        }}
                        list="destination-place-options"
                        disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                      />
                      <datalist id="destination-place-options">
                        {destinationPlaces.map((locationOption) => (
                          <option key={locationOption.id} value={locationOption.label} />
                        ))}
                      </datalist>
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
                </>
              )}
            </>
          ) : null}

          {activePane === "tracking" ? (
            <>
              <div className="section-header">
                <div>
                  <h2>{isFulfilledOrder ? "Delivery Timeline" : "Tracking Updates"}</h2>
                  <p>
                    {isFulfilledOrder
                      ? "Final route and handoff activity for this fulfilled order."
                      : "Latest route and status updates for this order."}
                  </p>
                </div>
              </div>
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
                <EmptyState
                  title={isFulfilledOrder ? "No delivery timeline entries yet" : "No tracking updates yet"}
                  description={
                    isFulfilledOrder
                      ? "This order has already been fulfilled. Any recorded route and status events will appear here."
                      : "Tracking updates will appear here once the rider shares progress on this delivery."
                  }
                />
              )}
            </>
          ) : null}
        </section>

        <section className="workspace-panel order-details-map-pane">
          <div className="section-header">
            <div>
              <h2>Live Map</h2>
              <p>Route and delivery context for this order.</p>
            </div>
          </div>
          <RouteMapCard
            origin={order.pickupLocation}
            destination={order.destination}
            originCoords={order.pickupCoords}
            destinationCoords={order.destinationCoords}
            distanceKm={order.distanceKm}
            durationMinutes={order.durationMinutes}
            status={order.status}
          />
        </section>
      </div>

    </section>
  );
}
