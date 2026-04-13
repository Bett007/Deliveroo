import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  assignOrder,
  clearOrderError,
  fetchOrders,
  loadOrderReferenceData,
  updateOrderLocation,
  updateOrderStatus,
} from "../features/orders/ordersSlice";
import styles from "./RiderDashboardPage.module.css";
import { formatReadableDate } from "../utils/formatters/date";

const riderStatuses = ["confirmed", "in_transit", "delivered"];

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

export function RiderDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    currentOrders,
    error,
    mutationStatus,
    referenceData,
    referenceStatus,
    status,
  } = useSelector((state) => state.orders);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [nextStatus, setNextStatus] = useState("in_transit");
  const [nextLocationId, setNextLocationId] = useState("");
  const [leftMode, setLeftMode] = useState("queue");

  useEffect(() => {
    dispatch(fetchOrders());

    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch, referenceStatus]);

  useEffect(() => {
    if (!selectedOrderId && currentOrders.length) {
      setSelectedOrderId(String(currentOrders[0].id));
    }
  }, [currentOrders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => currentOrders.find((order) => String(order.id) === String(selectedOrderId)) || currentOrders[0],
    [currentOrders, selectedOrderId],
  );
  const assignedOrders = useMemo(
    () => currentOrders.filter((order) => Number(order.assignedRiderId) === Number(user?.id)),
    [currentOrders, user?.id],
  );
  const openOrders = useMemo(
    () => currentOrders.filter((order) => !order.assignedRiderId),
    [currentOrders],
  );
  const selectedIsMine = Number(selectedOrder?.assignedRiderId) === Number(user?.id);
  const selectedIsOpen = selectedOrder && !selectedOrder.assignedRiderId;

  async function handleAcceptDelivery() {
    if (!selectedOrder) return;
    await dispatch(assignOrder({ orderId: selectedOrder.backendId }));
  }

  async function handleStatusUpdate(event) {
    event.preventDefault();

    if (!selectedOrder) return;

    await dispatch(updateOrderStatus({ orderId: selectedOrder.backendId, status: nextStatus }));
  }

  async function handleLocationUpdate(event) {
    event.preventDefault();

    if (!selectedOrder || !nextLocationId) return;

    await dispatch(updateOrderLocation({ orderId: selectedOrder.backendId, locationId: Number(nextLocationId) }));
    setNextLocationId("");
  }

  return (
    <section className={`workspace-page ops-page rider-page ${styles.scope}`}>
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Rider Workspace</p>
          <h1>Delivery queue</h1>
          <p className="workspace-copy">Accept open work, move your route, and close deliveries cleanly.</p>
          {error ? <p className="form-status error">{error}</p> : null}
        </div>

        <div className="rider-stats-strip" aria-label="Rider queue summary">
          <span><strong>{openOrders.length}</strong> open</span>
          <span><strong>{assignedOrders.length}</strong> mine</span>
          <span><strong>{currentOrders.length}</strong> active</span>
        </div>
      </header>

      <div className="rider-workspace-grid">
        <main className="rider-order-column">
          <SectionCard
            title={leftMode === "controls" ? "Route Controls" : "Delivery Board"}
            description={leftMode === "controls" ? "Update selected route." : "Select a delivery or tap pencil."}
            action={leftMode === "controls" ? <Button className="secondary-btn compact-btn" onClick={() => setLeftMode("queue")}>Back</Button> : null}
          >
            {leftMode === "queue" ? (
              status === "loading" ? (
                <p className="helper-text">Loading active deliveries...</p>
              ) : currentOrders.length ? (
                <div className="rider-delivery-list">
                  {currentOrders.map((order) => (
                    <article
                      key={order.id}
                      className={`rider-delivery-item ${String(order.id) === String(selectedOrder?.id) ? "active" : ""}`}
                    >
                      <button type="button" className="rider-delivery-select" onClick={() => setSelectedOrderId(String(order.id))}>
                        <span className="delivery-icon" aria-hidden="true">{order.assignedRiderId ? "R" : "P"}</span>
                        <span className="delivery-copy">
                          <span>#{order.id}</span>
                          <strong>{order.parcelName}</strong>
                          <small>{order.pickupLocation} to {order.destination}</small>
                        </span>
                        <span className="delivery-state-stack">
                          <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                          <small>{order.assignedRiderId ? "My route" : "Open"}</small>
                        </span>
                      </button>
                      <button
                        type="button"
                        className="order-card-edit"
                        aria-label={`Manage delivery ${order.id}`}
                        onClick={() => {
                          setSelectedOrderId(String(order.id));
                          setLeftMode("controls");
                        }}
                      >
                        <PencilIcon />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No active deliveries" description="New work appears here." />
              )
            ) : selectedOrder ? (
              <div className="dispatch-left-controls">
                <div className={`delivery-ownership ${selectedIsMine ? "mine" : "open"}`}>
                  <span aria-hidden="true">{selectedIsMine ? "OK" : "+"}</span>
                  <strong>{selectedIsMine ? "Assigned to you" : "Open for pickup"}</strong>
                </div>

                <div className="dispatch-mini-facts">
                  <span><strong>Status</strong>{selectedOrder.status.replaceAll("_", " ")}</span>
                  <span><strong>Current</strong>{selectedOrder.currentLocation}</span>
                  <span><strong>Updated</strong>{formatReadableDate(selectedOrder.updatedAt)}</span>
                </div>

                {selectedIsOpen ? (
                  <Button type="button" className="primary-btn full-width" onClick={handleAcceptDelivery} disabled={mutationStatus === "loading"}>
                    {mutationStatus === "loading" ? "Accepting..." : "Accept Delivery"}
                  </Button>
                ) : null}

                <form className="auth-form" onSubmit={handleStatusUpdate}>
                  <FormField id="rider-status" label="Order Status">
                    <select id="rider-status" className="form-select" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
                      {riderStatuses.map((item) => (
                        <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                      ))}
                    </select>
                  </FormField>
                  <Button type="submit" className="primary-btn full-width" disabled={!selectedOrder || !selectedIsMine || mutationStatus === "loading"}>
                    {mutationStatus === "loading" ? "Updating..." : "Update Status"}
                  </Button>
                </form>

                <form className="auth-form" onSubmit={handleLocationUpdate}>
                  <FormField id="rider-location" label="Current Location">
                    <select
                      id="rider-location"
                      className="form-select"
                      value={nextLocationId}
                      onChange={(event) => setNextLocationId(event.target.value)}
                      disabled={referenceStatus === "loading"}
                    >
                      <option value="">Select current location</option>
                      {referenceData.locations.map((location) => (
                        <option key={location.id} value={location.id}>{location.label}</option>
                      ))}
                    </select>
                  </FormField>
                  <Button type="submit" className="secondary-btn full-width" disabled={!selectedOrder || !selectedIsMine || !nextLocationId || mutationStatus === "loading"}>
                    Update Location
                  </Button>
                </form>
                {!selectedIsMine ? <p className="helper-text compact">Accept before updating.</p> : null}
              </div>
            ) : null}
          </SectionCard>
        </main>

        <aside className="rider-side-stack">
          {selectedOrder ? (
            <RouteMapCard
              origin={selectedOrder.currentLocation || selectedOrder.pickupLocation}
              destination={selectedOrder.destination}
              distanceKm={selectedOrder.distanceKm}
              durationMinutes={selectedOrder.durationMinutes}
            />
          ) : null}
        </aside>
      </div>
    </section>
  );
}
