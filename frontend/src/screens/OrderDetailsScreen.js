import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function OrderDetailsScreen({ navigation, route }) {
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to view your order."
        );
        navigation.goBack();
        return;
      }

      const response = await api.get(
        `/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.log(
        "Order Details Error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        "Unable to load order details."
      );

      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#FF5A36"
        />

        <Text style={styles.loadingText}>
          Loading order details...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          Order not found.
        </Text>

        <TouchableOpacity
          style={styles.backSmallButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backSmallText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Order Details
        </Text>

        <View style={styles.headerSpacer} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ORDER STATUS */}

        <View style={styles.statusCard}>

          <View>
            <Text style={styles.orderLabel}>
              ORDER
            </Text>

            <Text
              style={styles.orderId}
              numberOfLines={1}
            >
              #{order._id}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {order.orderStatus || "PLACED"}
            </Text>
          </View>

        </View>

        {/* PRODUCTS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Products
          </Text>

          <View style={styles.card}>

            {order.items?.map((item, index) => (
              <View
                key={
                  item._id ||
                  `${item.product}-${index}`
                }
                style={[
                  styles.productRow,
                  index !== order.items.length - 1 &&
                    styles.productBorder,
                ]}
              >

                <View style={styles.productInfo}>

                  <Text
                    style={styles.productName}
                    numberOfLines={2}
                  >
                    {item.name || "Product"}
                  </Text>

                  <Text style={styles.quantityText}>
                    Quantity: {item.quantity}
                  </Text>

                  <Text style={styles.priceText}>
                    ₹{item.price} × {item.quantity}
                  </Text>

                </View>

                <Text style={styles.itemTotal}>
                  ₹{item.price * item.quantity}
                </Text>

              </View>
            ))}

          </View>

        </View>

        {/* SHIPPING ADDRESS */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Shipping Address
          </Text>

          <View style={styles.card}>

            <Text style={styles.addressName}>
              {order.shippingAddress?.name}
            </Text>

            <Text style={styles.addressText}>
              📞 {order.shippingAddress?.phone}
            </Text>

            <Text style={styles.addressText}>
              📍 {order.shippingAddress?.address}
            </Text>

            <Text style={styles.addressText}>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.pincode}
            </Text>

          </View>

        </View>

        {/* PAYMENT */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Payment
          </Text>

          <View style={styles.card}>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Payment Method
              </Text>

              <Text style={styles.infoValue}>
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </Text>

            </View>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Payment Status
              </Text>

              <Text style={styles.pendingText}>
                {order.paymentStatus}
              </Text>

            </View>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Order Status
              </Text>

              <Text style={styles.placedText}>
                {order.orderStatus}
              </Text>

            </View>

          </View>

        </View>

        {/* ORDER SUMMARY */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          <View style={styles.card}>

            <View style={styles.summaryRow}>

              <Text style={styles.summaryLabel}>
                Total Items
              </Text>

              <Text style={styles.summaryValue}>
                {order.totalItems}
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
                ₹{order.totalPrice}
              </Text>

            </View>

          </View>

        </View>

        <Text style={styles.secureText}>
          🔒 Your order information is secure
        </Text>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
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

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111111",
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  orderLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF5A36",
    letterSpacing: 1,
    marginBottom: 5,
  },

  orderId: {
    width: 210,
    fontSize: 12,
    color: "#777777",
  },

  statusBadge: {
    backgroundColor: "#EAF7EE",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#238636",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 11,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },

  productBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 15,
    marginBottom: 10,
  },

  productInfo: {
    flex: 1,
    paddingRight: 15,
  },

  productName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111111",
  },

  quantityText: {
    fontSize: 12,
    color: "#777777",
    marginTop: 5,
  },

  priceText: {
    fontSize: 12,
    color: "#999999",
    marginTop: 3,
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111111",
  },

  addressName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 10,
  },

  addressText: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 21,
    marginBottom: 3,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  infoLabel: {
    fontSize: 13,
    color: "#777777",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222222",
    maxWidth: 190,
    textAlign: "right",
  },

  pendingText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D68A00",
  },

  placedText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#238636",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#777777",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  freeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#238636",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111111",
  },

  totalValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111111",
  },

  secureText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 10,
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

  backSmallButton: {
    backgroundColor: "#111111",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backSmallText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});