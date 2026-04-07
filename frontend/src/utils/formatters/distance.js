export function formatDistance(distanceInKm) {
  if (distanceInKm == null || Number.isNaN(Number(distanceInKm))) {
    return "--";
  }

  return `${Number(distanceInKm).toFixed(1)} km`;
}

export function formatDuration(durationInMinutes) {
  if (durationInMinutes == null || Number.isNaN(Number(durationInMinutes))) {
    return "--";
  }

  const totalMinutes = Number(durationInMinutes);

  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return minutes ? `${hours} hr ${minutes} min` : `${hours} hr`;
}
