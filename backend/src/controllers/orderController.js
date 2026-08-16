const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create Order
const createOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      pincode,
      paymentMethod = "COD",
    } = req.body;

    // Check required fields
    if (!name || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All delivery address fields are required",
      });
    }

    // Validate payment method
    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Check stock for every product
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: "One of the products in your cart no longer exists",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} does not have enough stock`,
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image || "",
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate totals
    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Create order
    const order = await Order.create({
      user: req.user.userId,

      items: orderItems,

      shippingAddress: {
        name,
        phone,
        address,
        city,
        pincode,
      },

      paymentMethod,

      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",

      orderStatus: "PLACED",

      totalItems,
      totalPrice,
    });

    // Reduce product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Empty cart after successful order
    cart.items = [];
    await cart.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order._id,
        totalItems: order.totalItems,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        shippingAddress: order.shippingAddress,
        items: order.items,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get Single Order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
