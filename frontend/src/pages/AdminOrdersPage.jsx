import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { RouteMapCard } from "../components/ui/RouteMapCard";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  fetchOrders,
  loadOrderReferenceData,
  updateOrderLocation,
  updateOrderStatus,
} from "../features/orders/ordersSlice";
import { formatReadableDate } from "../utils/formatters/date";
import "./AdminOrdersPage.module.css";

const adminStatuses = ["pending", "confirmed", "in_transit", "delivered", "cancelled"];

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

export function AdminOrdersPage() {
  const dispatch = useDispatch();
  const {
    currentOrders,
    orderHistory,
    mutationStatus,
    referenceData,
    referenceStatus,
    status,
  } = useSelector((state) => state.orders);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [nextLocationId, setNextLocationId] = useState("");
  const [leftMode, setLeftMode] = useState("queue");

  useEffect(() => {
    dispatch(fetchOrders());

    if (referenceStatus === "idle") {
      dispatch(loadOrderReferenceData());
    }
  }, [dispatch, referenceStatus]);

  const allOrders = useMemo(() => [...currentOrders, ...orderHistory], [currentOrders, orderHistory]);
  const openQueue = useMemo(() => currentOrders.filter((order) => !order.assignedRiderId), [currentOrders]);
  const selectedOrder = useMemo(
    () => allOrders.find((order) => String(order.id) === String(selectedOrderId)) || allOrders[0],
    [allOrders, selectedOrderId],
  );

  useEffect(() => {
    if (!selectedOrderId && allOrders.length) {
      setSelectedOrderId(String(allOrders[0].id));
    }
  }, [allOrders, selectedOrderId]);

  useEffect(() => {
    setNextStatus(selectedOrder?.status || "pending");
    setNextLocationId(selectedOrder?.currentLocationId ? String(selectedOrder.currentLocationId) : "");
  }, [selectedOrder]);

  async function handleStatusSubmit(event) {
    event.preventDefault();
    if (!selectedOrder || !nextStatus) return;
    await dispatch(updateOrderStatus({ orderId: selectedOrder.backendId, status: nextStatus }));
  }

  async function handleLocationSubmit(event) {
    event.preventDefault();
    if (!selectedOrder || !nextLocationId) return;
    await dispatch(updateOrderLocation({ orderId: selectedOrder.backendId, locationId: Number(nextLocationId) }));
  }

  return (
    <section className="workspace-page ops-page admin-dispatch-page">
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Admin Dispatch</p>
          <h1>Manage orders</h1>
          <p className="workspace-copy">Select one order, update one thing, keep the queue clean.</p>
        </div>

        <div className="topbar-actions">
          <div className="rider-stats-strip" aria-label="Dispatch summary">
            <span><strong>{openQueue.length}</strong> open</span>
            <span><strong>{currentOrders.length}</strong> active</span>
            <span><strong>{allOrders.length}</strong> total</span>
          </div>
          <Link to="/dashboard" className="secondary-btn">Back</Link>
        </div>
      </header>

      <div className="admin-dispatch-grid">
        <SectionCard
          title={leftMode === "controls" ? "Controls" : "Queue"}
          description={leftMode === "controls" ? "Update selected order." : "Select an order or tap pencil."}
          action={leftMode === "controls" ? <Button className="secondary-btn compact-btn" onClick={() => setLeftMode("queue")}>Back</Button> : null}
        >
          {leftMode === "queue" ? (
            status === "loading" ? (
              <p className="helper-text">Loading orders...</p>
            ) : allOrders.length ? (
              <div className="admin-order-list">
                {allOrders.map((order) => (
                  <article
                    key={order.id}
                    className={`admin-order-item ${String(order.id) === String(selectedOrder?.id) ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="admin-order-select"
                      onClick={() => setSelectedOrderId(String(order.id))}
                    >
                      <span className="order-icon" aria-hidden="true">{order.assignedRiderId ? "R" : "Q"}</span>
                      <span>
                        <small>#{order.id}</small>
                        <strong>{order.parcelName}</strong>
                        <em>{order.assignedRider?.email || "Unassigned"}</em>
                      </span>
                      <StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge>
                    </button>
                    <button
                      type="button"
                      className="order-card-edit"
                      aria-label={`Manage order ${order.id}`}
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
              <p className="helper-text">No orders yet.</p>
            )
          ) : selectedOrder ? (
            <div className="dispatch-left-controls">
              <div className="dispatch-control-summary">
                <div>
                  <p className="card-label">Selected</p>
                  <h2>#{selectedOrder.id}</h2>
                </div>
                <StatusBadge>{selectedOrder.status.replaceAll("_", " ")}</StatusBadge>
              </div>

              <div className="dispatch-mini-facts">
                <span><strong>Rider</strong>{selectedOrder.assignedRider?.email || "Unassigned"}</span>
                <span><strong>Current</strong>{selectedOrder.currentLocation}</span>
                <span><strong>Updated</strong>{formatReadableDate(selectedOrder.updatedAt)}</span>
              </div>

              <form className="auth-form" onSubmit={handleStatusSubmit}>
                <FormField id="admin-status" label="Status">
                  <select id="admin-status" className="form-select" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
                    {adminStatuses.map((item) => (
                      <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </FormField>
                <Button type="submit" className="primary-btn full-width" disabled={mutationStatus === "loading"}>
                  {mutationStatus === "loading" ? "Saving..." : "Update Status"}
                </Button>
              </form>

              <form className="auth-form" onSubmit={handleLocationSubmit}>
                <FormField id="admin-location" label="Current Location">
                  <select
                    id="admin-location"
                    className="form-select"
                    value={nextLocationId}
                    onChange={(event) => setNextLocationId(event.target.value)}
                    disabled={referenceStatus === "loading"}
                  >
                    <option value="">Set location</option>
                    {referenceData.locations.map((location) => (
                      <option key={location.id} value={location.id}>{location.label}</option>
                    ))}
                  </select>
                </FormField>
                <Button type="submit" className="secondary-btn full-width" disabled={!nextLocationId || mutationStatus === "loading"}>
                  Update Location
                </Button>
              </form>
            </div>
          ) : null}
        </SectionCard>

        <aside className="admin-dispatch-side">
          {selectedOrder ? (
            <div className="dispatch-map-surface">
              <RouteMapCard
                origin={selectedOrder.pickupLocation}
                destination={selectedOrder.destination}
                distanceKm={selectedOrder.distanceKm}
                durationMinutes={selectedOrder.durationMinutes}
              />
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
