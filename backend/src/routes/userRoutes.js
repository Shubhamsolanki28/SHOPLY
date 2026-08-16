const express = require("express");

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add product to wishlist
router.post("/wishlist", authMiddleware, addToWishlist);

// Get wishlist
router.get("/wishlist", authMiddleware, getWishlist);

// Remove product from wishlist
router.delete("/wishlist/:productId", authMiddleware, removeFromWishlist);

module.exports = router;