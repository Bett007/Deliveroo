import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissNotification, markAllNotificationsRead } from "../../features/notifications/notificationsSlice";
import { formatReadableDate } from "../../utils/formatters/date";

export function NotificationBell({ label = "Notifications", minimumCount = 0 }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);
  const visibleCount = Math.max(minimumCount, unreadCount);

  return (
    <div className="notification-shell">
      <button
        type="button"
        className="notification-cluster notification-trigger"
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          if (!open) {
            dispatch(markAllNotificationsRead());
          }
        }}
      >
        <span className="notification-bell" aria-hidden="true">🔔</span>
        <span className="alert-chip">{visibleCount}</span>
      </button>

      {open ? (
        <div className="notification-dropdown">
          <div className="notification-dropdown-head">
            <h3>{label}</h3>
            {items.length ? (
              <button type="button" className="secondary-btn" onClick={() => dispatch(markAllNotificationsRead())}>
                Mark all read
              </button>
            ) : null}
          </div>

          {items.length ? (
            <div className="notification-dropdown-list">
              {items.slice(0, 6).map((item) => (
                <article key={item.id} className="notification-item">
                  <div className="notification-avatar">{item.type?.[0]?.toUpperCase() || "N"}</div>
                  <div className="notification-copy">
                    <p>{item.message}</p>
                    <small>{formatReadableDate(item.createdAt)}</small>
                  </div>
                  <button type="button" className="secondary-btn" onClick={() => dispatch(dismissNotification(item.id))}>
                    Dismiss
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="notification-empty">No new updates right now.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
