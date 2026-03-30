import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../store";

export function AppLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <div className={`app-shell ${isDashboard ? "dashboard-shell" : ""}`}>
      {isDashboard && (
        <>
          <button
            className="mobile-menu-btn"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="brand-row">
              <div className="brand-logo">D</div>
              <div>
                <h2>Deliveroo</h2>
                <p>Order Control</p>
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
      )}

      <main className={`main-content ${isDashboard ? "dashboard-main" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}