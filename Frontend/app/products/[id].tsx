import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import TabsLayout from "../(tabs)/_layout";

export default function ProductPage() {
  const router = useRouter();
  const [spicy, setSpicy] = useState(40);
  const [quantity, setQuantity] = useState(2);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Ionicons name="search-outline" size={22} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={require("../../assets/images/image6.png")}
          style={styles.image}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Cheeseburger Wendy's Burger</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.rating}>4.9</Text>
            <Text style={styles.time}>· 26 mins</Text>
          </View>

          <Text style={styles.description}>
            The Cheeseburger Wendy's Burger is a classic fast food burger that
            packs a punch of flavor in every bite. Made with a juicy beef patty
            cooked to perfection, it's topped with melted American cheese,
            crispy lettuce, ripe tomato, and crunchy pickles.
          </Text>

          {/* Spicy Slider */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spicy</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.mild}>Mild</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={100}
                value={spicy}
                minimumTrackTintColor="#EF2A39"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#EF2A39"
                onValueChange={setSpicy}
              />
              <Text style={styles.hot}>Hot</Text>
            </View>
          </View>

          {/* Portion */}
          <View style={styles.portionRow}>
            <Text style={styles.sectionTitle}>Portion</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Text style={styles.counterText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{quantity}</Text>

              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceBox}>
          <Text style={styles.price}>$8.24</Text>
        </View>
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => router.push("/payment/page")}
        >
          <Text style={styles.orderText}>ORDER NOW</Text>
        </TouchableOpacity>
      </View>

      {/* Render Tabs at the bottom */}
      <TabsLayout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 320,
    resizeMode: "contain",
    marginTop: 80,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 6,
  },
  rating: {
    fontWeight: "600",
  },
  time: {
    color: "#888",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginVertical: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mild: {
    color: "green",
    fontSize: 12,
  },
  hot: {
    color: "red",
    fontSize: 12,
  },
  portionRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  counterBtn: {
    backgroundColor: "#EF2A39",
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  qty: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
  },
  priceBox: {
    backgroundColor: "#EF2A39",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  price: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  orderBtn: {
    flex: 1,
    backgroundColor: "#2C2C2C",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  orderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
