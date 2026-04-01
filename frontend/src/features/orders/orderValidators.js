export function validateCreateOrderForm(values) {
  const errors = {};

  if (!values.parcelName.trim()) {
    errors.parcelName = "Parcel name is required.";
  }

  if (!values.pickupLocation.trim()) {
    errors.pickupLocation = "Pickup location is required.";
  }

  if (!values.destination.trim()) {
    errors.destination = "Destination is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Parcel description is required.";
  }

  return errors;
}

export function validateDestination(value) {
  if (!value.trim()) {
    return "Enter a new destination before saving.";
  }

  return "";
}
