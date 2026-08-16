import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter your email and password."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });

 if (response.data.success) {
  const token = response.data.token;

  await AsyncStorage.setItem(
    "token",
    token
  );

  await AsyncStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  Alert.alert(
    "Login Successful",
    "Welcome back to SHOPLY!",
    [
      {
        text: "OK",
        onPress: () => {
          navigation.getParent()?.reset({
            index: 0,
            routes: [
              {
                name: "App",
              },
            ],
          });
        },
      },
    ]
  );

  console.log(
    "JWT and user saved successfully"
  );
}
  } catch (error) {
    console.log(
      "Login Error:",
      error.response?.data || error.message
    );

    const message =
      error.response?.data?.message ||
      "Unable to login. Please try again.";

    Alert.alert("Login Failed", message);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>S</Text>
          </View>

          <Text style={styles.logoText}>SHOPLY</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome back 👋</Text>

          <Text style={styles.subtitle}>
            Sign in to continue shopping
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginText}>LOGIN →</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.signupLink}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 55,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 45,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FF5A36",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  logoLetter: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  logoText: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#111111",
  },

  content: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#777777",
    marginBottom: 35,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111111",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgotText: {
    color: "#FF5A36",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    height: 56,
    backgroundColor: "#111111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 5,
  },

  signupText: {
    color: "#777777",
    fontSize: 14,
  },

  signupLink: {
    color: "#FF5A36",
    fontSize: 14,
    fontWeight: "700",
  },
});