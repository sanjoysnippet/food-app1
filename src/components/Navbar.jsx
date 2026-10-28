import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get current logged-in user
  const savedUser = localStorage.getItem(
    "foodExpressCurrentUser"
  );

  // Check login status
  const isLoggedIn =
    localStorage.getItem(
      "foodExpressLoggedIn"
    ) === "true";

  // Convert saved user into object
  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch (error) {
    console.error("User data error:", error);
    user = null;
  }

  // Close mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Check active page
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem(
      "foodExpressLoggedIn"
    );

    localStorage.removeItem(
      "foodExpressCurrentUser"
    );

    closeMenu();

    alert("Logged out successfully! 👋");

    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        🍔 Food<span>Express</span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="menu-button"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Navigation */}
      <div
        className={
          menuOpen
            ? "nav-links mobile-open"
            : "nav-links"
        }
      >

        {/* Home */}
        <Link
          to="/"
          className={
            isActive("/")
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          🏠 Home
        </Link>

        {/* Orders */}
        <Link
          to="/orders"
          className={
            isActive("/orders")
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          📦 Orders
        </Link>

        {/* Login / User */}
        {isLoggedIn && user ? (
          <>
            {/* User Name */}
            <span className="user-name">
              👤 {user.name}
            </span>

            {/* Logout */}
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <Link
              to="/login"
              className={
                isActive("/login")
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={closeMenu}
            >
              🔐 Login
            </Link>

            {/* Signup */}
            <Link
              to="/signup"
              className={
                isActive("/signup")
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={closeMenu}
            >
              📝 Signup
            </Link>
          </>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          className={
            isActive("/cart")
              ? "cart-link active"
              : "cart-link"
          }
          onClick={closeMenu}
        >
          🛒 Cart

          <span className="cart-badge">
            {cartCount}
          </span>
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;