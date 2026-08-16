const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
    removeFromCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add product to cart
router.post("/", protect, addToCart);

// Get user's cart
router.get("/", protect, getCart);

// Update cart item quantity
router.put("/:productId", protect, updateCartItem);

// Remove product from cart
router.delete("/:productId", protect, removeFromCart);

module.exports = router;