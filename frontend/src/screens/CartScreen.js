import React, { useCallback, useState } from "react";
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

import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(null);

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setCart({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
        return;
      }

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.log(
        "Fetch Cart Error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Cart Error",
        "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart whenever Cart screen opens
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login first."
        );
        return;
      }

      const response = await api.put(
        `/cart/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.log(
        "Update Quantity Error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Unable to update quantity.";

      Alert.alert("Cart Error", message);
    } finally {
      setUpdatingProduct(null);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (productId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdatingProduct(productId);

              const token =
                await AsyncStorage.getItem("token");

              if (!token) {
                Alert.alert(
                  "Login Required",
                  "Please login first."
                );
                return;
              }

              const response = await api.delete(
                `/cart/${productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                setCart(response.data.cart);
              }
            } catch (error) {
              console.log(
                "Remove Item Error:",
                error.response?.data || error.message
              );

              Alert.alert(
                "Error",
                "Unable to remove item."
              );
            } finally {
              setUpdatingProduct(null);
            }
          },
        },
      ]
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#FF5A36"
        />

        <Text style={styles.loadingText}>
          Loading cart...
        </Text>
      </View>
    );
  }

  // =========================
  // EMPTY CART
  // =========================
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.shoplyText}>
          SHOPLY
        </Text>

        <Text style={styles.emptyTitle}>
          My Cart
        </Text>

        <Text style={styles.emptyIcon}>
          🛒
        </Text>

        <Text style={styles.emptyTitleSmall}>
          Your cart is empty
        </Text>

        <Text style={styles.emptySubtitle}>
          Add some products to your cart
          and they will appear here.
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.shopButtonText}>
            START SHOPPING →
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View>
          <Text style={styles.shoplyText}>
            SHOPLY
          </Text>

          <Text style={styles.title}>
            My Cart
          </Text>
        </View>

        <View style={styles.itemBadge}>
          <Text style={styles.itemBadgeText}>
            {cart.totalItems}{" "}
            {cart.totalItems === 1
              ? "item"
              : "items"}
          </Text>
        </View>
      </View>

      {/* ================= CART ITEMS ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cart.items.map((item) => {
          const product = item.product;

          const productId = product?._id;

          const lineTotal =
            item.price * item.quantity;

          const stock = product?.stock ?? 0;

          const isUpdating =
            updatingProduct === productId;

          return (
            <View
              key={productId}
              style={styles.cartCard}
            >

              {/* PRODUCT IMAGE */}
              <Image
                source={{
                  uri:
                    product?.image ||
                    "https://via.placeholder.com/300x300.png?text=Product",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* PRODUCT INFO */}
              <View style={styles.productInfo}>

                <Text style={styles.category}>
                  {product?.category || "PRODUCT"}
                </Text>

                <Text
                  style={styles.productName}
                  numberOfLines={2}
                >
                  {product?.name || "Product"}
                </Text>

                {/* RATING */}
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>
                    ★
                  </Text>

                  <Text style={styles.rating}>
                    {product?.rating || "4.5"}
                  </Text>
                </View>

                {/* PRICE + QUANTITY */}
                <View style={styles.bottomRow}>

                  <Text style={styles.itemPrice}>
                    ₹{lineTotal}
                  </Text>

                  <View style={styles.quantityContainer}>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      disabled={
                        isUpdating ||
                        item.quantity <= 1
                      }
                      onPress={() =>
                        updateQuantity(
                          productId,
                          item.quantity - 1
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.quantityButtonText,
                          item.quantity <= 1 &&
                            styles.disabledText,
                        ]}
                      >
                        −
                      </Text>
                    </TouchableOpacity>

                    {isUpdating ? (
                      <ActivityIndicator
                        size="small"
                        color="#111111"
                      />
                    ) : (
                      <Text
                        style={styles.quantityText}
                      >
                        {item.quantity}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.quantityButton}
                      disabled={
                        isUpdating ||
                        item.quantity >= stock
                      }
                      onPress={() =>
                        updateQuantity(
                          productId,
                          item.quantity + 1
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.quantityButtonText,
                          item.quantity >= stock &&
                            styles.disabledText,
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>

              {/* REMOVE BUTTON */}
              <TouchableOpacity
                style={styles.removeButton}
                disabled={isUpdating}
                onPress={() =>
                  removeItem(productId)
                }
              >
                <Text style={styles.removeText}>
                  ×
                </Text>
              </TouchableOpacity>

            </View>
          );
        })}
      </ScrollView>

      {/* ================= SUMMARY ================= */}
      <View style={styles.summary}>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal
          </Text>

          <Text style={styles.summaryValue}>
            ₹{cart.totalPrice}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Delivery
          </Text>

          <Text style={styles.freeText}>
            FREE
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.totalValue}>
            ₹{cart.totalPrice}
          </Text>
        </View>

        {/* CHECKOUT */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutText}>
            PROCEED TO CHECKOUT →
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  // ================= HEADER =================

  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  shoplyText: {
    color: "#FF5A36",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 7,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111111",
  },

  itemBadge: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 5,
  },

  itemBadgeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },

  // ================= SCROLL =================

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 235,
  },

  // ================= CART CARD =================

  cartCard: {
    minHeight: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 16,
    padding: 18,
    flexDirection: "row",
    position: "relative",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  // ================= PRODUCT IMAGE =================

  productImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },

  // ================= PRODUCT INFO =================

  productInfo: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 28,
    minWidth: 0,
  },

  category: {
    color: "#FF5A36",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  productName: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21,
  },

  // ================= RATING =================

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  star: {
    color: "#FFB800",
    fontSize: 17,
  },

  rating: {
    color: "#777777",
    fontSize: 14,
    marginLeft: 5,
  },

  // ================= PRICE + QUANTITY =================

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
    gap: 6,
  },

  itemPrice: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111111",
    flexShrink: 1,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 15,
    width: 118,
    height: 48,
    flexShrink: 0,
  },

  quantityButton: {
    width: 36,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#111111",
  },

  quantityText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  disabledText: {
    color: "#BBBBBB",
  },

  // ================= REMOVE =================

  removeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },

  removeText: {
    fontSize: 32,
    lineHeight: 32,
    color: "#999999",
    fontWeight: "300",
  },

  // ================= SUMMARY =================

  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,

    elevation: 15,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11,
  },

  summaryLabel: {
    fontSize: 15,
    color: "#777777",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  freeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#238636",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  totalValue: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
  },

  // ================= CHECKOUT =================

  checkoutButton: {
    height: 56,
    backgroundColor: "#111111",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // ================= LOADING =================

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777777",
  },

  // ================= EMPTY CART =================

  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111111",
  },

  emptyIcon: {
    fontSize: 55,
    marginTop: 35,
  },

  emptyTitleSmall: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111111",
    marginTop: 18,
  },

  emptySubtitle: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  shopButton: {
    backgroundColor: "#111111",
    paddingHorizontal: 28,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});