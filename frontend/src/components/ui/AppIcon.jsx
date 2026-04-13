const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.85,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const icons = {
  package: (
    <>
      <path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" />
      <path d="M12 21v-9.6" />
      <path d="M4.5 7.2 12 11l7.5-3.8" />
    </>
  ),
  route: (
    <>
      <path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M17 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M7 14c0-4 10 0 10-6" />
      <path d="M12 19h7" />
    </>
  ),
  rider: (
    <>
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M9.5 17H14l2.5-5h-4l-2-3H8" />
      <path d="M13 8h4.5" />
    </>
  ),
  support: (
    <>
      <path d="M5 12a7 7 0 0 1 14 0v3a2 2 0 0 1-2 2h-2v-4h4" />
      <path d="M5 13h4v4H7a2 2 0 0 1-2-2v-2Z" />
      <path d="M9 19c.7 1 1.8 1.5 3 1.5 1.1 0 2.2-.5 3-1.5" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5H6.5A2.5 2.5 0 0 0 4 11v-3.5Z" />
      <path d="M20 8.5H6.5A2.5 2.5 0 0 0 4 11v5.5A2.5 2.5 0 0 0 6.5 19H20V8.5Z" />
      <path d="M15.5 14h.01" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19h16" />
      <path d="M7 15v-4" />
      <path d="M12 15V7" />
      <path d="M17 15v-6" />
    </>
  ),
  admin: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M7 19a5 5 0 0 1 10 0" />
      <path d="M18.5 6.5h2" />
      <path d="M19.5 5.5v2" />
    </>
  ),
  customer: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  bell: (
    <>
      <path d="M15 18H9" />
      <path d="M18 16H6c1.2-1.1 2-2.8 2-4.8V10a4 4 0 1 1 8 0v1.2c0 2 .8 3.7 2 4.8Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5l3 1.5" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4 10-10" />
    </>
  ),
  map: (
    <>
      <path d="M9 18.5 4.5 20V5.5L9 4l6 1.5 4.5-1.5V18.5L15 20l-6-1.5Z" />
      <path d="M9 4v14.5" />
      <path d="M15 5.5V20" />
    </>
  ),
  spark: (
    <>
      <path d="m12 4 1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5L12 4Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.3 2.9 7.9 7 9 4.1-1.1 7-4.7 7-9V6l-7-3Z" />
      <path d="m9.5 11.5 1.8 1.8 3.2-3.8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m16 16 3.5 3.5" />
    </>
  ),
};

export function AppIcon({ name, className = "", label, size = 22 }) {
  const glyph = icons[name] || icons.package;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
      {...iconProps}
    >
      {glyph}
    </svg>
  );
}
