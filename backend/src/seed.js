const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Nike Air Max 270",
    description:
      "Comfortable and stylish running shoes with lightweight cushioning for everyday use.",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    category: "Shoes",
    rating: 4.7,
    featured: true,
    trending: true,
    offer: true,
    stock: 25,
  },

  {
    name: "Classic White Sneakers",
    description:
      "Minimal white sneakers designed for casual outfits and everyday comfort.",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    category: "Shoes",
    rating: 4.5,
    featured: true,
    trending: false,
    offer: true,
    stock: 40,
  },

  {
    name: "Premium Black T-Shirt",
    description:
      "Premium cotton black t-shirt with a comfortable regular fit.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    category: "Fashion",
    rating: 4.4,
    featured: true,
    trending: true,
    offer: false,
    stock: 60,
  },

  {
    name: "Oversized Beige Hoodie",
    description:
      "Soft oversized hoodie with a modern relaxed fit for casual styling.",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    category: "Fashion",
    rating: 4.6,
    featured: false,
    trending: true,
    offer: true,
    stock: 35,
  },

  {
    name: "Classic Leather Watch",
    description:
      "Elegant leather strap watch suitable for both formal and casual occasions.",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    category: "Watches",
    rating: 4.8,
    featured: true,
    trending: true,
    offer: false,
    stock: 20,
  },

  {
    name: "Smart Digital Watch",
    description:
      "Modern digital smartwatch-inspired design with a sleek and lightweight body.",
    price: 5999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    category: "Watches",
    rating: 4.3,
    featured: false,
    trending: true,
    offer: true,
    stock: 30,
  },

  {
    name: "Urban Backpack",
    description:
      "Spacious everyday backpack with multiple compartments for work and travel.",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    category: "Bags",
    rating: 4.5,
    featured: true,
    trending: false,
    offer: true,
    stock: 45,
  },

  {
    name: "Premium Travel Backpack",
    description:
      "Durable travel backpack with spacious storage and comfortable shoulder straps.",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
    category: "Bags",
    rating: 4.6,
    featured: false,
    trending: true,
    offer: false,
    stock: 28,
  },

  {
    name: "Wireless Headphones",
    description:
      "Over-ear wireless headphones with comfortable cushions and immersive sound.",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    category: "Electronics",
    rating: 4.7,
    featured: true,
    trending: true,
    offer: true,
    stock: 32,
  },

  {
    name: "Wireless Earbuds",
    description:
      "Compact wireless earbuds with a modern charging case and clear audio.",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
    category: "Electronics",
    rating: 4.4,
    featured: false,
    trending: true,
    offer: true,
    stock: 50,
  },

  {
    name: "Classic Sunglasses",
    description:
      "Stylish sunglasses with a classic frame designed for everyday wear.",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    category: "Accessories",
    rating: 4.3,
    featured: false,
    trending: true,
    offer: false,
    stock: 70,
  },

  {
    name: "Leather Wallet",
    description:
      "Compact premium leather wallet with multiple card and cash compartments.",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    category: "Accessories",
    rating: 4.5,
    featured: true,
    trending: false,
    offer: true,
    stock: 80,
  },

  {
    name: "Running Sports Shoes",
    description:
      "Lightweight sports shoes designed for running, workouts and active lifestyles.",
    price: 4599,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
    category: "Shoes",
    rating: 4.6,
    featured: true,
    trending: true,
    offer: false,
    stock: 25,
  },

  {
    name: "Denim Jacket",
    description:
      "Classic blue denim jacket with a modern fit for everyday casual outfits.",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800",
    category: "Fashion",
    rating: 4.4,
    featured: false,
    trending: true,
    offer: true,
    stock: 30,
  },

  {
    name: "Minimalist Analog Watch",
    description:
      "Clean minimalist dial with a premium strap for a sophisticated everyday look.",
    price: 3799,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    category: "Watches",
    rating: 4.7,
    featured: true,
    trending: false,
    offer: false,
    stock: 18,
  },

  {
    name: "Canvas Tote Bag",
    description:
      "Simple and durable canvas tote bag perfect for shopping, college and daily use.",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
    category: "Bags",
    rating: 4.2,
    featured: false,
    trending: true,
    offer: true,
    stock: 55,
  },

  {
    name: "Portable Bluetooth Speaker",
    description:
      "Compact portable speaker with powerful sound and a modern minimalist design.",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    category: "Electronics",
    rating: 4.5,
    featured: true,
    trending: true,
    offer: true,
    stock: 40,
  },

  {
    name: "Premium Baseball Cap",
    description:
      "Classic adjustable baseball cap made from comfortable and durable fabric.",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
    category: "Accessories",
    rating: 4.1,
    featured: false,
    trending: false,
    offer: true,
    stock: 100,
  },

  {
    name: "Casual Cotton Shirt",
    description:
      "Breathable cotton casual shirt with a clean design suitable for everyday wear.",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    category: "Fashion",
    rating: 4.5,
    featured: true,
    trending: true,
    offer: false,
    stock: 45,
  },{
    name: "Cotton T-Shirt",
    description:
      "Breathable cotton casual shirt with a clean design suitable for everyday wear.",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    category: "Fashion",
    rating: 4.2,
    featured: true,
    trending: true,
    offer: false,
    stock: 25,
  }
  
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error.message);

    process.exit(1);
  }
};

seedProducts();