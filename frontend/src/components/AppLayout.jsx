import { NavLink, Outlet } from "react-router-dom";

function NavIcon({ name }) {
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
      </svg>
    ),
    orders: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5h10" />
        <path d="M7 9h10" />
        <path d="M7 13.5h10" />
        <path d="M7 18h6" />
        <path d="M4.5 4.5h.01" />
        <path d="M4.5 9h.01" />
        <path d="M4.5 13.5h.01" />
        <path d="M4.5 18h.01" />
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.75 9a2.25 2.25 0 1 1 3.75 1.68c-.87.73-1.5 1.23-1.5 2.57" />
        <path d="M12 17h.01" />
      </svg>
    ),
    dashboard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="7" rx="1.5" />
        <rect x="14" y="4" width="6" height="4" rx="1.5" />
        <rect x="14" y="11" width="6" height="9" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
      </svg>
    ),
    login: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H4" />
        <path d="M20 4v16" />
      </svg>
    ),
    register: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7v10" />
        <path d="M7 12h10" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  };

  return <span className="nav-icon">{icons[name]}</span>;
}

export function AppLayout() {
  const navItems = [
    { label: "Home", path: "/", icon: "home" },
    { label: "Orders", path: "/orders", icon: "orders" },
    { label: "Help", path: "/help", icon: "help" },
    { label: "Admin Dashboard", path: "/dashboard", icon: "dashboard" },
  ];

  const authItems = [
    { label: "Sign In", path: "/login", icon: "login" },
    { label: "Register", path: "/register", icon: "register" },
  ];

  return (
    <div className="app-shell public-shell">
      <header className="public-header">
        <div className="public-header-inner glass-card">
          <NavLink to="/" className="public-brand">
            <span className="public-brand-mark">D</span>
            <span>Deliveroo</span>
          </NavLink>

          <nav className="public-nav">
            <div className="public-nav-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `public-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="public-auth-links">
              {authItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `public-nav-link auth-link ${isActive ? "active" : ""}`
                  }
                >
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content public-main">
        <Outlet />
      </main>
    </div>
  );
}
