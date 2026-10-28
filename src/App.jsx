
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// ==================== PAGES ====================
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";

// ==================== COMPONENTS ====================
import Navbar from "./components/Navbar";

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("foodExpressToken");
  const savedUser = localStorage.getItem("foodExpressCurrentUser");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (!user || !user.email) {
      localStorage.removeItem("foodExpressToken");
      localStorage.removeItem("foodExpressCurrentUser");
      localStorage.removeItem("foodExpressLoggedIn");

      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("User data error:", error);

    localStorage.removeItem("foodExpressToken");
    localStorage.removeItem("foodExpressCurrentUser");
    localStorage.removeItem("foodExpressLoggedIn");

    return <Navigate to="/login" replace />;
  }

  return children;
}

// ==================== MAIN APP ====================
function App() {
  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("foodExpressCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("foodExpressCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart saving error:", error);
    }
  }, [cart]);

  // Add food to cart
  const addToCart = (food) => {
    setCart((previousCart) => {
      const existingFood = previousCart.find(
        (item) => item.id === food.id
      );

      if (existingFood) {
        return previousCart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [...previousCart, { ...food, quantity: 1 }];
    });
  };

  // Remove food
  const removeFromCart = (foodId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== foodId)
    );
  };

  // Increase quantity
  const increaseQuantity = (foodId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (foodId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity: (item.quantity || 1) - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("foodExpressCart");
  };

  // Total cart items
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home addToCart={addToCart} />}
        />

        {/* Restaurant */}
        <Route
          path="/restaurant"
          element={<Restaurant addToCart={addToCart} />}
        />

        <Route
          path="/restaurant/:id"
          element={<Restaurant addToCart={addToCart} />}
        />

        {/* Food Details */}
        <Route
          path="/food-details"
          element={<FoodDetails addToCart={addToCart} />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              clearCart={clearCart}
            />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout
                cart={cart}
                clearCart={clearCart}
              />
            </ProtectedRoute>
          }
        />

        {/* My Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminOrders />
    </ProtectedRoute>
  }
/>

        {/* Page Not Found */}
        <Route
          path="*"
          element={
            <div className="not-found-page">
              <div className="not-found-content">
                <div className="not-found-number">
                  404
                </div>

                <h1>Page Not Found 😟</h1>

                <p>
                  The page you are looking for does not exist.
                </p>

                <a
                  href="/"
                  className="not-found-button"
                >
                  🏠 Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
