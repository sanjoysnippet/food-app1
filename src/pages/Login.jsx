import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await fetch(
        "http://127.0.0.1:5000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("Backend response:", data);

      if (response.ok && data.success) {
        /* =========================================
           SAVE JWT TOKEN
        ========================================= */

        if (data.token) {
          localStorage.setItem(
            "foodExpressToken",
            data.token
          );

          console.log("JWT token saved successfully.");
        }

        /* =========================================
           SAVE LOGIN STATUS
        ========================================= */

        localStorage.setItem(
          "foodExpressLoggedIn",
          "true"
        );

        /* =========================================
           SAVE CURRENT USER
        ========================================= */

        localStorage.setItem(
          "foodExpressCurrentUser",
          JSON.stringify(data.user)
        );

        console.log("User saved:", data.user);

        alert(
          `Welcome back, ${data.user.name}! 🎉`
        );

        navigate("/");
      } else {
        alert(
          data.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        "Backend connection error:\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">
          🔐
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your FoodExpress account
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "⏳ Logging in..."
              : "🔐 Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}

          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;