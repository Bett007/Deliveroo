import { apiRequest } from "./client";

function normalizeOrder(order) {
  return {
    id: order.id,
    parcelId: order.parcel_id,
    parcelName: order.parcel_id ? `Parcel #${order.parcel_id}` : `Order #${order.id}`,
    pickupLocationId: order.pickup_location_id,
    pickupLocation: order.pickup_location_id ? `Location #${order.pickup_location_id}` : "Unassigned",
    deliveryLocationId: order.delivery_location_id,
    destination: order.delivery_location_id ? `Location #${order.delivery_location_id}` : "Unassigned",
    currentLocationId: order.current_location_id,
    currentLocation: order.current_location_id ? `Location #${order.current_location_id}` : "Awaiting rider update",
    quotedPrice: order.quoted_price,
    distanceKm: order.distance_km,
    durationMinutes: order.estimated_duration_minutes,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    description: order.parcel_id ? `Parcel record #${order.parcel_id} is attached to this order.` : "Parcel details are available after creation.",
  };
}

function normalizeTrackingUpdate(update) {
  return {
    id: update.id,
    status: update.status,
    note: update.note || "No note added yet.",
    locationLabel: update.location_id ? `Location #${update.location_id}` : "Location not provided",
    createdAt: update.created_at,
    updatedBy: update.updated_by,
  };
}

export async function listOrders(token, { page = 1, limit = 20 } = {}) {
  const response = await apiRequest(`/orders?page=${page}&limit=${limit}`, { token });

  return {
    items: (response.data.items || []).map(normalizeOrder),
    page: response.data.page,
    limit: response.data.limit,
    total: response.data.total,
    message: response.message,
  };
}

export async function getOrderRequest(token, orderId) {
  const response = await apiRequest(`/orders/${orderId}`, { token });

  return {
    order: normalizeOrder(response.data.order),
    message: response.message,
  };
}

export async function createOrderRequest(token, payload) {
  const response = await apiRequest("/orders/", {
    method: "POST",
    token,
    body: payload,
  });

  return {
    order: normalizeOrder(response.data.order),
    message: response.message,
  };
}

export async function updateOrderDestinationRequest(token, orderId, payload) {
  const response = await apiRequest(`/orders/${orderId}/destination`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: normalizeOrder(response.data.order),
    message: response.message,
  };
}

export async function cancelOrderRequest(token, orderId, payload) {
  const response = await apiRequest(`/orders/${orderId}/cancel`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: normalizeOrder(response.data.order),
    message: response.message,
  };
}

export async function listTrackingUpdatesRequest(token, orderId) {
  const response = await apiRequest(`/tracking/${orderId}`, { token });

  return {
    updates: (response.data.updates || []).map(normalizeTrackingUpdate),
    message: response.message,
  };
}
