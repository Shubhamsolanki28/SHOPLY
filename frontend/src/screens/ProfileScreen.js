import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Load User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Remove login data
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");

            // Go back to Root Navigator
            // Profile -> MainTabs -> App -> Root
            const rootNavigation = navigation
              .getParent()
              ?.getParent();

            if (rootNavigation) {
              rootNavigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Auth",
                  },
                ],
              });
            }
          } catch (error) {
            console.log("Logout Error:", error);

            Alert.alert(
              "Logout Failed",
              "Unable to logout. Please try again."
            );
          }
        },
      },
    ]
  );
};

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#FF5A36"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.shoplyText}>
          SHOPLY
        </Text>

        <Text style={styles.title}>
          My Profile
        </Text>
      </View>

      {/* PROFILE CARD */}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || "SHOPLY User"}
        </Text>

        <Text style={styles.email}>
          {user?.email || "Logged in user"}
        </Text>
      </View>

      {/* OPTIONS */}

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            navigation.navigate("Orders")
          }
        >
          <View>
            <Text style={styles.optionTitle}>
              My Orders
            </Text>

            <Text style={styles.optionSubtitle}>
              View your order history
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            navigation.navigate("MainTabs", {
              screen: "Cart",
            })
          }
        >
          <View>
            <Text style={styles.optionTitle}>
              My Cart
            </Text>

            <Text style={styles.optionSubtitle}>
              View your shopping cart
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          LOGOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 55,
    paddingBottom: 25,
  },

  shoplyText: {
    color: "#FF5A36",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111111",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    padding: 25,
    alignItems: "center",
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#FF5A36",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "900",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
  },

  email: {
    marginTop: 6,
    fontSize: 14,
    color: "#777777",
  },

  optionsContainer: {
    marginTop: 25,
  },

  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
  },

  optionSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#888888",
  },

  arrow: {
    fontSize: 24,
    color: "#FF5A36",
    fontWeight: "700",
  },

  logoutButton: {
    height: 56,
    backgroundColor: "#111111",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  loaderContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#777777",
    fontSize: 13,
  },
});