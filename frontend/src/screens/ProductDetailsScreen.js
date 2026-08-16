import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function ProductDetailsScreen({ navigation, route }) {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch single product
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${productId}`);

      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.log(
        "Product Details Error:",
        error.response?.data || error.message
      );

      Alert.alert("Error", "Unable to load product details.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Increase quantity
  const increaseQuantity = () => {
    if (!product) return;

    const stock = product.stock ?? 0;

    if (quantity >= stock) {
      Alert.alert(
        "Stock Limit",
        "Requested quantity exceeds available stock."
      );
      return;
    }

    setQuantity((previous) => previous + 1);
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previous) => previous - 1);
    }
  };

  // Add product to cart
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to add products to your cart."
        );
        return;
      }

      const response = await api.post(
        "/cart",
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Added to Cart 🛒",
          `${product.name} has been added to your cart.`,
          [
            {
              text: "Continue Shopping",
              style: "cancel",
            },
            {
              text: "View Cart",

              // IMPORTANT FIX
              onPress: () => {
                navigation.navigate("MainTabs", {
                  screen: "Cart",
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log(
        "Add Cart Error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Unable to add product to cart.";

      Alert.alert("Cart Error", message);
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5A36" />

        <Text style={styles.loadingText}>
          Loading product...
        </Text>
      </View>
    );
  }

  // Product not found
  if (!product) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          Product not found.
        </Text>

        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stock = product.stock ?? 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.topTitle}>
            Product Details
          </Text>

          {/* CART BUTTON */}
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => {
              navigation.navigate("MainTabs", {
                screen: "Cart",
              });
            }}
          >
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUCT IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product.image ||
                "https://via.placeholder.com/600x600.png?text=Product",
            }}
            style={styles.productImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() =>
              Alert.alert(
                "Wishlist",
                "Wishlist feature coming soon."
              )
            }
          >
            <Text style={styles.favoriteIcon}>♡</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUCT INFORMATION */}
        <View style={styles.detailsContainer}>
          <Text style={styles.category}>
            {product.category || "PRODUCT"}
          </Text>

          <Text style={styles.productName}>
            {product.name}
          </Text>

          {/* RATING */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.star}>★</Text>

              <Text style={styles.ratingText}>
                {product.rating || "4.5"}
              </Text>
            </View>

            <Text style={styles.ratingLabel}>
              Customer Rating
            </Text>
          </View>

          {/* PRICE */}
          <Text style={styles.price}>
            ₹{product.price}
          </Text>

          {/* STOCK */}
          <View style={styles.stockContainer}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor:
                    stock > 0 ? "#32A852" : "#D93025",
                },
              ]}
            />

            <Text
              style={[
                styles.stockText,
                {
                  color:
                    stock > 0 ? "#238636" : "#D93025",
                },
              ]}
            >
              {stock > 0
                ? `${stock} items available`
                : "Out of stock"}
            </Text>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description
            </Text>

            <Text style={styles.description}>
              {product.description ||
                "This premium product is designed to provide excellent quality and value. Shop with confidence from SHOPLY."}
            </Text>
          </View>

          {/* QUANTITY */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>
              Quantity
            </Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>
                  −
                </Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>
                {quantity}
              </Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
                disabled={stock === 0}
              >
                <Text style={styles.quantityButtonText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TOTAL */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalPrice}>
              ₹{product.price * quantity}
            </Text>
          </View>

          {/* ADD TO CART */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              stock === 0 && styles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={addingToCart || stock === 0}
          >
            {addingToCart ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addToCartText}>
                {stock > 0
                  ? "ADD TO CART  →"
                  : "OUT OF STOCK"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  scrollContent: {
    paddingBottom: 35,
  },

  topBar: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
  },

  topButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  backIcon: {
    fontSize: 30,
    color: "#111111",
    marginTop: -3,
  },

  cartIcon: {
    fontSize: 19,
  },

  topTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },

  imageContainer: {
    marginHorizontal: 20,
    height: 330,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  favoriteIcon: {
    fontSize: 27,
    color: "#111111",
  },

  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  category: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF5A36",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  productName: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: "#111111",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4DD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },

  star: {
    color: "#FFB800",
    fontSize: 14,
    marginRight: 4,
  },

  ratingText: {
    color: "#6B5200",
    fontSize: 13,
    fontWeight: "700",
  },

  ratingLabel: {
    color: "#888888",
    fontSize: 12,
    marginLeft: 9,
  },

  price: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111111",
    marginTop: 17,
  },

  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  stockText: {
    fontSize: 12,
    fontWeight: "600",
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 9,
  },

  description: {
    color: "#777777",
    fontSize: 14,
    lineHeight: 22,
  },

  quantitySection: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  quantityButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: 22,
    color: "#111111",
  },

  quantityText: {
    minWidth: 32,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  totalContainer: {
    marginTop: 25,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#777777",
    fontSize: 14,
  },

  totalPrice: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "900",
  },

  addToCartButton: {
    height: 58,
    backgroundColor: "#111111",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  disabledButton: {
    backgroundColor: "#AAAAAA",
  },

  addToCartText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },

  loadingText: {
    marginTop: 10,
    color: "#777777",
    fontSize: 13,
  },

  errorText: {
    color: "#777777",
    fontSize: 15,
    marginBottom: 20,
  },

  backButtonSmall: {
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});