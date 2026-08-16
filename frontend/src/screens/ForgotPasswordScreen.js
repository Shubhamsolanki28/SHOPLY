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

import api from "../services/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      if (response.data.success) {
        Alert.alert(
          "Request Sent",
          response.data.message,
          [
            {
              text: "Back to Login",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      }
    } catch (error) {
      console.log(
        "Forgot Password Error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Unable to process your request.";

      Alert.alert("Something went wrong", message);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>S</Text>
          </View>

          <Text style={styles.logoText}>SHOPLY</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.subtitle}>
            Don't worry. Enter your registered email and
            we'll help you reset your password.
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                SEND RESET REQUEST →
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>
              Remember your password?{" "}
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 35,
  },

  backButton: {
    marginBottom: 25,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },

  logoContainer: {
    alignItems: "center",
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
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    marginBottom: 35,
  },

  inputContainer: {
    marginBottom: 22,
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

  button: {
    height: 56,
    backgroundColor: "#111111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  loginButton: {
    alignItems: "center",
    marginTop: 28,
  },

  loginText: {
    color: "#777777",
    fontSize: 14,
  },

  loginLink: {
    color: "#FF5A36",
    fontWeight: "700",
  },
});