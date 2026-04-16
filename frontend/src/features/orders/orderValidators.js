export function validateCreateOrderForm(values) {
  const errors = {};

  if (!String(values.parcelName || "").trim()) {
    errors.parcelName = "Parcel name is required.";
  }

  if (!String(values.pickupCounty || "").trim()) {
    errors.pickupCounty = "Pickup county is required.";
  }

  if (!String(values.pickupStreet || "").trim()) {
    errors.pickupStreet = "Pickup street or location is required.";
  }

  if (!String(values.destinationCounty || "").trim()) {
    errors.destinationCounty = "Destination county is required.";
  }

  if (!String(values.destinationStreet || "").trim()) {
    errors.destinationStreet = "Destination street or location is required.";
  }

  if (!String(values.weightCategoryId || "").trim()) {
    errors.weightCategoryId = "Weight category is required.";
  }

  if (!String(values.weightKg || "").trim()) {
    errors.weightKg = "Parcel weight is required.";
  } else if (Number(values.weightKg) <= 0) {
    errors.weightKg = "Parcel weight must be greater than 0.";
  }

  if (!String(values.description || "").trim()) {
    errors.description = "Parcel description is required.";
  }

  return errors;
}

export function validateDestination(value) {
  if (!String(value || "").trim()) {
    return "Enter a new destination before saving.";
  }

  if (Number(value) <= 0) {
    return "Delivery location ID must be a positive number.";
  }

  return "";
}
