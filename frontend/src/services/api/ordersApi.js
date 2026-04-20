import { apiRequest } from "./client";

function mapOrder(order) {
  const parcel = order.parcel ?? {};
  const pickupLocation = order.pickup_location ?? {};
  const deliveryLocation = order.delivery_location ?? {};
  const currentLocation = order.current_location ?? {};
  const assignedRider = order.assigned_rider ?? null;

  return {
    id: String(order.id),
    backendId: order.id,
    parcelId: order.parcel_id,
    parcelName: parcel.description ?? `Order ${order.id}`,
    pickupLocationId: order.pickup_location_id,
    pickupLocation: pickupLocation.address ?? `Location #${order.pickup_location_id}`,
    pickupCoords:
      pickupLocation.latitude != null && pickupLocation.longitude != null
        ? {
            latitude: Number(pickupLocation.latitude),
            longitude: Number(pickupLocation.longitude),
          }
        : null,
    deliveryLocationId: order.delivery_location_id,
    destination: deliveryLocation.address ?? `Location #${order.delivery_location_id}`,
    destinationCoords:
      deliveryLocation.latitude != null && deliveryLocation.longitude != null
        ? {
            latitude: Number(deliveryLocation.latitude),
            longitude: Number(deliveryLocation.longitude),
          }
        : null,
    currentLocationId: order.current_location_id,
    currentLocation: currentLocation.address ?? (order.current_location_id ? `Location #${order.current_location_id}` : "Awaiting rider update"),
    assignedRiderId: order.assigned_rider_id,
    assignedRider: assignedRider
      ? {
          id: assignedRider.id,
          email: assignedRider.email,
          role: assignedRider.role,
        }
      : null,
    quotedPrice: order.quoted_price,
    distanceKm: order.distance_km ?? 0,
    durationMinutes: order.estimated_duration_minutes ?? 0,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    assignedAt: order.assigned_at,
    pickedUpAt: order.picked_up_at,
    deliveredAt: order.delivered_at,
    cancelledAt: order.cancelled_at,
    weightCategory: parcel.weight_category_name ?? `Category #${parcel.weight_category_id ?? ""}`,
    description: parcel.special_instructions ?? parcel.description ?? "",
    parcel: {
      ...parcel,
      specialInstructions: parcel.special_instructions ?? null,
      weightCategoryName: parcel.weight_category_name ?? null,
    },
  };
}

function mapTrackingUpdate(update) {
  return {
    id: update.id,
    status: update.status,
    note: update.note || "No note added yet.",
    locationLabel: update.location_id ? `Location #${update.location_id}` : "Location not provided",
    createdAt: update.created_at,
    updatedBy: update.updated_by,
  };
}

function splitOrders(orders) {
  return orders.reduce(
    (groups, order) => {
      if (["delivered", "cancelled"].includes(order.status)) {
        groups.orderHistory.push(order);
      } else {
        groups.currentOrders.push(order);
      }

      return groups;
    },
    { currentOrders: [], orderHistory: [] },
  );
}

export async function listOrders(token, { page = 1, limit = 20 } = {}) {
  const response = await apiRequest(`/orders/?page=${page}&limit=${limit}`, { token });
  const items = (response.data.items || []).map(mapOrder);

  return {
    items,
    ...splitOrders(items),
    page: response.data.page,
    limit: response.data.limit,
    total: response.data.total,
    message: response.message,
  };
}

export async function getOrderRequest(token, orderId) {
  const response = await apiRequest(`/orders/${orderId}`, { token });

  return {
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function fetchOrderReferenceData(token) {
  const response = await apiRequest("/orders/reference-data", { token });

  return {
    locations: response.data.locations.map((location) => ({
      id: location.id,
      label: `${location.address}${location.city ? `, ${location.city}` : ""}`,
      address: location.address,
      city: location.city,
      country: location.country,
      latitude: location.latitude != null ? Number(location.latitude) : null,
      longitude: location.longitude != null ? Number(location.longitude) : null,
    })),
    weightCategories: response.data.weight_categories.map((category) => ({
      id: category.id,
      name: category.name,
      minWeight: category.min_weight,
      maxWeight: category.max_weight,
      basePrice: category.base_price,
    })),
  };
}

export async function createOrderRequest(token, payload) {
  const response = await apiRequest("/orders/", {
    method: "POST",
    token,
    body: payload,
  });

  return {
    order: mapOrder(response.data.order),
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
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function updateOrderStatusRequest(token, orderId, payload) {
  const response = await apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function updateOrderLocationRequest(token, orderId, payload) {
  const response = await apiRequest(`/orders/${orderId}/location`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function assignOrderRequest(token, orderId, payload = {}) {
  const response = await apiRequest(`/orders/${orderId}/assign`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function cancelOrderRequest(token, orderId, payload = {}) {
  const response = await apiRequest(`/orders/${orderId}/cancel`, {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    order: mapOrder(response.data.order),
    message: response.message,
  };
}

export async function listTrackingUpdatesRequest(token, orderId) {
  const response = await apiRequest(`/tracking/${orderId}`, { token });

  return {
    updates: (response.data.updates || []).map(mapTrackingUpdate),
    message: response.message,
  };
}
