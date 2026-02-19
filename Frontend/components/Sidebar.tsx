// components/Sidebar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { label: "Home", icon: "home-outline", route: "/" },
    { label: "Shop", icon: "bag-handle-outline", route: "/shop" },
    { label: "Category", icon: "grid-outline", route: "/category" },
    { label: "Cart", icon: "cart-outline", route: "/cart" },
    { label: "Contact Us", icon: "call-outline", route: "/contact" },
  ];

  const handleNavigation = (path: string) => {
    // ✅ Cast path to `any` to bypass strict route type error safely
    router.push(path as any);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color="#fff"
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "65%",
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 10,
    paddingTop: 100,
    paddingHorizontal: 25,
  },
  sidebar: {
    flexDirection: "column",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 18,
    fontWeight: "500",
  },
});
