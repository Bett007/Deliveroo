import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  cancelOrder,
  clearOrderError,
  fetchOrderById,
  fetchTrackingUpdates,
  loadOrderReferenceData,
  updateOrderDestination,
} from "../features/orders/ordersSlice";
import { validateDestination } from "../features/orders/orderValidators";
import { formatReadableDate } from "../utils/formatters/date";
import styles from "./OrderDetailsPage.module.css";

const lifecycleSteps = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Accepted" },
  { key: "in_transit", label: "Moving" },
  { key: "delivered", label: "Done" },
];

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

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  const order = useMemo(() => {
    const mergedOrders = [...currentOrders, ...orderHistory];
    return (
      mergedOrders.find((item) => String(item.id) === String(orderId)) ||
      (String(selectedOrder?.id) === String(orderId) ? selectedOrder : null)
    );
  }, [currentOrders, orderHistory, orderId, selectedOrder]);

  const orderTracking = trackingUpdates[String(orderId)] || [];

  if (detailsStatus === "loading" && !order) {
    return (
      <section className={`workspace-page ${styles.scope}`}>
        <EmptyState title="Loading order" description="Fetching order details from the backend..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className={`workspace-page ${styles.scope}`}>
        <EmptyState title="Order not found" description="We could not find that order in the backend response for your account." action={<Link to="/orders" className="primary-btn">Back to Orders</Link>} />
      </section>
    );
  }

  const canCancel = !["delivered", "cancelled"].includes(order.status);
  const activeStepIndex = order.status === "cancelled"
    ? -1
    : Math.max(0, lifecycleSteps.findIndex((step) => step.key === order.status));
>>>>>>> dev
=======
  const canEditDestination = !["delivered", "cancelled"].includes(order.status);
  const canCancel = !["delivered", "cancelled"].includes(order.status);
  const activeStepIndex = order.status === "cancelled"
    ? -1
    : Math.max(0, lifecycleSteps.findIndex((step) => step.key === order.status));
=======
  const canCancel = !["delivered", "cancelled"].includes(order.status);
  const activeStepIndex = order.status === "cancelled"
    ? -1
    : Math.max(0, lifecycleSteps.findIndex((step) => step.key === order.status));
>>>>>>> dev

  async function handleUpdateDestination(event) {
    event.preventDefault();
    const validationMessage = validateDestination(destination);

    if (validationMessage) {
      setDestinationError(validationMessage);
      return;
    }

    const result = await dispatch(
      updateOrderDestination({
        orderId: order.backendId,
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
        orderId: order.backendId,
        reason: cancelReason.trim() || undefined,
      }),
    );

    if (cancelOrder.fulfilled.match(result)) {
      navigate("/orders", { replace: true, state: { message: `Order #${order.id} was cancelled.` } });
    }
  }

  return (
    <section className={`workspace-page ops-page ${styles.scope}`}>
      <div className="order-details-grid">
        <main className="order-details-main">
          <SectionCard title="Progress" description="Current delivery lifecycle.">
            <div className={`delivery-progress ${order.status === "cancelled" ? "cancelled" : ""}`}>
              {lifecycleSteps.map((step, index) => (
                <div key={step.key} className={index <= activeStepIndex ? "complete" : ""}>
                  <span>{index + 1}</span>
                  <strong>{step.label}</strong>
                </div>
>>>>>>> dev
              ))}
            </div>
            {order.status === "cancelled" ? (
              <p className="form-status error">This order was cancelled.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Order Summary" description="Key delivery facts.">
            <div className="detail-list order-detail-list">
              <div><span>Order ID</span><strong>{order.id}</strong></div>
              <div><span>Parcel ID</span><strong>{order.parcelId ?? "--"}</strong></div>
              <div><span>Status</span><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
              <div><span>Rider</span><strong>{order.assignedRider?.email || "Unassigned"}</strong></div>
              <div><span>Pickup Location</span><strong>{order.pickupLocation}</strong></div>
              <div><span>Delivery Location</span><strong>{order.destination}</strong></div>
              <div><span>Current Location</span><strong>{order.currentLocation}</strong></div>
              <div><span>Quoted Price</span><strong>KES {Number(order.quotedPrice || 0).toFixed(2)}</strong></div>
              <div><span>Distance</span><strong>{order.distanceKm ?? "--"} km</strong></div>
              <div><span>Estimated Duration</span><strong>{order.durationMinutes ?? "--"} minutes</strong></div>
              <div><span>Assigned</span><strong>{formatReadableDate(order.assignedAt)}</strong></div>
              <div><span>Picked Up</span><strong>{formatReadableDate(order.pickedUpAt)}</strong></div>
              <div><span>Delivered</span><strong>{formatReadableDate(order.deliveredAt)}</strong></div>
              <div><span>Created</span><strong>{formatReadableDate(order.createdAt)}</strong></div>
              <div><span>Last Updated</span><strong>{formatReadableDate(order.updatedAt)}</strong></div>
            </div>
          </SectionCard>

          <SectionCard title="Tracking Updates" description="Latest route events.">
            {trackingStatus === "loading" ? (
              <p className="helper-text">Loading tracking updates...</p>
            ) : orderTracking.length ? (
              <div className="notification-list">
                {orderTracking.map((update) => (
                  <article key={update.id} className="notification-item">
                    <div className="notification-avatar">T</div>
                    <div>
                      <p><strong>{update.status.replaceAll("_", " ")}</strong></p>
                      <p>{update.locationLabel}</p>
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
        </main>

        <aside className="order-details-side">
          <RouteMapCard origin={order.pickupLocation} destination={order.destination} distanceKm={order.distanceKm} durationMinutes={order.durationMinutes} />

          <SectionCard title="Manage Delivery" description="Destination updates and cancellation are available for eligible orders.">
            {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
            {error ? <p className="form-status error">{error}</p> : null}
            <form className="auth-form" onSubmit={handleUpdateDestination}>
              <FormField id="new-destination" label="New Delivery Location" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                <select
                  id="new-destination"
                  name="destination"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setDestinationError("");
                    dispatch(clearOrderError());
                  }}
                  disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                  className="form-select"
                >
                  <option value="">Select a new destination</option>
                  {referenceData.locations
                    .filter((item) => String(item.id) !== String(order.deliveryLocationId))
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
              </FormField>

              <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination || mutationStatus === "loading">
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

            <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel || mutationStatus === "loading"}>
              {mutationStatus === "loading" ? "Saving Changes..." : "Cancel Order"}
            </Button>
          </SectionCard>
        </aside>
      </div>
    </section>
  );
}
=======
      <div className="order-details-grid">
        <main className="order-details-main">
          <SectionCard title="Progress" description="Current delivery lifecycle.">
            <div className={`delivery-progress ${order.status === "cancelled" ? "cancelled" : ""}`}>
              {lifecycleSteps.map((step, index) => (
                <div key={step.key} className={index <= activeStepIndex ? "complete" : ""}>
                  <span>{index + 1}</span>
                  <strong>{step.label}</strong>
                </div>
              ))}
            </div>
            {order.status === "cancelled" ? (
              <p className="form-status error">This order was cancelled.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Order Summary" description="Key delivery facts.">
            <div className="detail-list order-detail-list">
              <div><span>Order ID</span><strong>{order.id}</strong></div>
              <div><span>Parcel ID</span><strong>{order.parcelId ?? "--"}</strong></div>
              <div><span>Status</span><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
              <div><span>Rider</span><strong>{order.assignedRider?.email || "Unassigned"}</strong></div>
              <div><span>Pickup Location</span><strong>{order.pickupLocation}</strong></div>
              <div><span>Delivery Location</span><strong>{order.destination}</strong></div>
              <div><span>Current Location</span><strong>{order.currentLocation}</strong></div>
              <div><span>Quoted Price</span><strong>KES {Number(order.quotedPrice || 0).toFixed(2)}</strong></div>
              <div><span>Distance</span><strong>{order.distanceKm ?? "--"} km</strong></div>
              <div><span>Estimated Duration</span><strong>{order.durationMinutes ?? "--"} minutes</strong></div>
              <div><span>Assigned</span><strong>{formatReadableDate(order.assignedAt)}</strong></div>
              <div><span>Picked Up</span><strong>{formatReadableDate(order.pickedUpAt)}</strong></div>
              <div><span>Delivered</span><strong>{formatReadableDate(order.deliveredAt)}</strong></div>
              <div><span>Created</span><strong>{formatReadableDate(order.createdAt)}</strong></div>
              <div><span>Last Updated</span><strong>{formatReadableDate(order.updatedAt)}</strong></div>
            </div>
          </SectionCard>

          <SectionCard title="Tracking Updates" description="Latest route events.">
            {trackingStatus === "loading" ? (
              <p className="helper-text">Loading tracking updates...</p>
            ) : orderTracking.length ? (
              <div className="notification-list">
                {orderTracking.map((update) => (
                  <article key={update.id} className="notification-item">
                    <div className="notification-avatar">T</div>
                    <div>
                      <p><strong>{update.status.replaceAll("_", " ")}</strong></p>
                      <p>{update.locationLabel}</p>
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
        </main>

        <aside className="order-details-side">
          <RouteMapCard origin={order.pickupLocation} destination={order.destination} distanceKm={order.distanceKm} durationMinutes={order.durationMinutes} />

          <SectionCard title="Manage Delivery" description="Destination updates and cancellation are available for eligible orders.">
            {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
            {error ? <p className="form-status error">{error}</p> : null}
            <form className="auth-form" onSubmit={handleUpdateDestination}>
              <FormField id="new-destination" label="New Delivery Location" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                <select
                  id="new-destination"
                  name="destination"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setDestinationError("");
                    dispatch(clearOrderError());
                  }}
                  disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                  className="form-select"
                >
                  <option value="">Select a new destination</option>
                  {referenceData.locations
                    .filter((item) => String(item.id) !== String(order.deliveryLocationId))
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
              </FormField>

              <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination || mutationStatus === "loading">
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

            <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel || mutationStatus === "loading">
              {mutationStatus === "loading" ? "Saving Changes..." : "Cancel Order"}
            </Button>
          </SectionCard>
        </aside>
      </div>
    </section>
  );
}
=======
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Order Details</p>
          <h1>Order #{order.id}</h1>
          <p className="workspace-copy">Route, progress, rider, and eligible actions.</p>
          {location.state?.message ? <p className="form-status success">{location.state.message}</p> : null}
          {error ? <p className="form-status error">{error}</p> : null}
        </div>
        <Link to="/orders" className="secondary-btn">Back to Orders</Link>
      </header>

      <div className="order-details-grid">
        <main className="order-details-main">
          <SectionCard title="Progress" description="Current delivery lifecycle.">
            <div className={`delivery-progress ${order.status === "cancelled" ? "cancelled" : ""}`}>
              {lifecycleSteps.map((step, index) => (
                <div key={step.key} className={index <= activeStepIndex ? "complete" : ""}>
                  <span>{index + 1}</span>
                  <strong>{step.label}</strong>
                </div>
              ))}
            </div>
            {order.status === "cancelled" ? (
              <p className="form-status error">This order was cancelled.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Order Summary" description="Key delivery facts.">
            <div className="detail-list order-detail-list">
              <div><span>Order ID</span><strong>{order.id}</strong></div>
              <div><span>Parcel ID</span><strong>{order.parcelId ?? "--"}</strong></div>
              <div><span>Status</span><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
              <div><span>Rider</span><strong>{order.assignedRider?.email || "Unassigned"}</strong></div>
              <div><span>Pickup Location</span><strong>{order.pickupLocation}</strong></div>
              <div><span>Delivery Location</span><strong>{order.destination}</strong></div>
              <div><span>Current Location</span><strong>{order.currentLocation}</strong></div>
              <div><span>Quoted Price</span><strong>KES {Number(order.quotedPrice || 0).toFixed(2)}</strong></div>
              <div><span>Distance</span><strong>{order.distanceKm ?? "--"} km</strong></div>
              <div><span>Estimated Duration</span><strong>{order.durationMinutes ?? "--"} minutes</strong></div>
              <div><span>Assigned</span><strong>{formatReadableDate(order.assignedAt)}</strong></div>
              <div><span>Picked Up</span><strong>{formatReadableDate(order.pickedUpAt)}</strong></div>
              <div><span>Delivered</span><strong>{formatReadableDate(order.deliveredAt)}</strong></div>
              <div><span>Created</span><strong>{formatReadableDate(order.createdAt)}</strong></div>
              <div><span>Last Updated</span><strong>{formatReadableDate(order.updatedAt)}</strong></div>
            </div>
          </SectionCard>

          <SectionCard title="Tracking Updates" description="Latest route events.">
            {trackingStatus === "loading" ? (
              <p className="helper-text">Loading tracking updates...</p>
            ) : orderTracking.length ? (
              <div className="notification-list">
                {orderTracking.map((update) => (
                  <article key={update.id} className="notification-item">
                    <div className="notification-avatar">T</div>
                    <div>
                      <p><strong>{update.status.replaceAll("_", " ")}</strong></p>
                      <p>{update.locationLabel}</p>
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
        </main>

        <aside className="order-details-side">
          <RouteMapCard origin={order.pickupLocation} destination={order.destination} distanceKm={order.distanceKm} durationMinutes={order.durationMinutes} />

          <SectionCard title="Manage Delivery" description="Destination updates and cancellation are available for eligible orders.">
            {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
            {error ? <p className="form-status error">{error}</p> : null}
            <form className="auth-form" onSubmit={handleUpdateDestination}>
              <FormField id="new-destination" label="New Delivery Location" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                <select
                  id="new-destination"
                  name="destination"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setDestinationError("");
                    dispatch(clearOrderError());
                  }}
                  disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                  className="form-select"
                >
                  <option value="">Select a new destination</option>
                  {referenceData.locations
                    .filter((item) => String(item.id) !== String(order.deliveryLocationId))
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
              </FormField>

              <Button type="submit" className="secondary-btn full-width" disabled={!canEditDestination || mutationStatus === "loading">
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

            <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel || mutationStatus === "loading"}>
              {mutationStatus === "loading" ? "Saving Changes..." : "Cancel Order"}
            </Button>
          </SectionCard>
        </aside>
      </div>
    </section>
  );
}
=======
      <div className="order-details-grid">
        <main className="order-details-main">
          <SectionCard title="Progress" description="Current delivery lifecycle.">
            <div className={`delivery-progress ${order.status === "cancelled" ? "cancelled" : ""}`}>
              {lifecycleSteps.map((step, index) => (
                <div key={step.key} className={index <= activeStepIndex ? "complete" : ""}>
                  <span>{index + 1}</span>
                  <strong>{step.label}</strong>
                </div>
>>>>>>> dev
              ))}
            </div>
            {order.status === "cancelled" ? (
              <p className="form-status error">This order was cancelled.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Order Summary" description="Key delivery facts.">
            <div className="detail-list order-detail-list">
              <div><span>Order ID</span><strong>{order.id}</strong></div>
              <div><span>Parcel ID</span><strong>{order.parcelId ?? "--"}</strong></div>
              <div><span>Status</span><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></div>
              <div><span>Rider</span><strong>{order.assignedRider?.email || "Unassigned"}</strong></div>
              <div><span>Pickup Location</span><strong>{order.pickupLocation}</strong></div>
              <div><span>Delivery Location</span><strong>{order.destination}</strong></div>
              <div><span>Current Location</span><strong>{order.currentLocation}</strong></div>
              <div><span>Quoted Price</span><strong>KES {Number(order.quotedPrice || 0).toFixed(2)}</strong></div>
              <div><span>Distance</span><strong>{order.distanceKm ?? "--"} km</strong></div>
              <div><span>Estimated Duration</span><strong>{order.durationMinutes ?? "--"} minutes</strong></div>
              <div><span>Assigned</span><strong>{formatReadableDate(order.assignedAt)}</strong></div>
              <div><span>Picked Up</span><strong>{formatReadableDate(order.pickedUpAt)}</strong></div>
              <div><span>Delivered</span><strong>{formatReadableDate(order.deliveredAt)}</strong></div>
              <div><span>Created</span><strong>{formatReadableDate(order.createdAt)}</strong></div>
              <div><span>Last Updated</span><strong>{formatReadableDate(order.updatedAt)}</strong></div>
            </div>
          </SectionCard>

          <SectionCard title="Tracking Updates" description="Latest route events.">
            {trackingStatus === "loading" ? (
              <p className="helper-text">Loading tracking updates...</p>
            ) : orderTracking.length ? (
              <div className="notification-list">
                {orderTracking.map((update) => (
                  <article key={update.id} className="notification-item">
                    <div className="notification-avatar">T</div>
                    <div>
                      <p><strong>{update.status.replaceAll("_", " ")}</strong></p>
                      <p>{update.locationLabel}</p>
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
        </main>

        <aside className="order-details-side">
          <RouteMapCard origin={order.pickupLocation} destination={order.destination} distanceKm={order.distanceKm} durationMinutes={order.durationMinutes} />

          <SectionCard title="Manage Delivery" description="Destination updates and cancellation are available for eligible orders.">
            {!canEditDestination ? <p className="helper-text">Destination changes are disabled once an order is delivered or cancelled.</p> : null}
            {error ? <p className="form-status error">{error}</p> : null}
            <form className="auth-form" onSubmit={handleUpdateDestination}>
              <FormField id="new-destination" label="New Delivery Location" error={destinationError || fieldErrors.delivery_location_id?.[0]}>
                <select
                  id="new-destination"
                  name="destination"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setDestinationError("");
                    dispatch(clearOrderError());
                  }}
                  disabled={!canEditDestination || mutationStatus === "loading" || referenceStatus === "loading"}
                  className="form-select"
                >
                  <option value="">Select a new destination</option>
                  {referenceData.locations
                    .filter((item) => String(item.id) !== String(order.deliveryLocationId))
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
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

            <Button className="primary-btn full-width danger-btn" onClick={handleCancelOrder} disabled={!canCancel || mutationStatus === "loading"}>
              {mutationStatus === "loading" ? "Saving Changes..." : "Cancel Order"}
            </Button>
          </SectionCard>
        </aside>
      </div>
    </section>
  );
}
