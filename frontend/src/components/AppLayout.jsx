import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../store";

export function AppLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  const appShellRoutes = ["/dashboard", "/orders", "/help"];
  const isAppArea = appShellRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Help", path: "/help" },
    { label: "Admin Dashboard", path: "/dashboard" },
  ];

  const authItems = [
    { label: "Sign In", path: "/login" },
    { label: "Register", path: "/register" },
  ];

  return (
    <div className={`app-shell ${isAppArea ? "dashboard-shell" : "public-shell"}`}>
      {isAppArea ? (
        <>
          <button
            className="mobile-menu-btn"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            Menu
          </button>

          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="brand-row">
              <div className="brand-logo">D</div>
              <div>
                <h2>Deliveroo</h2>
                <p>Customer & Admin Hub</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => dispatch(closeSidebar())}
                >
                  {item.label}
                </NavLink>
              ))}

              <NavLink
                to="/login"
                className="nav-link"
                onClick={() => dispatch(closeSidebar())}
              >
                Sign In
              </NavLink>

              <button className="nav-link logout-btn" type="button">
                Logout
              </button>
            </nav>
          </aside>

          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => dispatch(closeSidebar())}
            />
          )}
        </>
      ) : (
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
                    {item.label}
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
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </header>
      )}

      <main className={`main-content ${isAppArea ? "dashboard-main" : "public-main"}`}>
        <Outlet />
      </main>
    </div>
  );
}
