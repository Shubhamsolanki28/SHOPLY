const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create new order
router.post("/", authMiddleware, createOrder);

// Get logged-in user's orders
router.get("/", authMiddleware, getMyOrders);

// Get single order
router.get("/:orderId", authMiddleware, getOrderById);

module.exports = router;