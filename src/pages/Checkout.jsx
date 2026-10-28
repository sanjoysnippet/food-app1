import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart = [], clearCart }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  /* =====================================================
     GET LOGGED-IN USER
  ===================================================== */

  useEffect(() => {
    try {
      const token =
        localStorage.getItem(
          "foodExpressToken"
        );

      const savedUser =
        localStorage.getItem(
          "foodExpressCurrentUser"
        );

      /* ---------------------------------------------
         TOKEN CHECK
      --------------------------------------------- */

      if (!token || !savedUser) {
        alert(
          "Please login before checkout."
        );

        navigate("/login");
        return;
      }

      /* ---------------------------------------------
         USER DATA
      --------------------------------------------- */

      const parsedUser =
        JSON.parse(savedUser);

      if (
        !parsedUser ||
        !parsedUser.email
      ) {
        localStorage.removeItem(
          "foodExpressToken"
        );

        localStorage.removeItem(
          "foodExpressCurrentUser"
        );

        localStorage.removeItem(
          "foodExpressLoggedIn"
        );

        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error(
        "USER LOAD ERROR:",
        error
      );

      localStorage.removeItem(
        "foodExpressToken"
      );

      localStorage.removeItem(
        "foodExpressCurrentUser"
      );

      localStorage.removeItem(
        "foodExpressLoggedIn"
      );

      navigate("/login");
    }
  }, [navigate]);

  /* =====================================================
     CALCULATE TOTAL
  ===================================================== */

  const total = cart.reduce(
    (sum, item) => {
      const price =
        Number(item.price) || 0;

      const quantity =
        Number(item.quantity) || 1;

      return (
        sum +
        price * quantity
      );
    },
    0
  );

  /* =====================================================
     HANDLE PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    /* ---------------------------------------------
       CHECK LOGIN
    --------------------------------------------- */

    const token =
      localStorage.getItem(
        "foodExpressToken"
      );

    if (!token) {
      alert(
        "Your login session is missing. Please login again."
      );

      navigate("/login");
      return;
    }

    /* ---------------------------------------------
       CHECK CART
    --------------------------------------------- */

    if (
      !cart ||
      cart.length === 0
    ) {
      alert(
        "Your cart is empty."
      );

      navigate("/cart");
      return;
    }

    /* ---------------------------------------------
       CHECK ADDRESS
    --------------------------------------------- */

    if (!address.trim()) {
      alert(
        "Please enter your delivery address."
      );
      return;
    }

    /* ---------------------------------------------
       CHECK CITY
    --------------------------------------------- */

    if (!city.trim()) {
      alert(
        "Please enter your city."
      );
      return;
    }

    /* ---------------------------------------------
       CHECK PIN CODE
    --------------------------------------------- */

    if (!pinCode.trim()) {
      alert(
        "Please enter your PIN code."
      );
      return;
    }

    if (
      !/^\d{6}$/.test(
        pinCode.trim()
      )
    ) {
      alert(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "========== PLACING ORDER =========="
      );

      console.log(
        "JWT token found."
      );

      /* ---------------------------------------------
         SEND ORDER TO BACKEND
         
         IMPORTANT:
         userId
         userName
         userEmail

         ARE NOT SENT.

         BACKEND JWT THEKE USER INFORMATION NEBE.
      --------------------------------------------- */

      const response =
        await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              items: cart,

              address:
                address.trim(),

              city:
                city.trim(),

              pinCode:
                pinCode.trim(),

              paymentMethod:
                paymentMethod,

              total:
                total,
            }),
          }
        );

      console.log(
        "Order response status:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "Order response:",
        data
      );

      /* ---------------------------------------------
         TOKEN EXPIRED / INVALID
      --------------------------------------------- */

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "foodExpressToken"
        );

        localStorage.removeItem(
          "foodExpressLoggedIn"
        );

        localStorage.removeItem(
          "foodExpressCurrentUser"
        );

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      /* ---------------------------------------------
         OTHER ERROR
      --------------------------------------------- */

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Order placement failed."
        );
      }

      /* ---------------------------------------------
         ORDER SUCCESS
      --------------------------------------------- */

      console.log(
        "ORDER PLACED SUCCESSFULLY"
      );

      alert(
        "🎉 Order placed successfully!"
      );

      /* ---------------------------------------------
         CLEAR CART
      --------------------------------------------- */

      if (
        typeof clearCart ===
        "function"
      ) {
        clearCart();
      } else {
        localStorage.removeItem(
          "foodExpressCart"
        );
      }

      /* ---------------------------------------------
         GO TO MY ORDERS
      --------------------------------------------- */

      navigate("/orders");
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    !cart ||
    cart.length === 0
  ) {
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              🛒
            </div>

            <h2>
              Your Cart is Empty
            </h2>

            <p>
              Please add some food before
              going to checkout.
            </p>

            <button
              type="button"
              className="place-order-button"
              onClick={() =>
                navigate("/")
              }
            >
              🍔 Order Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN CHECKOUT UI
  ===================================================== */

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ===============================================
            PAGE HEADER
        =============================================== */}

        <div className="checkout-header">
          <h1>
            🛒 Checkout
          </h1>

          <p>
            Complete your order and
            enjoy your food!
          </p>
        </div>

        <div className="checkout-grid">

          {/* =============================================
              LEFT SIDE
          ============================================= */}

          <div className="checkout-left">

            {/* ===========================================
                USER INFORMATION
            =========================================== */}

            <div className="checkout-card">

              <div className="checkout-card-title">
                <span>
                  👤
                </span>

                <div>
                  <h2>
                    Customer Information
                  </h2>

                  <p>
                    Your account details
                  </p>
                </div>
              </div>

              <div className="customer-info">

                <div className="checkout-field">
                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    value={
                      user?.name || ""
                    }
                    readOnly
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      user?.email || ""
                    }
                    readOnly
                  />
                </div>

              </div>
            </div>

            {/* ===========================================
                DELIVERY DETAILS
            =========================================== */}

            <div className="checkout-card">

              <div className="checkout-card-title">
                <span>
                  📍
                </span>

                <div>
                  <h2>
                    Delivery Details
                  </h2>

                  <p>
                    Where should we deliver
                    your food?
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handlePlaceOrder
                }
              >

                <div className="checkout-field">
                  <label>
                    Full Address
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter your complete delivery address"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="checkout-row">

                  <div className="checkout-field">
                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) =>
                        setCity(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label>
                      PIN Code
                    </label>

                    <input
                      type="text"
                      placeholder="6-digit PIN"
                      value={pinCode}
                      maxLength="6"
                      inputMode="numeric"
                      onChange={(e) =>
                        setPinCode(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      required
                    />
                  </div>

                </div>

                {/* =======================================
                    PAYMENT METHOD
                ======================================= */}

                <div className="payment-section">

                  <div className="checkout-card-title">
                    <span>
                      💳
                    </span>

                    <div>
                      <h2>
                        Payment Method
                      </h2>

                      <p>
                        Choose your preferred
                        payment method
                      </p>
                    </div>
                  </div>

                  <div className="payment-options">

                    <label
                      className={`payment-option ${
                        paymentMethod ===
                        "Cash on Delivery"
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={
                          paymentMethod ===
                          "Cash on Delivery"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                      />

                      <div>
                        <strong>
                          💵 Cash on Delivery
                        </strong>

                        <span>
                          Pay when your order
                          arrives
                        </span>
                      </div>
                    </label>

                    <label
                      className={`payment-option ${
                        paymentMethod ===
                        "Online Payment"
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Payment"
                        checked={
                          paymentMethod ===
                          "Online Payment"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                      />

                      <div>
                        <strong>
                          💳 Online Payment
                        </strong>

                        <span>
                          Pay securely online
                        </span>
                      </div>
                    </label>

                  </div>
                </div>

                {/* =======================================
                    PLACE ORDER BUTTON
                ======================================= */}

                <button
                  type="submit"
                  className="place-order-button"
                  disabled={loading}
                >
                  {loading
                    ? "⏳ Placing Order..."
                    : `🚀 Place Order • ₹${total}`}
                </button>

              </form>
            </div>
          </div>

          {/* =============================================
              RIGHT SIDE - ORDER SUMMARY
          ============================================= */}

          <div className="checkout-right">

            <div className="checkout-card order-summary-card">

              <div className="checkout-card-title">
                <span>
                  🧾
                </span>

                <div>
                  <h2>
                    Order Summary
                  </h2>

                  <p>
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "item"
                      : "items"}{" "}
                    in your order
                  </p>
                </div>
              </div>

              {/* =========================================
                  CART ITEMS
              ========================================= */}

              <div className="checkout-items">

                {cart.map(
                  (
                    item,
                    index
                  ) => {

                    const price =
                      Number(
                        item.price
                      ) || 0;

                    const quantity =
                      Number(
                        item.quantity
                      ) || 1;

                    return (
                      <div
                        className="checkout-item"
                        key={
                          item.id ||
                          index
                        }
                      >

                        <div className="checkout-item-image">

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name ||
                                "Food"
                              }
                            />
                          ) : (
                            <div className="checkout-image-placeholder">
                              🍔
                            </div>
                          )}

                        </div>

                        <div className="checkout-item-info">

                          <h3>
                            {item.name ||
                              "Food Item"}
                          </h3>

                          <p>
                            ₹
                            {price.toFixed(
                              0
                            )}{" "}
                            ×{" "}
                            {quantity}
                          </p>

                        </div>

                        <strong>
                          ₹
                          {(
                            price *
                            quantity
                          ).toFixed(
                            0
                          )}
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

              {/* =========================================
                  TOTAL
              ========================================= */}

              <div className="checkout-total-section">

                <div className="checkout-total-row">
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {total.toFixed(
                      0
                    )}
                  </strong>
                </div>

                <div className="checkout-total-row">
                  <span>
                    Delivery Fee
                  </span>

                  <strong>
                    Free
                  </strong>
                </div>

                <div className="checkout-divider"></div>

                <div className="checkout-total-row final-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {total.toFixed(
                      0
                    )}
                  </strong>
                </div>

              </div>

              {/* =========================================
                  SECURITY MESSAGE
              ========================================= */}

              <div className="checkout-security">
                🔒 Your order is securely
                connected to your account.
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;