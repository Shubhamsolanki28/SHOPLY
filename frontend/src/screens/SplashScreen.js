import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Auth");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#111111"
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>S</Text>
        </View>

        <Text style={styles.logoText}>SHOPLY</Text>

        <Text style={styles.tagline}>
          Premium Shopping Experience
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.loadingText}>
          Your style. Your choice.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    alignItems: "center",
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FF5A36",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logoIcon: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  logoText: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#FFFFFF",
  },

  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: "#A0A0A0",
    letterSpacing: 0.5,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 55,
  },

  loadingText: {
    fontSize: 12,
    color: "#777777",
    letterSpacing: 0.5,
  },
});