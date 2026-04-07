export function formatReadableDate(value, locale = "en-US") {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRelativeLabel(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  const diffInMinutes = Math.round((date.getTime() - Date.now()) / 60000);

  if (Math.abs(diffInMinutes) < 60) {
    return `${Math.abs(diffInMinutes)} min ${diffInMinutes >= 0 ? "from now" : "ago"}`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  return `${Math.abs(diffInHours)} hr ${diffInHours >= 0 ? "from now" : "ago"}`;
}
