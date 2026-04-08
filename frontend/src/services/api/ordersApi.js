import { apiRequest } from "./client";

function mapOrder(order) {
  const parcel = order.parcel ?? {};
  const pickupLocation = order.pickup_location ?? {};
  const deliveryLocation = order.delivery_location ?? {};
  const currentLocation = order.current_location ?? {};

  return {
    id: String(order.id),
    backendId: order.id,
    parcelName: parcel.description ?? `Order ${order.id}`,
    pickupLocation: pickupLocation.address ?? `Location #${order.pickup_location_id}`,
    destination: deliveryLocation.address ?? `Location #${order.delivery_location_id}`,
    currentLocation: currentLocation.address ?? null,
    status: order.status,
    weightCategory: parcel.weight_category_name ?? `Category #${parcel.weight_category_id ?? ""}`,
    description: parcel.special_instructions ?? parcel.description ?? "",
    distanceKm: order.distance_km ?? 0,
    durationMinutes: order.estimated_duration_minutes ?? 0,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    pickupLocationId: order.pickup_location_id,
    destinationLocationId: order.delivery_location_id,
    currentLocationId: order.current_location_id,
    quotedPrice: order.quoted_price,
    parcel: {
      ...parcel,
      specialInstructions: parcel.special_instructions ?? null,
      weightCategoryName: parcel.weight_category_name ?? null,
    },
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

export async function listOrders(token) {
  const response = await apiRequest("/orders/", { token });
  const mappedOrders = response.data.items.map(mapOrder);

  return {
    ...splitOrders(mappedOrders),
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
}

export async function fetchOrderReferenceData(token) {
  const response = await apiRequest("/orders/reference-data", { token });

  return {
    locations: response.data.locations.map((location) => ({
      id: location.id,
      label: `${location.address}${location.city ? `, ${location.city}` : ""}`,
      city: location.city,
      country: location.country,
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
