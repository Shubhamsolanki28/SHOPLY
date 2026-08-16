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

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to view your orders."
        );
        navigation.goBack();
        return;
      }

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.log(
        "Orders Error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#FF5A36"
        />

        <Text style={styles.loadingText}>
          Loading your orders...
        </Text>
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
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.shoplyText}>
            SHOPLY
          </Text>

          <Text style={styles.title}>
            My Orders
          </Text>
        </View>

        <View style={styles.headerSpacer} />

      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            📦
          </Text>

          <Text style={styles.emptyTitle}>
            No Orders Yet
          </Text>

          <Text style={styles.emptySubtitle}>
            You haven't placed any orders yet.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() =>
              navigation.navigate("MainTabs", {
                screen: "Products",
              })
            }
          >
            <Text style={styles.shopButtonText}>
              START SHOPPING →
            </Text>
          </TouchableOpacity>

        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {orders.map((order) => (
            <View
              key={order._id}
              style={styles.orderCard}
            >

              {/* ORDER HEADER */}
              <View style={styles.orderHeader}>

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

              {/* ORDER DETAILS */}
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Items
                </Text>

                <Text style={styles.infoValue}>
                  {order.totalItems}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Payment
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

                <Text style={styles.infoValue}>
                  {order.paymentStatus}
                </Text>
              </View>

              {/* TOTAL */}
              <View style={styles.totalRow}>

                <Text style={styles.totalLabel}>
                  Total
                </Text>

                <Text style={styles.totalValue}>
                  ₹{order.totalPrice}
                </Text>

              </View>

              {/* VIEW ORDER */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate(
                    "OrderDetails",
                    {
                      orderId: order._id,
                    }
                  )
                }
              >
                <Text style={styles.viewButtonText}>
                  VIEW ORDER →
                </Text>
              </TouchableOpacity>

            </View>
          ))}

        </ScrollView>
      )}

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
    paddingBottom: 20,
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

  shoplyText: {
    color: "#FF5A36",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 3,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF5A36",
    letterSpacing: 1,
    marginBottom: 4,
  },

  orderId: {
    width: 190,
    fontSize: 12,
    color: "#777777",
  },

  statusBadge: {
    backgroundColor: "#EAF7EE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#238636",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    color: "#777777",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222222",
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    marginTop: 5,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111111",
  },

  totalValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111111",
  },

  viewButton: {
    height: 48,
    backgroundColor: "#111111",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
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
    fontSize: 13,
    color: "#777777",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
  },

  shopButton: {
    height: 52,
    paddingHorizontal: 25,
    backgroundColor: "#111111",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});