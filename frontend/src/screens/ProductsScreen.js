import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function ProductsScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.category || "All"
  );

  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Shoes",
    "Beauty",
    "Home",
  ];

  // ================= FETCH PRODUCTS =================

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
        "Error",
        "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH WISHLIST =================

  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        return;
      }

      const response = await api.get("/users/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const wishlistProducts = response.data.wishlist || [];

        setWishlist(
          wishlistProducts.map((product) =>
            typeof product === "string"
              ? product
              : product._id
          )
        );
      }
    } catch (error) {
      console.log(
        "Wishlist Fetch Error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ================= CHECK WISHLIST =================

 const isWishlisted = (productId) => {
  return wishlist.some(
    (id) => String(id) === String(productId)
  );
};

  // ================= TOGGLE WISHLIST =================

  const toggleWishlist = async (productId, productName) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert(
        "Login Required",
        "Please login to use wishlist."
      );
      return;
    }

    const alreadyWishlisted = wishlist.some(
      (id) => String(id) === String(productId)
    );

    if (alreadyWishlisted) {
      // REMOVE

      const response = await api.delete(
        `/users/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
  setWishlist((previous) => {
    const updated = [
      ...previous,
      String(productId),
    ];

    console.log("UPDATED WISHLIST:", updated);

    return updated;
  });

  Alert.alert(
    "Wishlist ❤️",
    `${productName} added to wishlist.`
  );
}
    } else {
      // ADD

      const response = await api.post(
        "/users/wishlist",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Immediately update heart
        setWishlist((previous) => [
          ...previous,
          String(productId),
        ]);

        Alert.alert(
          "Wishlist ❤️",
          `${productName} added to wishlist.`
        );
      }
    }
  } catch (error) {
    console.log(
      "Wishlist Error:",
      error.response?.data || error.message
    );

    Alert.alert(
      "Wishlist Error",
      error.response?.data?.message ||
        "Unable to update wishlist."
    );
  }
};

  // ================= SEARCH + CATEGORY + SORT =================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter((product) =>
        `${product.name} ${
          product.description || ""
        } ${product.category || ""}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Sorting
    if (sort === "low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sort,
  ]);

  // ================= PRODUCT CARD =================

  const renderProduct = ({ item }) => {
    const liked = isWishlisted(item._id);

    return (
      <TouchableOpacity
  style={styles.favoriteButton}
  activeOpacity={0.7}
  onPress={(event) => {
    event.stopPropagation();

    toggleWishlist(item._id, item.name);
  }}
>
  <Text
    style={[
      styles.favoriteIcon,
      isWishlisted(item._id) &&
        styles.favoriteIconActive,
    ]}
  >
    {isWishlisted(item._id) ? "♥" : "♡"}
  </Text>
</TouchableOpacity>
    );
  };

  // ================= UI =================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.headerSmall}>
            SHOPLY
          </Text>

          <Text style={styles.headerTitle}>
            All Products
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() =>
            navigation.navigate("Cart")
          }
        >
          <Text style={styles.cartIcon}>
            🛒
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>
          ⌕
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
          >
            <Text style={styles.clearText}>
              ×
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORY */}

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.categoryList
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item &&
                styles.categoryButtonActive,
            ]}
            onPress={() =>
              setSelectedCategory(item)
            }
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* RESULT + SORT */}

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>
          {filteredProducts.length} Products
        </Text>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            if (sort === "default") {
              setSort("low");
            } else if (sort === "low") {
              setSort("high");
            } else if (sort === "high") {
              setSort("rating");
            } else {
              setSort("default");
            }
          }}
        >
          <Text style={styles.sortText}>
            {sort === "default"
              ? "Sort"
              : sort === "low"
              ? "Price ↑"
              : sort === "high"
              ? "Price ↓"
              : "Rating ★"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCTS */}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#FF5A36"
          />

          <Text style={styles.loadingText}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>
            🔍
          </Text>

          <Text style={styles.emptyTitle}>
            No products found
          </Text>

          <Text style={styles.emptyText}>
            Try another search or category.
          </Text>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearch("");
              setSelectedCategory("All");
              setSort("default");
            }}
          >
            <Text style={styles.resetText}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) =>
            item._id
          }
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={
            styles.columnWrapper
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.productList
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 50,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  headerSmall: {
    color: "#FF5A36",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },

  headerTitle: {
    color: "#111111",
    fontSize: 25,
    fontWeight: "800",
  },

  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  cartIcon: {
    fontSize: 21,
  },

  searchContainer: {
    marginHorizontal: 20,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  searchIcon: {
    fontSize: 27,
    color: "#777777",
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111111",
  },

  clearText: {
    fontSize: 25,
    color: "#888888",
    paddingLeft: 8,
  },

  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  categoryButtonActive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },

  categoryButtonText: {
    fontSize: 12,
    color: "#555555",
    fontWeight: "600",
  },

  categoryButtonTextActive: {
    color: "#FFFFFF",
  },

  resultHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  resultText: {
    color: "#222222",
    fontSize: 15,
    fontWeight: "700",
  },

  sortButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  sortText: {
    color: "#333333",
    fontSize: 12,
    fontWeight: "600",
  },

  productList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  imageContainer: {
    height: 165,
    backgroundColor: "#F1F1F1",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  favoriteIcon: {
    fontSize: 24,
    color: "#111111",
  },

  favoriteIconActive: {
    color: "#FF5A36",
  },

  productInfo: {
    padding: 11,
  },

  categoryText: {
    color: "#FF5A36",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  productName: {
    color: "#222222",
    fontSize: 13,
    fontWeight: "700",
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
    color: "#777777",
    fontSize: 11,
  },

  price: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 5,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#777777",
    fontSize: 13,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  emptyText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },

  resetButton: {
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 18,
  },

  resetText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});