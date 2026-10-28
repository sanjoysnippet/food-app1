import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     TRACKING STEPS
  ===================================================== */

  const trackingSteps = [
    {
      status: "Placed",
      icon: "📝",
      title: "Order Placed",
      description: "Your order has been received.",
    },
    {
      status: "Confirmed",
      icon: "✅",
      title: "Order Confirmed",
      description: "Restaurant has confirmed your order.",
    },
    {
      status: "Preparing",
      icon: "👨‍🍳",
      title: "Preparing",
      description: "Your food is being prepared.",
    },
    {
      status: "Out for Delivery",
      icon: "🛵",
      title: "Out for Delivery",
      description: "Your order is on the way.",
    },
    {
      status: "Delivered",
      icon: "🎉",
      title: "Delivered",
      description: "Your order has been delivered.",
    },
  ];

  /* =====================================================
     ESTIMATED DELIVERY TIME
  ===================================================== */

  const deliveryTime = {
    Placed: "30–40 min",
    Confirmed: "25–35 min",
    Preparing: "20–30 min",
    "Out for Delivery": "10–15 min",
    Delivered: "Delivered Successfully",
    Cancelled: "Order Cancelled",
  };

  /* =====================================================
     GET CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    try {
      const savedUser = localStorage.getItem(
        "foodExpressCurrentUser"
      );

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  const fetchOrders = async () => {
    try {
      setError("");

      const currentUser = getCurrentUser();

      if (!currentUser || !currentUser.email) {
        setError("Please login to see your orders.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(
        "foodExpressToken"
      );

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const email = currentUser.email
        .toLowerCase()
        .trim();

      const apiUrl =
        `http://localhost:5000/api/orders/user/${encodeURIComponent(
          email
        )}`;

      const response = await fetch(apiUrl, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      /* =================================================
         TOKEN EXPIRED
      ================================================= */

      if (response.status === 401) {
        localStorage.removeItem(
          "foodExpressToken"
        );

        localStorage.removeItem(
          "foodExpressLoggedIn"
        );

        localStorage.removeItem(
          "foodExpressCurrentUser"
        );

        setError(
          "Your login session has expired. Please login again."
        );

        setLoading(false);
        return;
      }

      /* =================================================
         API ERROR
      ================================================= */

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load orders."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Could not load orders."
        );
      }

      /* =================================================
         SAVE ORDERS
      ================================================= */

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Orders Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     AUTO REFRESH EVERY 5 SECONDS
  ===================================================== */

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     CANCEL ORDER
  ===================================================== */

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = localStorage.getItem(
        "foodExpressToken"
      );

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      /* =================================================
         IMPORTANT CANCEL API
      ================================================= */

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "CANCEL RESPONSE:",
        response.status,
        data
      );

      /* =================================================
         TOKEN EXPIRED
      ================================================= */

      if (response.status === 401) {
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
          "Your login session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      /* =================================================
         API ERROR
      ================================================= */

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to cancel order. Server returned ${response.status}.`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Could not cancel order."
        );
      }

      /* =================================================
         UPDATE ORDER IMMEDIATELY
      ================================================= */

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,

                status: "Cancelled",

                statusHistory:
                  Array.isArray(
                    order.statusHistory
                  )
                    ? [
                        ...order.statusHistory,
                        {
                          status: "Cancelled",
                          updatedAt:
                            new Date().toISOString(),
                        },
                      ]
                    : [
                        {
                          status: "Cancelled",
                          updatedAt:
                            new Date().toISOString(),
                        },
                      ],
              }
            : order
        )
      );

      alert(
        "Order cancelled successfully! ❌"
      );

      /* =================================================
         GET LATEST DATA FROM SERVER
      ================================================= */

      await fetchOrders();
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error
      );

      alert(
        error.message ||
          "Unable to cancel order."
      );
    }
  };

  /* =====================================================
     DELETE ORDER
  ===================================================== */

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem(
        "foodExpressToken"
      );

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      /* =================================================
         TOKEN EXPIRED
      ================================================= */

      if (response.status === 401) {
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
          "Your login session has expired."
        );

        navigate("/login");
        return;
      }

      /* =================================================
         DELETE ERROR
      ================================================= */

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete order."
        );
      }

      /* =================================================
         REMOVE FROM SCREEN
      ================================================= */

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) =>
            order._id !== orderId
        )
      );

      alert(
        "Order deleted successfully! 🗑️"
      );
    } catch (error) {
      console.error(
        "Delete Order Error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete order."
      );
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  /* =====================================================
     GET CURRENT STEP
  ===================================================== */

  const getCurrentStep = (status) => {
    const index =
      trackingSteps.findIndex(
        (step) =>
          step.status === status
      );

    return index >= 0 ? index : 0;
  };

  /* =====================================================
     CHECK STEP COMPLETED
  ===================================================== */

  const isStepCompleted = (
    status,
    currentStatus
  ) => {
    const stepIndex =
      getCurrentStep(status);

    const currentIndex =
      getCurrentStep(
        currentStatus
      );

    return (
      stepIndex <= currentIndex
    );
  };

  /* =====================================================
     GET STATUS DATE
  ===================================================== */

  const getStatusDate = (
    order,
    status
  ) => {
    if (
      Array.isArray(
        order.statusHistory
      )
    ) {
      const history =
        order.statusHistory.find(
          (item) =>
            item.status === status
        );

      if (
        history &&
        history.updatedAt
      ) {
        return formatDate(
          history.updatedAt
        );
      }
    }

    if (
      status === order.status
    ) {
      return formatDate(
        order.updatedAt ||
          order.createdAt
      );
    }

    return "";
  };

  /* =====================================================
     IMAGE ERROR
  ===================================================== */

  const handleImageError = (e) => {
    e.currentTarget.style.display =
      "none";
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-icon">
            ⏳
          </div>

          <h2>
            Loading your orders...
          </h2>

          <p>
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="empty-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Orders
          </h2>

          <p>{error}</p>

          <div className="orders-button-row">
            <button
              type="button"
              onClick={fetchOrders}
              className="orders-action-button"
            >
              🔄 Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="orders-action-button secondary"
            >
              🔐 Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     NO ORDERS
  ===================================================== */

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>📦 My Orders</h1>

          <p>
            Track your food orders here.
          </p>
        </div>

        <div className="orders-empty">
          <div className="empty-icon">
            🛒
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            type="button"
            className="orders-action-button"
            onClick={() =>
              navigate("/")
            }
          >
            🍔 Order Food
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="orders-page">

      {/* HEADER */}

      <div className="orders-header">
        <h1>📦 My Orders</h1>

        <p>
          Welcome back! Track your orders
          in real time.
        </p>
      </div>

      {/* ORDER LIST */}

      <div className="orders-container">

        {orders.map((order) => {
          const currentStatus =
            order.status || "Placed";

          const isCancelled =
            currentStatus ===
            "Cancelled";

          const currentStep =
            getCurrentStep(
              currentStatus
            );

          return (
            <div
              className="order-card"
              key={order._id}
            >

              {/* =====================================
                  ORDER HEADER
              ===================================== */}

              <div className="order-card-header">

                <div>
                  <h2>
                    Order #

                    {order._id
                      ? order._id
                          .slice(-6)
                          .toUpperCase()
                      : "N/A"}
                  </h2>

                  <p>
                    {formatDate(
                      order.createdAt
                    )}
                  </p>
                </div>

                <span
                  className={`order-status ${
                    isCancelled
                      ? "cancelled-status"
                      : ""
                  }`}
                >
                  {currentStatus}
                </span>

              </div>

              {/* =====================================
                  CANCELLED BOX
              ===================================== */}

              {isCancelled && (
                <div className="cancelled-order-box">

                  <div className="cancelled-order-icon">
                    ❌
                  </div>

                  <div>
                    <strong>
                      Order Cancelled
                    </strong>

                    <p>
                      This order has been
                      cancelled successfully.
                    </p>

                    <small>
                      Cancelled on{" "}
                      {getStatusDate(
                        order,
                        "Cancelled"
                      )}
                    </small>
                  </div>

                </div>
              )}

              {/* =====================================
                  TRACKING
              ===================================== */}

              {!isCancelled && (
                <div className="order-tracking">

                  <div className="tracking-heading">

                    <div>
                      <h3>
                        🚚 Track Your Order
                      </h3>

                      <p>
                        {currentStatus ===
                        "Delivered"
                          ? "Your order has been delivered successfully."
                          : `Current status: ${currentStatus}`}
                      </p>
                    </div>

                    <span className="tracking-progress-text">
                      {currentStep + 1} /{" "}
                      {trackingSteps.length}
                    </span>

                  </div>

                  <div className="tracking-line">

                    {trackingSteps.map(
                      (
                        step,
                        index
                      ) => {
                        const completed =
                          isStepCompleted(
                            step.status,
                            currentStatus
                          );

                        const active =
                          index ===
                          currentStep;

                        return (
                          <React.Fragment
                            key={
                              step.status
                            }
                          >

                            <div
                              className={`tracking-step ${
                                completed
                                  ? "completed"
                                  : ""
                              } ${
                                active
                                  ? "active"
                                  : ""
                              }`}
                            >

                              <div className="tracking-icon">
                                {completed
                                  ? "✓"
                                  : step.icon}
                              </div>

                              <div className="tracking-info">

                                <strong>
                                  {
                                    step.title
                                  }
                                </strong>

                                <span>
                                  {
                                    step.description
                                  }
                                </span>

                                {completed && (
                                  <small>
                                    {getStatusDate(
                                      order,
                                      step.status
                                    )}
                                  </small>
                                )}

                              </div>

                            </div>

                            {index <
                              trackingSteps.length -
                                1 && (
                              <div
                                className={`tracking-connector ${
                                  index <
                                  currentStep
                                    ? "filled"
                                    : ""
                                }`}
                              />
                            )}

                          </React.Fragment>
                        );
                      }
                    )}

                  </div>
                </div>
              )}

              {/* =====================================
                  ESTIMATED DELIVERY
              ===================================== */}

              <div className="estimated-delivery">

                <div className="estimated-icon">
                  ⏱️
                </div>

                <div className="estimated-info">

                  <span>
                    Estimated Delivery
                  </span>

                  <strong>
                    {deliveryTime[
                      currentStatus
                    ] ||
                      "30–40 min"}
                  </strong>

                </div>

              </div>

              {/* =====================================
                  ORDER ITEMS
              ===================================== */}

              <div className="order-items">

                <div className="section-title">
                  🍔 Ordered Items
                </div>

                {Array.isArray(
                  order.items
                ) &&
                  order.items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="order-item"
                        key={
                          item.id
                            ? `${item.id}-${index}`
                            : `${
                                item._id ||
                                "item"
                              }-${index}`
                        }
                      >

                        <div className="order-item-image">

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name ||
                                "Food"
                              }
                              onError={
                                handleImageError
                              }
                            />
                          ) : (
                            <span>
                              🍔
                            </span>
                          )}

                        </div>

                        <div className="order-item-info">

                          <h3>
                            {item.name ||
                              "Food Item"}
                          </h3>

                          <p>
                            ₹
                            {Number(
                              item.price ||
                                0
                            )}{" "}
                            ×{" "}
                            {Number(
                              item.quantity ||
                                1
                            )}
                          </p>

                        </div>

                        <strong className="order-item-total">
                          ₹
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                1
                            )
                          ).toFixed(0)}
                        </strong>

                      </div>
                    )
                  )}

              </div>

              {/* =====================================
                  DELIVERY INFORMATION
              ===================================== */}

              <div className="order-info-grid">

                <div className="order-address">

                  <h3>
                    📍 Delivery Address
                  </h3>

                  <p>
                    {order.address ||
                      "Address not available"}
                  </p>

                  {order.city && (
                    <p>
                      {order.city}

                      {order.pinCode
                        ? ` - ${order.pinCode}`
                        : ""}
                    </p>
                  )}

                </div>

                <div className="order-customer">

                  <h3>
                    👤 Customer
                  </h3>

                  <p>
                    {order.userName ||
                      "Customer"}
                  </p>

                  <p>
                    {order.userEmail ||
                      ""}
                  </p>

                </div>

              </div>

              {/* =====================================
                  ORDER FOOTER
              ===================================== */}

              <div className="order-footer">

                <div>
                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod ||
                      "Cash on Delivery"}
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {currentStatus}
                  </strong>
                </div>

                <div>
                  <span>
                    Total
                  </span>

                  <strong className="order-total">
                    ₹
                    {Number(
                      order.total || 0
                    ).toFixed(0)}
                  </strong>
                </div>

              </div>

              {/* =====================================
                  ACTION BUTTONS
              ===================================== */}

              <div className="order-actions">

                {/* CANCEL */}

                {!isCancelled &&
                  (
                    currentStatus ===
                      "Placed" ||
                    currentStatus ===
                      "Confirmed"
                  ) && (
                    <button
                      type="button"
                      className="cancel-order-button"
                      onClick={() =>
                        handleCancelOrder(
                          order._id
                        )
                      }
                    >
                      ❌ Cancel Order
                    </button>
                  )}

                {/* DELETE */}

                <button
                  type="button"
                  className="delete-order-button"
                  onClick={() =>
                    handleDeleteOrder(
                      order._id
                    )
                  }
                >
                  🗑️ Delete Order
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Orders;