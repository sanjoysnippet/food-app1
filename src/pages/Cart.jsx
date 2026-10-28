import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Cart({
  cart = [],
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
}) {
  const navigate = useNavigate();

  /* =====================================================
     TOTALS
  ===================================================== */

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const deliveryFee = subtotal > 0 ? 0 : 0;

  const total = subtotal + deliveryFee;

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">

          <div className="empty-cart-card">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h1>
              Your Cart is Empty
            </h1>

            <p>
              Looks like you haven't added anything
              to your cart yet.
            </p>

            <button
              type="button"
              className="continue-shopping-button"
              onClick={() => navigate("/")}
            >
              🍽️ Browse Food
            </button>

          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     CHECKOUT
  ===================================================== */

  const handleCheckout = () => {
    navigate("/checkout");
  };

  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";
  };

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="cart-page-header">

          <div>

            <span className="cart-small-title">
              YOUR ORDER
            </span>

            <h1>
              🛒 Your Cart
            </h1>

            <p>
              Review your items before checkout.
            </p>

          </div>

          <button
            type="button"
            className="cart-back-button"
            onClick={() => navigate(-1)}
          >
            ← Continue Shopping
          </button>

        </div>

        {/* =================================================
            MAIN CART LAYOUT
        ================================================= */}

        <div className="cart-layout">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <section className="cart-items-card">

            <div className="cart-items-header">

              <div>
                <span className="items-title-icon">
                  🍔
                </span>

                <h2>
                  Your Items
                </h2>
              </div>

              <span className="cart-item-count">
                {cart.length}{" "}
                {cart.length === 1
                  ? "Item"
                  : "Items"}
              </span>

            </div>

            <div className="cart-items-list">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="cart-item"
                >

                  {/* IMAGE */}

                  <div className="cart-item-image-box">

                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImageError}
                    />

                  </div>

                  {/* INFO */}

                  <div className="cart-item-details">

                    <span className="cart-item-category">
                      {item.category || "Food"}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.description ||
                        "Delicious food prepared with fresh ingredients."}
                    </p>

                    <div className="cart-item-info">

                      <span>
                        🕒 {item.time || "25–35 min"}
                      </span>

                      <span>
                        🚴 Free Delivery
                      </span>

                    </div>

                    <div className="cart-item-price">
                      ₹{item.price}
                    </div>

                  </div>

                  {/* QUANTITY + REMOVE */}

                  <div className="cart-item-actions">

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>

                    </div>

                    <div className="cart-item-total">
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      ).toFixed(0)}
                    </div>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      🗑️ Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* CLEAR CART */}

            <div className="clear-cart-row">

              <button
                type="button"
                className="clear-cart-button"
                onClick={clearCart}
              >
                🗑️ Clear Cart
              </button>

            </div>

          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="cart-summary-card">

            <div className="summary-top">

              <span className="summary-label">
                ORDER SUMMARY
              </span>

              <h2>
                Your Bill
              </h2>

            </div>

            <div className="summary-lines">

              <div>
                <span>
                  Items
                </span>

                <strong>
                  {cart.reduce(
                    (total, item) =>
                      total +
                      Number(item.quantity || 1),
                    0
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{subtotal.toFixed(0)}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <strong className="free-text">
                  FREE
                </strong>
              </div>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(0)}
              </strong>

            </div>

            <div className="cart-free-delivery">
              🚴 Free delivery on your order
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

            <button
              type="button"
              className="summary-shopping-button"
              onClick={() => navigate("/")}
            >
              + Add More Food
            </button>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default Cart;