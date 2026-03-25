import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
  { to: "/dashboard", label: "Dashboard" },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>Deliveroo</strong>
        <nav className="app-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
