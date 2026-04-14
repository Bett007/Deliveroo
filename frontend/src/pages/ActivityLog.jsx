import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/ui/SectionCard";

const logSeed = [
  { id: 1, timestamp: "2026-04-10T14:30:00.000Z", admin: "admin-01", action: "Update Order #2340", status: "success" },
  { id: 2, timestamp: "2026-04-10T14:15:00.000Z", admin: "admin-02", action: "Create Rider #1234", status: "success" },
  { id: 3, timestamp: "2026-04-10T13:45:00.000Z", admin: "admin-01", action: "View Order #2325", status: "success" },
  { id: 4, timestamp: "2026-04-09T17:15:00.000Z", admin: "admin-03", action: "Update Delivery Status #2319", status: "success" },
  { id: 5, timestamp: "2026-04-09T16:04:00.000Z", admin: "admin-02", action: "Resolve Support Escalation #188", status: "success" },
];

export function ActivityLog() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [query, setQuery] = useState("");

  const filteredLogs = useMemo(() => {
    return logSeed.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(`${toDate}T23:59:59`) : null;
      const search = query.trim().toLowerCase();

      if (from && entryDate < from) return false;
      if (to && entryDate > to) return false;

      if (!search) return true;

      return entry.admin.toLowerCase().includes(search) || entry.action.toLowerCase().includes(search);
    });
  }, [fromDate, query, toDate]);

  return (
    <section className="workspace-page">
      <header className="workspace-hero glass-card">
        <div>
          <p className="eyebrow">Activity Log</p>
          <h1>Admin audit trail</h1>
          <p className="workspace-copy">Track who performed each admin action and when it happened.</p>
        </div>
        <Link className="secondary-btn" to="/admin/dashboard">Back to Admin Dashboard</Link>
      </header>

      <SectionCard title="Filters" description="Filter audit logs by date range and keyword.">
        <div className="topbar-actions">
          <label className="form-group">
            <span>From</span>
            <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className="form-group">
            <span>To</span>
            <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
          <label className="form-group" style={{ minWidth: "280px" }}>
            <span>Search</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by admin or action" />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Audit Entries" description={`${filteredLogs.length} entries found`}>
        {filteredLogs.length ? (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.timestamp).toLocaleString()}</td>
                    <td>{entry.admin}</td>
                    <td>{entry.action}</td>
                    <td>{entry.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="helper-text">No activity entries match these filters.</p>
        )}
      </SectionCard>
    </section>
  );
}
