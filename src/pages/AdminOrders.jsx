import React, {
  useEffect,
  useState,
} from "react";

function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState("");

  /* =====================================================
     STATUS OPTIONS
  ===================================================== */

  const statusOptions = [
    "Placed",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "http://localhost:5000/api/orders"
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(
          data.orders
        )
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Admin Orders Error:",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(
        orderId
      );

      const response =
        await fetch(
          `http://localhost:5000/api/orders/${orderId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Status update failed."
        );
      }

      setOrders(
        (previousOrders) =>
          previousOrders.map(
            (order) =>
              order._id ===
              orderId
                ? data.order
                : order
          )
      );

      alert(
        `Order status changed to "${status}" 🚚`
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Status update failed."
      );
    } finally {
      setUpdatingId("");
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /* =====================================================
     GET STATUS CLASS
  ===================================================== */

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "Placed":
        return "status-placed";

      case "Confirmed":
        return "status-confirmed";

      case "Preparing":
        return "status-preparing";

      case "Out for Delivery":
        return "status-delivery";

      case "Delivered":
        return "status-delivered";

      default:
        return "";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-loading">
          <div>
            ⏳
          </div>

          <h2>
            Loading Orders...
          </h2>

          <p>
            Please wait.
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
      <div className="admin-orders-page">
        <div className="admin-error">
          <div>
            ⚠️
          </div>

          <h2>
            Unable to Load Orders
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchOrders
            }
            className="admin-refresh-button"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="admin-orders-page">

      {/* HEADER */}

      <div className="admin-orders-header">

        <div>
          <span className="admin-badge">
            ADMIN PANEL
          </span>

          <h1>
            👨‍💻 Manage Orders
          </h1>

          <p>
            Update order status and
            manage customer deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={
            fetchOrders
          }
          className="admin-refresh-button"
        >
          🔄 Refresh
        </button>

      </div>

      {/* STATS */}

      <div className="admin-order-stats">

        <div className="admin-stat-card">
          <span>
            📦
          </span>

          <div>
            <small>
              Total Orders
            </small>

            <strong>
              {orders.length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <span>
            🟡
          </span>

          <div>
            <small>
              Active Orders
            </small>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status !==
                    "Delivered"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <span>
            🎉
          </span>

          <div>
            <small>
              Delivered
            </small>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Delivered"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* NO ORDERS */}

      {orders.length === 0 ? (
        <div className="admin-no-orders">
          <div>
            📦
          </div>

          <h2>
            No Orders Found
          </h2>

          <p>
            There are currently no
            customer orders.
          </p>
        </div>
      ) : (

        <div className="admin-orders-container">

          {orders.map(
            (order) => (
              <div
                className="admin-order-card"
                key={
                  order._id
                }
              >

                {/* ORDER HEADER */}

                <div className="admin-order-header">

                  <div>
                    <span className="admin-order-label">
                      ORDER
                    </span>

                    <h2>
                      #
                      {order._id
                        ? order._id
                            .slice(
                              -6
                            )
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
                    className={`admin-current-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status ||
                      "Placed"}
                  </span>

                </div>

                {/* CUSTOMER */}

                <div className="admin-section">

                  <h3>
                    👤 Customer
                  </h3>

                  <div className="admin-customer-grid">

                    <div>
                      <span>
                        Name
                      </span>

                      <strong>
                        {order.userName ||
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {order.userEmail ||
                          "Not available"}
                      </strong>
                    </div>

                  </div>
                </div>

                {/* ITEMS */}

                <div className="admin-section">

                  <h3>
                    🍔 Ordered Items
                  </h3>

                  <div className="admin-items-list">

                    {Array.isArray(
                      order.items
                    ) &&
                      order.items.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            className="admin-order-item"
                            key={
                              index
                            }
                          >

                            <div className="admin-food-icon">
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
                                "🍔"
                              )}
                            </div>

                            <div className="admin-item-info">
                              <strong>
                                {item.name ||
                                  "Food Item"}
                              </strong>

                              <span>
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
                              </span>
                            </div>

                            <strong>
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
                              ).toFixed(
                                0
                              )}
                            </strong>

                          </div>
                        )
                      )}

                  </div>
                </div>

                {/* ADDRESS */}

                <div className="admin-section">

                  <h3>
                    📍 Delivery Address
                  </h3>

                  <div className="admin-address-box">

                    <strong>
                      {order.address ||
                        "Address not available"}
                    </strong>

                    <span>
                      {order.city ||
                        ""}

                      {order.pinCode
                        ? ` - ${order.pinCode}`
                        : ""}
                    </span>

                  </div>

                </div>

                {/* TRACKING STATUS */}

                <div className="admin-section admin-tracking-section">

                  <h3>
                    🚚 Update Delivery Status
                  </h3>

                  <div className="admin-status-flow">

                    {statusOptions.map(
                      (
                        status,
                        index
                      ) => (
                        <button
                          type="button"
                          key={
                            status
                          }
                          disabled={
                            updatingId ===
                            order._id
                          }
                          className={`admin-status-option ${
                            order.status ===
                            status
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            updateStatus(
                              order._id,
                              status
                            )
                          }
                        >
                          <span>
                            {index ===
                            0
                              ? "📝"
                              : index ===
                                1
                              ? "✅"
                              : index ===
                                2
                              ? "👨‍🍳"
                              : index ===
                                3
                              ? "🛵"
                              : "🎉"}
                          </span>

                          {status}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* FOOTER */}

                <div className="admin-order-footer">

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
                      Total Amount
                    </span>

                    <strong className="admin-total">
                      ₹
                      {Number(
                        order.total ||
                          0
                      ).toFixed(
                        0
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;