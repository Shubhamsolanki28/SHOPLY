import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function CheckoutScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const fetchCart = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Login Required", "Please login to continue.");
        navigation.goBack();
        return;
      }

      const response = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const cartData = response.data.cart;

        if (!cartData || !cartData.items || cartData.items.length === 0) {
          Alert.alert("Empty Cart", "Please add products before checkout.");

          navigation.navigate("MainTabs", {
            screen: "Cart",
          });

          return;
        }

        setCart(cartData);
      }
    } catch (error) {
      console.log(
        "Checkout Cart Error:",
        error.response?.data || error.message,
      );

      Alert.alert("Error", "Unable to load checkout details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const validateCheckout = () => {
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter your full name.");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Missing Information", "Please enter your phone number.");
      return false;
    }

    if (phone.trim().length !== 10) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number.",
      );
      return false;
    }

    if (!address.trim()) {
      Alert.alert("Missing Information", "Please enter your address.");
      return false;
    }

    if (!city.trim()) {
      Alert.alert("Missing Information", "Please enter your city.");
      return false;
    }

    if (!pincode.trim()) {
      Alert.alert("Missing Information", "Please enter your pincode.");
      return false;
    }

    if (pincode.trim().length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode.");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckout()) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Login Required", "Please login again to continue.");
        return;
      }

      const response = await api.post(
        "/orders",
        {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        Alert.alert(
          "Order Placed Successfully 🎉",
          `Your order has been placed successfully.\n\nOrder Total: ₹${response.data.order.totalPrice}`,
          [
            {
              text: "View Orders",
              onPress: () => {
                navigation.navigate("Orders");
              },
            },
          ],
        );
      }
    } catch (error) {
      console.log("Place Order Error:", error.response?.data || error.message);

      const message =
        error.response?.data?.message || "Unable to place your order.";

      Alert.alert("Order Failed", message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF5A36" />

        <Text style={styles.loadingText}>Loading checkout...</Text>
      </View>
    );
  }

  if (!cart) {
    return null;
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

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* DELIVERY ADDRESS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999999"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>

            <TextInput
              style={styles.input}
              placeholder="10-digit phone number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.inputLabel}>Address</Text>

            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="House no., street, area"
              placeholderTextColor="#999999"
              multiline
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>City</Text>

                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#999999"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Pincode</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Pincode"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>
          </View>
        </View>

        {/* PAYMENT METHOD */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === "COD" && styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === "COD" && <View style={styles.radioInner} />}
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Cash on Delivery</Text>

              <Text style={styles.paymentSubtitle}>
                Pay when your order arrives
              </Text>
            </View>

            <Text style={styles.paymentIcon}>💵</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === "ONLINE" && styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod("ONLINE")}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === "ONLINE" && <View style={styles.radioInner} />}
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Online Payment</Text>

              <Text style={styles.paymentSubtitle}>
                UPI / Card / Net Banking
              </Text>
            </View>

            <Text style={styles.paymentIcon}>💳</Text>
          </TouchableOpacity>
        </View>

        {/* ORDER SUMMARY */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryCard}>
            {cart.items.map((item) => (
              <View
                key={item._id || item.product?._id}
                style={styles.productRow}
              >
                <View style={styles.productSummaryInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.product?.name || "Product"}
                  </Text>

                  <Text style={styles.productQuantity}>
                    Qty: {item.quantity}
                  </Text>
                </View>

                <Text style={styles.productPrice}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>

              <Text style={styles.summaryValue}>₹{cart.totalPrice}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>

              <Text style={styles.freeText}>FREE</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.totalValue}>₹{cart.totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* PLACE ORDER */}

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>PLACE ORDER →</Text>
        </TouchableOpacity>

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

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444444",
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: "#F8F8F8",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111111",
    marginBottom: 15,
  },

  addressInput: {
    height: 75,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  halfInput: {
    flex: 1,
  },

  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
  },

  selectedPayment: {
    borderColor: "#FF5A36",
    backgroundColor: "#FFF9F7",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#FF5A36",
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  paymentSubtitle: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
  },

  paymentIcon: {
    fontSize: 23,
  },

  summaryCard: {
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
    marginBottom: 14,
  },

  productSummaryInfo: {
    flex: 1,
    paddingRight: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222222",
  },

  productQuantity: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#777777",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  freeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#238636",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
  },

  totalValue: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111111",
  },

  placeOrderButton: {
    height: 58,
    backgroundColor: "#111111",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  secureText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 11,
    marginTop: 12,
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
});
