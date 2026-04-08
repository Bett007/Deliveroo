export function validateCreateOrderForm(values) {
  const errors = {};

  if (!values.parcelName.trim()) {
    errors.parcelName = "Parcel name is required.";
  }

  if (!values.pickupLocationId) {
    errors.pickupLocation = "Pickup location is required.";
  }

  if (!values.destinationLocationId) {
    errors.destination = "Destination is required.";
  }

  if (!values.weightKg || Number(values.weightKg) <= 0) {
    errors.weightKg = "Parcel weight must be greater than 0.";
  }

  if (!values.description.trim()) {
    errors.description = "Parcel description is required.";
  }

  return errors;
}

export function validateDestination(value) {
  if (!value) {
    return "Enter a new destination before saving.";
  }

  return "";
}
