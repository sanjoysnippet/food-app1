import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const app = express();
const PORT = process.env.PORT || 5000;

// Learning project configuration.
// For deployment, store these values in environment variables.
const JWT_SECRET =
  process.env.JWT_SECRET || "foodexpress_secret_key_2026";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodexpress";

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url}`);
  next();
});

/* =====================================================
   USER SCHEMA
===================================================== */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Normal users are users by default.
    // Admin role must be assigned securely by the database owner.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =====================================================
   ORDER SCHEMA
===================================================== */

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
    },

    userName: {
      type: String,
      default: "",
    },

    userEmail: {
      type: String,
      default: "",
    },

    items: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    pinCode: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            required: true,
          },
          updatedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

/* =====================================================
   VERIFY LOGIN TOKEN
===================================================== */

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const decoded = jwt.verify(parts[1], JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

/* =====================================================
   VERIFY ADMIN ROLE
===================================================== */

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error("ADMIN VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify admin access.",
    });
  }
};

/* =====================================================
   HOME
===================================================== */

app.get("/", (req, res) => {
  res.status(200).send("FoodExpress Backend Running");
});

/* =====================================================
   API TEST
===================================================== */

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FoodExpress API is working",
  });
});

/* =====================================================
   SIGNUP
   POST /api/signup
===================================================== */

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Never accept a role from the signup request.
    // Every public signup creates a normal user.
    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Signup failed.",
    });
  }
});

/* =====================================================
   LOGIN
   POST /api/login
===================================================== */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

/* =====================================================
   CREATE ORDER
   POST /api/orders
===================================================== */

app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const {
      items,
      address,
      city,
      pinCode,
      paymentMethod,
      total,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const orderTotal = Number(total);

    if (
      !Number.isFinite(orderTotal) ||
      orderTotal < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order total.",
      });
    }

    const newOrder = await Order.create({
      userId: req.user.userId,
      userName: req.user.name,
      userEmail: req.user.email,
      items,
      address: address ? String(address) : "",
      city: city ? String(city) : "",
      pinCode: pinCode ? String(pinCode) : "",
      paymentMethod: paymentMethod || "Cash on Delivery",
      total: orderTotal,
      status: "Placed",
      statusHistory: [
        {
          status: "Placed",
          updatedAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Order placement failed.",
    });
  }
});

/* =====================================================
   ADMIN DASHBOARD SUMMARY
   GET /api/admin/dashboard
===================================================== */

app.get(
  "/api/admin/dashboard",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      const totalRevenue = orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

      const stats = {
        totalOrders: orders.length,
        totalUsers: await User.countDocuments({ role: "user" }),
        totalRevenue,
        pendingOrders: orders.filter(
          (order) => order.status === "Placed"
        ).length,
        deliveredOrders: orders.filter(
          (order) => order.status === "Delivered"
        ).length,
        cancelledOrders: orders.filter(
          (order) => order.status === "Cancelled"
        ).length,
      };

      return res.status(200).json({
        success: true,
        stats,
        orders,
      });
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Could not load admin dashboard.",
      });
    }
  }
);

/* =====================================================
   GET ALL ORDERS
   ADMIN ONLY
   GET /api/orders
===================================================== */

app.get(
  "/api/orders",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("GET ALL ORDERS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch orders.",
      });
    }
  }
);

/* =====================================================
   GET LOGGED-IN USER'S ORDERS
   GET /api/orders/user/:email
===================================================== */

app.get(
  "/api/orders/user/:email",
  verifyToken,
  async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email)
        .toLowerCase()
        .trim();

      const loggedInEmail = String(req.user.email || "")
        .toLowerCase()
        .trim();

      if (loggedInEmail !== email) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access these orders.",
        });
      }

      const orders = await Order.find({
        userEmail: email,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("GET USER ORDERS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch user orders.",
      });
    }
  }
);

/* =====================================================
   GET SINGLE ORDER
   GET /api/orders/:id
===================================================== */

app.get(
  "/api/orders/:id",
  verifyToken,
  async (req, res) => {
    try {
      const orderId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      const isOwner =
        String(order.userId) === String(req.user.userId);

      const user = await User.findById(req.user.userId);
      const isAdmin = user?.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to view this order.",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("GET SINGLE ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch order.",
      });
    }
  }
);

/* =====================================================
   CANCEL ORDER
   PUT /api/orders/:id/cancel
===================================================== */

app.put(
  "/api/orders/:id/cancel",
  verifyToken,
  async (req, res) => {
    try {
      const orderId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      const orderEmail = String(order.userEmail || "")
        .toLowerCase()
        .trim();

      const loggedInEmail = String(req.user.email || "")
        .toLowerCase()
        .trim();

      if (orderEmail !== loggedInEmail) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to cancel this order.",
        });
      }

      if (
        order.status !== "Placed" &&
        order.status !== "Confirmed"
      ) {
        return res.status(400).json({
          success: false,
          message: "This order cannot be cancelled now.",
        });
      }

      order.status = "Cancelled";

      order.statusHistory.push({
        status: "Cancelled",
        updatedAt: new Date(),
      });

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully.",
        order,
      });
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to cancel order.",
      });
    }
  }
);

/* =====================================================
   DELETE ORDER
   DELETE /api/orders/:id
===================================================== */

app.delete(
  "/api/orders/:id",
  verifyToken,
  async (req, res) => {
    try {
      const orderId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "This order no longer exists.",
        });
      }

      const orderEmail = String(order.userEmail || "")
        .toLowerCase()
        .trim();

      const loggedInEmail = String(req.user.email || "")
        .toLowerCase()
        .trim();

      if (orderEmail !== loggedInEmail) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own order.",
        });
      }

      await Order.findByIdAndDelete(orderId);

      return res.status(200).json({
        success: true,
        message: "Order deleted successfully.",
        orderId,
      });
    } catch (error) {
      console.error("DELETE ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete order.",
      });
    }
  }
);

/* =====================================================
   UPDATE ORDER STATUS
   ADMIN ONLY
   PUT /api/orders/:id/status
===================================================== */

app.put(
  "/api/orders/:id/status",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      const allowedStatuses = [
        "Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      if (order.status === "Cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cancelled order cannot be updated.",
        });
      }

      order.status = status;

      if (!Array.isArray(order.statusHistory)) {
        order.statusHistory = [];
      }

      const lastHistory =
        order.statusHistory[order.statusHistory.length - 1];

      if (!lastHistory || lastHistory.status !== status) {
        order.statusHistory.push({
          status,
          updatedAt: new Date(),
        });
      }

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Could not update order status.",
      });
    }
  }
);

/* =====================================================
   404 HANDLER
   KEEP THIS LAST
===================================================== */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

/* =====================================================
   START SERVER AFTER DATABASE CONNECTS
===================================================== */

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("====================================");
      console.log("FoodExpress Backend Started");
      console.log(`Backend: http://localhost:${PORT}`);
      console.log("====================================");
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

startServer();
