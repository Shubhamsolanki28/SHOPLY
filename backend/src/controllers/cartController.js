const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: product._id,
            quantity,
            price: product.price,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

//ADD TO CART FUNCTION
const getCart = async (req, res) => {
  try {
    // Find cart of logged-in user
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate(
      "items.product",
      "name description price image category rating stock"
    );

    // If cart doesn't exist
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    // Calculate total items
    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};


// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Find cart
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find cart item
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product is not in cart",
      });
    }

    // Check product stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    // Update quantity
    cartItem.quantity = quantity;

    await cart.save();

    // Return updated cart with product details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name description price image category rating stock"
    );

    const totalItems = updatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const totalPrice = updatedCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: {
        _id: updatedCart._id,
        user: updatedCart.user,
        items: updatedCart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};


// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check whether product exists in cart
    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product is not in cart",
      });
    }

    // Remove product
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Get updated cart with product details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name description price image category rating stock"
    );

    // Calculate totals
    const totalItems = updatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const totalPrice = updatedCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: {
        _id: updatedCart._id,
        user: updatedCart.user,
        items: updatedCart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};



module.exports = {
  addToCart,
   getCart,
   updateCartItem,
    removeFromCart,
};