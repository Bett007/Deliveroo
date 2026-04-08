import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { resetOrdersState } from "../features/orders/ordersSlice";
import { Button } from "./ui/Button";

function NavIcon({ name }) {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="7" rx="1.5" />
        <rect x="14" y="4" width="6" height="4" rx="1.5" />
        <rect x="14" y="11" width="6" height="9" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
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
    create: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.75 9a2.25 2.25 0 1 1 3.75 1.68c-.87.73-1.5 1.23-1.5 2.57" />
        <path d="M12 17h.01" />
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

function PortalHeader({ title, subtitle, navItems, userEmail, onLogout, shellClass }) {
  return (
    <header className={`portal-header ${shellClass}-header`}>
      <div className="portal-header-inner glass-card">
        <div className="portal-brand-block">
          <div className={`portal-mark ${shellClass}-mark`}>{shellClass === "admin" ? "A" : "C"}</div>
          <div>
            <p className="portal-kicker">{title}</p>
            <h1>{subtitle}</h1>
          </div>
        </div>

        <nav className="portal-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `portal-nav-link ${isActive ? "active" : ""}`}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="portal-user-block">
          <span className="user-chip">{userEmail}</span>
          <Button className="portal-nav-link auth-link" onClick={onLogout}>
            <NavIcon name="login" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function AuthHeader() {
  return (
    <header className="auth-portal-header">
      <div className="auth-portal-inner glass-card">
        <div className="portal-brand-block">
          <div className="portal-mark auth-mark">D</div>
          <div>
            <p className="portal-kicker">Deliveroo Access</p>
            <h1>Authenticate before entering the workspace</h1>
          </div>
        </div>

        <nav className="portal-nav auth-nav">
          <NavLink to="/login" className={({ isActive }) => `portal-nav-link ${isActive ? "active" : ""}`}>
            <NavIcon name="login" />
            <span>Sign In</span>
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => `portal-nav-link ${isActive ? "active" : ""}`}>
            <NavIcon name="register" />
            <span>Sign Up</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const isAuthRoute = ["/login", "/register", "/verify"].includes(location.pathname);
  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    dispatch(logoutUser());
    dispatch(resetOrdersState());
    navigate("/login");
  }

  if (!isAuthenticated) {
    return (
      <div className="app-shell auth-shell">
        {isAuthRoute ? <AuthHeader /> : null}
        <main className="main-content auth-main">
          <Outlet />
        </main>
      </div>
    );
  }

  const navItems = isAdmin
    ? [
        { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
        { label: "Orders", path: "/orders", icon: "orders" },
        { label: "Help", path: "/help", icon: "help" },
      ]
    : [
        { label: "Orders", path: "/orders", icon: "orders" },
        { label: "Create Order", path: "/orders/create", icon: "create" },
        { label: "Help", path: "/help", icon: "help" },
      ];

  return (
    <div className={`app-shell role-shell ${isAdmin ? "admin-shell" : "customer-shell"}`}>
      <PortalHeader
        title={isAdmin ? "Admin Portal" : "Customer Workspace"}
        subtitle={isAdmin ? "Operations, monitoring, and backend rollout status" : "Parcel booking, tracking, and support"}
        navItems={navItems}
        userEmail={user.email}
        onLogout={handleLogout}
        shellClass={isAdmin ? "admin" : "customer"}
      />

      <main className={`main-content role-main ${isAdmin ? "admin-main" : "customer-main"}`}>
        <Outlet />
      </main>
    </div>
  );
}
