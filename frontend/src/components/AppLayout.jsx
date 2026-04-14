import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import deliverooLogoIcon from "../assets/deliveroo-logo-icon.svg";
import { logoutUser } from "../features/auth/authSlice";
import { resetOrdersState } from "../features/orders/ordersSlice";
import { Button } from "./ui/Button";
import shellStyles from "./AppLayout.module.css";
import opsSharedStyles from "../pages/OpsShared.module.css";

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

function RoleSidebar({ title, subtitle, navItems, userEmail, onLogout, shellClass }) {
  return (
    <aside className={`ops-sidebar ${shellClass}-sidebar`}>
      <div className="ops-brand-block">
        <img src={deliverooLogoIcon} alt="Deliveroo" className="ops-brand-logo" />
        <div>
          <p>{title}</p>
          <strong>Deliveroo</strong>
        </div>
      </div>

      <div className="ops-sidebar-copy">
        <h2>{subtitle}</h2>
      </div>

      <nav className="ops-nav" aria-label={`${title} navigation`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `ops-nav-link ${isActive ? "active" : ""}`}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="ops-sidebar-footer">
        <span>{userEmail}</span>
        <Button className="ops-logout-btn" onClick={onLogout}>
          <NavIcon name="login" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}

function AuthHeader() {
  return (
    <header className="auth-portal-header">
      <div className="auth-portal-inner glass-card">
        <div className="portal-brand-block">
          <div className="portal-mark auth-mark">
            <img src={deliverooLogoIcon} alt="" className="auth-header-logo" />
          </div>
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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth > 1120;
  });
  const isAuthRoute = ["/login", "/register", "/verify"].includes(location.pathname);
  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";
  const isRider = user?.role === "rider";

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 1120) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1120) {
        setSidebarOpen(true);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    dispatch(logoutUser());
    dispatch(resetOrdersState());
    navigate("/login");
  }

  if (!isAuthenticated) {
    return (
      <div className={shellStyles.scope}>
        <div className="app-shell auth-shell">
          {isAuthRoute ? <AuthHeader /> : null}
          <main className="main-content auth-main">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  const navItems = isAdmin
    ? [
        { label: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
        { label: "Manage Orders", path: "/admin/orders", icon: "orders" },
        { label: "Analytics", path: "/admin/analytics", icon: "orders" },
        { label: "Monitoring", path: "/admin/monitoring", icon: "help" },
        { label: "Activity", path: "/admin/activity", icon: "create" },
        { label: "Profile", path: "/profile", icon: "register" },
        { label: "Help", path: "/help", icon: "help" },
      ]
    : isRider
      ? [
          { label: "Dashboard", path: "/rider/dashboard", icon: "dashboard" },
          { label: "Work Board", path: "/rider/board", icon: "orders" },
          { label: "Active Deliveries", path: "/deliveries/active", icon: "orders" },
          { label: "Delivery History", path: "/deliveries/history", icon: "create" },
          { label: "Route Map", path: "/map", icon: "help" },
          { label: "Profile", path: "/profile", icon: "register" },
          { label: "Help", path: "/help", icon: "help" },
        ]
      : [
          { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
          { label: "Orders", path: "/orders", icon: "orders" },
          { label: "History", path: "/orders/history", icon: "create" },
          { label: "Create Order", path: "/orders/create", icon: "create" },
          { label: "Profile", path: "/profile", icon: "register" },
          { label: "Help", path: "/help", icon: "help" },
        ];

  return (
    <div className={`${shellStyles.scope} ${opsSharedStyles.scope}`}>
      <div
        className={`role-shell ops-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"} ${isAdmin ? "admin-shell" : isRider ? "rider-shell" : "customer-shell"}`}
      >
        <RoleSidebar
          title={isAdmin ? "Admin Portal" : isRider ? "Rider Workspace" : "Customer Workspace"}
          subtitle={
            isAdmin
              ? "Operations, monitoring, and dispatch control"
              : isRider
                ? "Manage active deliveries, history, and route updates"
                : "Parcel booking, tracking, and support"
          }
          navItems={navItems}
          userEmail={user.email}
          onLogout={handleLogout}
          shellClass={isAdmin ? "admin" : isRider ? "rider" : "customer"}
        />

        <main className={`role-main ops-main ${isAdmin ? "admin-main" : isRider ? "rider-main" : "customer-main"}`}>
          <button
            type="button"
            className="ops-shell-toggle"
            aria-label={sidebarOpen ? "Hide menu" : "Show menu"}
            onClick={() => setSidebarOpen((current) => !current)}
          >
            {sidebarOpen ? "←" : "☰"}
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
