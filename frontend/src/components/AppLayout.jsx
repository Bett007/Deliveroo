import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import deliverooLogoIcon from "../assets/deliveroo-logo-icon.svg";
import placeholderProfileAvatar from "../assets/icons/placeholder_profile_avatar.svg";
import { logoutUser } from "../features/auth/authSlice";
import { resetOrdersState } from "../features/orders/ordersSlice";
import { Button } from "./ui/Button";
import { ErrorBoundary } from "./ErrorBoundary";
import shellStyles from "./AppLayout.module.css";
import opsSharedStyles from "../pages/OpsShared.module.css";

const PROFILE_PLACEHOLDER_SRC = placeholderProfileAvatar;

function getViewportWidth() {
  if (typeof window === "undefined") {
    return 1440;
  }

  const widths = [
    window.innerWidth,
    window.visualViewport?.width,
    document.documentElement?.clientWidth,
  ].filter((value) => Number.isFinite(value) && value > 0);

  return widths.length ? Math.min(...widths) : window.innerWidth;
}

function isMobileShellViewport() {
  return getViewportWidth() <= 1120;
}

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

function ProfileNavAvatar({ avatarUrl, fallbackInitial }) {
  const [usePlaceholder, setUsePlaceholder] = useState(!avatarUrl);
  const [showInitial, setShowInitial] = useState(false);
  const src = usePlaceholder ? PROFILE_PLACEHOLDER_SRC : avatarUrl;

  return (
    <span className="nav-avatar-icon" aria-hidden="true">
      {!showInitial ? (
        <img
          src={src}
          alt=""
          onError={() => {
            if (!usePlaceholder) {
              setUsePlaceholder(true);
              return;
            }
            setShowInitial(true);
          }}
        />
      ) : (
        <span className="nav-avatar-fallback">{fallbackInitial}</span>
      )}
    </span>
  );
}

function RoleSidebar({
  title,
  subtitle,
  navItems,
  userEmail,
  userAvatarUrl,
  userFallbackInitial,
  onLogout,
  shellClass,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  mobile = false,
}) {
  return (
    <aside
      className={`ops-sidebar ${shellClass}-sidebar ${mobile ? "mobile-sidebar" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
            onClick={onNavigate}
          >
            {item.icon === "profile" ? (
              <ProfileNavAvatar avatarUrl={userAvatarUrl} fallbackInitial={userFallbackInitial} />
            ) : (
              <NavIcon name={item.icon} />
            )}
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
    return !isMobileShellViewport();
  });
  const [sidebarHover, setSidebarHover] = useState(false);
  const [sidebarLockedClosed, setSidebarLockedClosed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    return isMobileShellViewport();
  });
  const effectiveSidebarOpen = sidebarOpen || sidebarHover;
  const fitShellRef = useRef(null);
  const fitContentRef = useRef(null);
  const isAuthRoute = ["/login", "/register", "/verify"].includes(location.pathname);
  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";
  const isRider = user?.role === "rider";
  const userFallbackInitial = (user?.first_name?.trim()?.[0] || user?.email?.trim()?.[0] || "U").toUpperCase();

  useEffect(() => {
    if (isMobileShellViewport()) {
      setSidebarOpen(false);
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      const isMobile = isMobileShellViewport();
      setIsMobileViewport(isMobile);

      if (!isMobile) {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(false);
      }
    }

    handleResize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      document.body.classList.remove("app-authenticated");
      return;
    }

    document.body.classList.add("app-authenticated");
    return () => {
      document.body.classList.remove("app-authenticated");
    };
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    if (!isAuthenticated || isMobileViewport) {
      setFitScale(1);
      return;
    }

    let frame = null;
    let settleTimer = null;
    let settleTimerTwo = null;

    function measureAndScale() {
      const shellEl = fitShellRef.current;
      const contentEl = fitContentRef.current;
      if (!shellEl || !contentEl) {
        return;
      }

      if (shellEl.clientWidth <= 1120) {
        setFitScale(1);
        return;
      }

      // Measure natural height first, then apply scaling only when overflow would occur.
      contentEl.style.setProperty("--ops-fit-scale", "1");
      const availableHeight = shellEl.clientHeight;
      const availableWidth = shellEl.clientWidth;
      const requiredHeight = contentEl.scrollHeight;
      const requiredWidth = contentEl.scrollWidth;

      const heightScale = requiredHeight > 0 ? availableHeight / requiredHeight : 1;
      const widthScale = requiredWidth > 0 ? availableWidth / requiredWidth : 1;
      const nextScale = Math.min(1, Math.max(0.42, Math.min(heightScale, widthScale)));

      setFitScale(nextScale);
    }

    function scheduleMeasure() {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(measureAndScale);
    }

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasure();
    });

    if (fitShellRef.current) resizeObserver.observe(fitShellRef.current);
    if (fitContentRef.current) resizeObserver.observe(fitContentRef.current);

    const mutationObserver = new MutationObserver(() => {
      scheduleMeasure();
    });
    if (fitContentRef.current) {
      mutationObserver.observe(fitContentRef.current, { childList: true, subtree: true, characterData: true, attributes: true });
    }

    window.addEventListener("resize", scheduleMeasure);
    scheduleMeasure();

    // Re-measure shortly after route/content settles (images/map widgets/fonts).
    settleTimer = window.setTimeout(scheduleMeasure, 260);
    settleTimerTwo = window.setTimeout(scheduleMeasure, 850);
    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleMeasure).catch(() => {});
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (settleTimer) clearTimeout(settleTimer);
      if (settleTimerTwo) clearTimeout(settleTimerTwo);
      window.removeEventListener("resize", scheduleMeasure);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [isAuthenticated, isMobileViewport, location.pathname, effectiveSidebarOpen]);

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
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
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
        { label: "Profile", path: "/profile", icon: "profile" },
        { label: "Help", path: "/help", icon: "help" },
      ]
    : isRider
      ? [
          { label: "Dashboard", path: "/rider/dashboard", icon: "dashboard" },
          { label: "Work Board", path: "/rider/board", icon: "orders" },
          { label: "Delivery History", path: "/deliveries/history", icon: "create" },
          { label: "Route Map", path: "/map", icon: "help" },
          { label: "Profile", path: "/profile", icon: "profile" },
          { label: "Help", path: "/help", icon: "help" },
        ]
      : [
          { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
          { label: "Orders", path: "/orders", icon: "orders" },
          { label: "History", path: "/orders/history", icon: "create" },
          { label: "Profile", path: "/profile", icon: "profile" },
          { label: "Help", path: "/help", icon: "help" },
        ];
  const shellStateClass = isMobileViewport ? "sidebar-open" : effectiveSidebarOpen ? "sidebar-open" : "sidebar-collapsed";

  return (
    <div className={`${shellStyles.scope} ${opsSharedStyles.scope}`}>
      <div
        className={`role-shell ops-shell ${shellStateClass} ${isAdmin ? "admin-shell" : isRider ? "rider-shell" : "customer-shell"}`}
      >
        {!isMobileViewport ? (
          <RoleSidebar
            onMouseEnter={() => {
              if (!sidebarOpen && !sidebarLockedClosed) setSidebarHover(true);
            }}
            onMouseLeave={() => {
              setSidebarHover(false);
              setSidebarLockedClosed(false);
            }}
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
            userAvatarUrl={user?.avatar_url}
            userFallbackInitial={userFallbackInitial}
            onLogout={handleLogout}
            shellClass={isAdmin ? "admin" : isRider ? "rider" : "customer"}
          />
        ) : null}

        <main className={`role-main ops-main ${isAdmin ? "admin-main" : isRider ? "rider-main" : "customer-main"}`}>
          {!isMobileViewport ? (
            <button
              type="button"
              className="ops-shell-toggle"
              aria-label={effectiveSidebarOpen ? "Close menu" : "Open menu"}
              onClick={() => {
                if (effectiveSidebarOpen) {
                  setSidebarOpen(false);
                  setSidebarHover(false);
                  setSidebarLockedClosed(true);
                  return;
                }

                setSidebarOpen(true);
                setSidebarLockedClosed(false);
              }}
            >
              {effectiveSidebarOpen ? "×" : "☰"}
            </button>
          ) : (
            <button
              type="button"
              className="ops-mobile-menu-btn"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
          )}
          <div ref={fitShellRef} className="ops-fit-shell">
            <div ref={fitContentRef} className="ops-fit-content" style={{ "--ops-fit-scale": fitScale }}>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </div>
        </main>

        {isMobileViewport && mobileMenuOpen ? (
          <div className="ops-mobile-menu-layer" role="presentation">
            <button type="button" className="ops-mobile-menu-backdrop" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)} />
            <div className="ops-mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Navigation menu">
              <div className="ops-mobile-menu-head">
                <strong>Menu</strong>
                <button type="button" className="ops-mobile-menu-close" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>×</button>
              </div>
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
                userAvatarUrl={user?.avatar_url}
                userFallbackInitial={userFallbackInitial}
                onLogout={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                onNavigate={() => setMobileMenuOpen(false)}
                shellClass={isAdmin ? "admin" : isRider ? "rider" : "customer"}
                mobile
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
