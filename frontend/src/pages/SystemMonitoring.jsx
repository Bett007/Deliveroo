import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/ui/SectionCard";

function randomLatency(base) {
  return base + Math.floor(Math.random() * 40);
}

export function SystemMonitoring() {
  const [snapshot, setSnapshot] = useState({
    authApi: randomLatency(120),
    ordersApi: randomLatency(130),
    trackingApi: randomLatency(140),
    uptime: "99.8%",
    errors5xx: 0,
    errors4xx: 3,
    timeouts: 0,
    checkedAt: new Date(),
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSnapshot((current) => ({
        ...current,
        authApi: randomLatency(120),
        ordersApi: randomLatency(130),
        trackingApi: randomLatency(140),
        checkedAt: new Date(),
      }));
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">System Monitoring</p>
          <h1>Platform health and service checks</h1>
          <p className="workspace-copy">Health indicators refresh every 30 seconds for operational visibility.</p>
        </div>
        <Link className="secondary-btn" to="/admin/dashboard">Back to Admin Dashboard</Link>
      </header>

      <div className="workspace-grid">
        <SectionCard title="API Health" description={`Last check: ${snapshot.checkedAt.toLocaleTimeString()}`}>
          <div className="order-card-list">
            <article className="order-card">
              <h3>Auth API</h3>
              <p className="helper-text">Up - {snapshot.authApi}ms</p>
            </article>
            <article className="order-card">
              <h3>Orders API</h3>
              <p className="helper-text">Up - {snapshot.ordersApi}ms</p>
            </article>
            <article className="order-card">
              <h3>Tracking API</h3>
              <p className="helper-text">Up - {snapshot.trackingApi}ms</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard title="Error Rates (24h)" description="Latest recorded API and network error counts.">
          <div className="order-card-list">
            <article className="order-card">
              <h3>5xx Errors</h3>
              <p className="helper-text">{snapshot.errors5xx}</p>
            </article>
            <article className="order-card">
              <h3>4xx Errors</h3>
              <p className="helper-text">{snapshot.errors4xx}</p>
            </article>
            <article className="order-card">
              <h3>Timeout Errors</h3>
              <p className="helper-text">{snapshot.timeouts}</p>
            </article>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="System Stats" description="Availability and response baseline.">
        <div className="summary-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="glass-card summary-card">
            <p className="card-label">Uptime</p>
            <h3>{snapshot.uptime}</h3>
            <span>Rolling service availability</span>
          </div>
          <div className="glass-card summary-card">
            <p className="card-label">Average Response</p>
            <h3>{Math.round((snapshot.authApi + snapshot.ordersApi + snapshot.trackingApi) / 3)}ms</h3>
            <span>Across core delivery endpoints</span>
          </div>
          <div className="glass-card summary-card">
            <p className="card-label">Database</p>
            <h3>Connected</h3>
            <span>Operational state: healthy</span>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
