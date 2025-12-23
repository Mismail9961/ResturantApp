import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function FoodgoApp() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const categories = ["All", "Combos", "Sliders", "Chicken"];

  const foodItems = [
    { id: 1, name: "Cheeseburger", description: "Wendy's Burger", rating: 4.9 },
    { id: 2, name: "Hamburger", description: "Veggie Burger", rating: 4.8 },
    { id: 3, name: "Hamburger", description: "Chicken Burger", rating: 4.6 },
    { id: 4, name: "Hamburger", description: "Fried Chicken Burger", rating: 4.5 },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  /** ✅ EXPO ROUTER SAFE NAVIGATION */
const handleProductPress = (id: number) => {
  router.push(`/products/${id}` as any);
};


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Foodgo</Text>
            <Text style={styles.tagline}>Order your favourite food!</Text>
          </View>
          <View style={styles.profilePlaceholder} />
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput placeholder="Search" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food Grid */}
        <View style={styles.foodGrid}>
          {foodItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.foodCard}
              onPress={() => handleProductPress(item.id)}
            >
              <View style={styles.imagePlaceholder}>
                <Text style={{ fontSize: 48 }}>🍔</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDescription}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFA500" />
                    <Text>{item.rating}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Ionicons
                      name={favorites.has(item.id) ? "heart" : "heart-outline"}
                      size={22}
                      color={favorites.has(item.id) ? "#EF2A39" : "#666"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    padding: 16,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  logo: { fontSize: 32, fontWeight: "bold" },
  tagline: { color: "#666", marginTop: 4 },

  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },

  searchInput: { flex: 1 },

  menuButton: {
    backgroundColor: "#EF2A39",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 8,
  },

  categoryButtonActive: { backgroundColor: "#EF2A39" },
  categoryText: { color: "#666" },
  categoryTextActive: { color: "#fff" },

  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },

  foodCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 3,
  },

  imagePlaceholder: {
    height: 140,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  cardContent: { padding: 12 },
  foodName: { fontWeight: "600" },
  foodDescription: { fontSize: 12, color: "#666", marginVertical: 6 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingContainer: { flexDirection: "row", gap: 4 },
});
