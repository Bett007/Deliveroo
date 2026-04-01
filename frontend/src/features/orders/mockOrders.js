const now = new Date();

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000).toISOString();
}

export const mockCurrentOrders = [
  {
    id: "DLV-2104",
    parcelName: "Documents package",
    pickupLocation: "Westlands, Nairobi",
    destination: "Kilimani, Nairobi",
    status: "in_transit",
    weightCategory: "light",
    description: "Client contracts and signed forms.",
    distanceKm: 8.6,
    durationMinutes: 18,
    createdAt: addMinutes(now, -95),
    updatedAt: addMinutes(now, -12),
  },
  {
    id: "DLV-2105",
    parcelName: "Electronics parcel",
    pickupLocation: "CBD, Nairobi",
    destination: "Karen, Nairobi",
    status: "pickup_scheduled",
    weightCategory: "medium",
    description: "Laptop accessories and chargers.",
    distanceKm: 17.2,
    durationMinutes: 35,
    createdAt: addMinutes(now, -140),
    updatedAt: addMinutes(now, -25),
  },
];

export const mockOrderHistory = [
  {
    id: "DLV-2088",
    parcelName: "Fashion items",
    pickupLocation: "Ruiru, Kiambu",
    destination: "Thika, Kiambu",
    status: "delivered",
    weightCategory: "medium",
    description: "Boutique restock order.",
    distanceKm: 12.4,
    durationMinutes: 28,
    createdAt: addMinutes(now, -1600),
    updatedAt: addMinutes(now, -1450),
  },
  {
    id: "DLV-2071",
    parcelName: "Household package",
    pickupLocation: "South B, Nairobi",
    destination: "Syokimau, Machakos",
    status: "cancelled",
    weightCategory: "heavy",
    description: "Home storage items.",
    distanceKm: 14.7,
    durationMinutes: 32,
    createdAt: addMinutes(now, -2200),
    updatedAt: addMinutes(now, -2100),
  },
];
