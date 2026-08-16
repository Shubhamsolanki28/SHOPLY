const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, trending, offer } = req.query;

    let filter = {};

    // Category filter
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    // Search filter
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Featured filter
    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // Trending filter
    if (trending !== undefined) {
      filter.trending = trending === "true";
    }

    // Offer filter
    if (offer !== undefined) {
      filter.offer = offer === "true";
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};