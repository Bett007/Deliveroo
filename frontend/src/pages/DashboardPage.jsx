import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PlaceholderArtwork } from "../components/ui/PlaceholderArtwork";
import { SectionCard } from "../components/ui/SectionCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { fetchOrders } from "../features/orders/ordersSlice";

const backendCapabilities = [
  "POST /api/auth/login and GET /api/auth/me are already wired into the frontend auth flow.",
  "GET /api/orders and GET /api/orders/:id now drive the customer order workspace.",
  "PATCH /api/orders/:id/destination and PATCH /api/orders/:id/cancel are available from the order details page.",
  "GET /api/tracking/:id is exposed in the order details page for delivery progress updates.",
];

const backendGaps = [
  "There is no frontend location picker yet because the backend does not expose a location lookup endpoint.",
  "The backend currently does not provide a global admin analytics feed, so this dashboard stays focused on shipped capabilities.",
  "Admin-only status and location update endpoints exist in the backend, but they still need dedicated UI forms.",
];

export function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentOrders, orderHistory, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const summaryCards = useMemo(() => {
    const totalOrders = currentOrders.length + orderHistory.length;
    const inFlight = currentOrders.filter((order) => order.status === "in_transit").length;

    return [
      { title: "Orders In Account", value: String(totalOrders), sub: "Fetched from the current orders API" },
      { title: "Active Orders", value: String(currentOrders.length), sub: "Pending, confirmed, or in transit" },
      { title: "Delivered Or Cancelled", value: String(orderHistory.length), sub: "Historic records already returned" },
      { title: "In Transit", value: String(inFlight), sub: "Live deliveries from your current data" },
    ];
  }, [currentOrders, orderHistory]);

  return (
    <section className="dashboard-page">
      <header className="dashboard-topbar workspace-hero-split glass-card">
        <div className="workspace-hero-copy">
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Backend integration progress</h1>
          <p className="workspace-copy">
            This dashboard now reflects the APIs the backend team has shipped so far instead of mock operational analytics.
          </p>

          <div className="topbar-actions">
            <span className="user-chip">{user?.email || "Signed-in admin"}</span>
            <Link to="/orders" className="primary-btn">Open Orders Workspace</Link>
          </div>
        </div>

        <PlaceholderArtwork
          variant="admin"
          label="Admin Preview"
          title="A reserved panel for ops imagery and analytics visuals"
          caption="This placeholder can later become a live hero chart, dispatch photo, team banner, or branded admin illustration."
        />
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="glass-card summary-card">
            <p className="card-label">{card.title}</p>
            <h3>{card.value}</h3>
            <span>{card.sub}</span>
          </div>
        ))}
      </section>

      <div className="workspace-grid">
        <SectionCard title="Available Backend Features" description="What the frontend can already use safely today.">
          <div className="feature-list">
            {backendCapabilities.map((item) => (
              <article key={item} className="feature-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Current Backend Constraints" description="Important limits to keep in mind while frontend work continues.">
          <div className="feature-list">
            {backendGaps.map((item) => (
              <article key={item} className="feature-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Operational Snapshot" description="A truthful view of the data currently available to this admin account.">
        {status === "loading" ? (
          <p className="helper-text">Loading order data for this account...</p>
        ) : currentOrders.length || orderHistory.length ? (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Quoted Price</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {[...currentOrders, ...orderHistory].slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td><StatusBadge>{order.status.replaceAll("_", " ")}</StatusBadge></td>
                    <td>{order.pickupLocation}</td>
                    <td>{order.destination}</td>
                    <td>KES {Number(order.quotedPrice || 0).toFixed(2)}</td>
                    <td>{new Date(order.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="helper-text">No order records are available for this signed-in admin account yet.</p>
        )}
      </SectionCard>
    </section>
  );
}
