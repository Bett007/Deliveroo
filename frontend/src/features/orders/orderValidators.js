export function validateCreateOrderForm(values) {
  const errors = {};

  if (!String(values.pickupLocationId || "").trim()) {
    errors.pickupLocationId = "Pickup location ID is required.";
  }

  if (!String(values.deliveryLocationId || "").trim()) {
    errors.deliveryLocationId = "Delivery location ID is required.";
  }

  if (!String(values.quotedPrice || "").trim()) {
    errors.quotedPrice = "Quoted price is required.";
  } else if (Number(values.quotedPrice) < 0) {
    errors.quotedPrice = "Quoted price must be zero or greater.";
  }

  if (!String(values.parcelDescription || "").trim()) {
    errors.parcelDescription = "Parcel description is required.";
  }

  if (!String(values.weight || "").trim()) {
    errors.weight = "Parcel weight is required.";
  } else if (Number(values.weight) <= 0) {
    errors.weight = "Parcel weight must be greater than zero.";
  }

  if (!String(values.weightCategoryId || "").trim()) {
    errors.weightCategoryId = "Weight category ID is required.";
  }

  return errors;
}

export function validateDestination(value) {
  if (!String(value || "").trim()) {
    return "Enter a new delivery location ID before saving.";
  }

  if (Number(value) <= 0) {
    return "Delivery location ID must be a positive number.";
  }

  return "";
}
