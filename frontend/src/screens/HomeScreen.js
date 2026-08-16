import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import api from "../services/api";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories
  const categories = [
    { id: "1", name: "All", icon: "🛍️" },
    { id: "2", name: "Fashion", icon: "👕" },
    { id: "3", name: "Electronics", icon: "📱" },
    { id: "4", name: "Shoes", icon: "👟" },
    { id: "5", name: "Beauty", icon: "💄" },
    { id: "6", name: "Home", icon: "🏠" },
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.log(
        "Products Error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Unable to load products",
        "Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  const trendingProducts = products.slice(4, 8);

  const renderProduct = (product) => {
    return (
      <TouchableOpacity
        key={product._id}
        style={styles.productCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            productId: product._id,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product.image ||
                "https://via.placeholder.com/300x300.png?text=Product",
            }}
            style={styles.productImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => Alert.alert("Wishlist", "Added to wishlist")}
          >
            <Text style={styles.heartText}>♡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text
            style={styles.productName}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>

            <Text style={styles.rating}>
              {product.rating || "4.5"}
            </Text>
          </View>

          <Text style={styles.productPrice}>
            ₹{product.price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallGreeting}>
              Good morning 👋
            </Text>

            <Text style={styles.headerTitle}>
              Discover your style
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() =>
              Alert.alert("Notifications", "No new notifications")
            }
          >
            <Text style={styles.notificationIcon}>♧</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.searchIcon}>⌕</Text>

          <Text style={styles.searchPlaceholder}>
            Search products...
          </Text>

          <View style={styles.filterButton}>
            <Text style={styles.filterIcon}>☷</Text>
          </View>
        </TouchableOpacity>

        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSmallText}>
              LIMITED TIME OFFER
            </Text>

            <Text style={styles.heroTitle}>
              Summer{"\n"}Sale
            </Text>

            <Text style={styles.heroDiscount}>
              Up to 50% OFF
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate("Products")}
            >
              <Text style={styles.shopButtonText}>
                Shop Now →
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroCircle}>
            <Text style={styles.heroEmoji}>🛍️</Text>
          </View>
        </View>

        {/* CATEGORIES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Categories
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.seeAll}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("Products", {
                  category: category.name,
                })
              }
            >
              <View style={styles.categoryCircle}>
                <Text style={styles.categoryIcon}>
                  {category.icon}
                </Text>
              </View>

              <Text style={styles.categoryName}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FEATURED PRODUCTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Featured Products
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.seeAll}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color="#FF5A36"
            />

            <Text style={styles.loadingText}>
              Loading products...
            </Text>
          </View>
        ) : featuredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No products available
            </Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {featuredProducts.map(renderProduct)}
          </View>
        )}

        {/* TRENDING */}
        {!loading && trendingProducts.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Trending Now 🔥
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Popular products this week
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("Products")}
              >
                <Text style={styles.seeAll}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productGrid}>
              {trendingProducts.map(renderProduct)}
            </View>
          </>
        )}

        {/* SPECIAL OFFER */}
        <View style={styles.offerBanner}>
          <View>
            <Text style={styles.offerSmall}>
              SPECIAL OFFER
            </Text>

            <Text style={styles.offerTitle}>
              Get 20% OFF
            </Text>

            <Text style={styles.offerDescription}>
              On your first order
            </Text>

            <TouchableOpacity
              style={styles.offerButton}
              onPress={() =>
                navigation.navigate("Products")
              }
            >
              <Text style={styles.offerButtonText}>
                Shop Now
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.offerEmoji}>
            🎁
          </Text>
        </View>

        <View style={styles.bottomSpace} />
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
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  smallGreeting: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 5,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111111",
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  notificationIcon: {
    fontSize: 24,
    color: "#111111",
  },

  searchContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 7,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  searchIcon: {
    fontSize: 28,
    color: "#777777",
    marginRight: 10,
  },

  searchPlaceholder: {
    flex: 1,
    color: "#999999",
    fontSize: 14,
  },

  filterButton: {
    width: 42,
    height: 42,
    backgroundColor: "#111111",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  filterIcon: {
    color: "#FFFFFF",
    fontSize: 21,
  },

  heroBanner: {
    height: 185,
    borderRadius: 22,
    backgroundColor: "#111111",
    padding: 20,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  heroContent: {
    justifyContent: "center",
    zIndex: 2,
  },

  heroSmallText: {
    color: "#FF5A36",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 29,
  },

  heroDiscount: {
    color: "#DDDDDD",
    fontSize: 12,
    marginTop: 6,
  },

  shopButton: {
    backgroundColor: "#FF5A36",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
    alignSelf: "flex-start",
    marginTop: 10,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  heroCircle: {
    width: 145,
    height: 145,
    borderRadius: 75,
    backgroundColor: "#252525",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: -30,
  },

  heroEmoji: {
    fontSize: 65,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },

  seeAll: {
    color: "#FF5A36",
    fontSize: 13,
    fontWeight: "700",
  },

  categoryList: {
    paddingBottom: 28,
  },

  categoryItem: {
    alignItems: "center",
    marginRight: 18,
  },

  categoryCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 8,
  },

  categoryIcon: {
    fontSize: 25,
  },

  categoryName: {
    fontSize: 11,
    color: "#444444",
    fontWeight: "600",
  },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  imageContainer: {
    height: 155,
    backgroundColor: "#F2F2F2",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  heartButton: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  heartText: {
    fontSize: 22,
    color: "#111111",
  },

  productInfo: {
    padding: 11,
  },

  productName: {
    fontSize: 13,
    color: "#222222",
    fontWeight: "600",
    lineHeight: 18,
    minHeight: 36,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  star: {
    color: "#FFB800",
    fontSize: 13,
    marginRight: 4,
  },

  rating: {
    fontSize: 11,
    color: "#777777",
  },

  productPrice: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "800",
    marginTop: 5,
  },

  loaderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 10,
    color: "#777777",
    fontSize: 13,
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#888888",
    fontSize: 14,
  },

  offerBanner: {
    backgroundColor: "#FF5A36",
    borderRadius: 20,
    padding: 20,
    minHeight: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },

  offerSmall: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 5,
  },

  offerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  offerDescription: {
    color: "#FFE7E0",
    fontSize: 12,
    marginTop: 3,
  },

  offerButton: {
    backgroundColor: "#111111",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
    alignSelf: "flex-start",
    marginTop: 12,
  },

  offerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  offerEmoji: {
    fontSize: 70,
  },

  bottomSpace: {
    height: 30,
  },
});