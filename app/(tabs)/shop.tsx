import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ---------- Types ---------- */
type OrderStatus = "Delivered" | "On the way" | "Cancelled";

interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: string;
}

export default function WishlistScreen() {
  const orders: Order[] = [
    {
      id: "ORD-1023",
      date: "12 Sep 2025",
      total: "$24.50",
      status: "Delivered",
      items: "2x Cheeseburger, Fries",
    },
    {
      id: "ORD-1018",
      date: "08 Sep 2025",
      total: "$18.20",
      status: "On the way",
      items: "1x Chicken Burger",
    },
    {
      id: "ORD-1009",
      date: "02 Sep 2025",
      total: "$31.00",
      status: "Cancelled",
      items: "Combo Meal",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Foodgo</Text>

          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.card}
        showsVerticalScrollIndicator={false}
      >
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            activeOpacity={0.85}
          >
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.items}>{order.items}</Text>
              </View>

              <StatusBadge status={order.status} />
            </View>

            <View style={styles.divider} />

            <View style={styles.orderBottom}>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color="#999" />
                <Text style={styles.date}>{order.date}</Text>
              </View>

              <Text style={styles.total}>{order.total}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- Status Badge ---------- */

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    bg: string;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  Delivered: {
    bg: "#E8F8F0",
    color: "#2ECC71",
    icon: "checkmark-circle",
  },
  "On the way": {
    bg: "#FFF4E5",
    color: "#F39C12",
    icon: "bicycle",
  },
  Cancelled: {
    bg: "#FDEDEC",
    color: "#E74C3C",
    icon: "close-circle",
  },
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={14} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>
        {status}
      </Text>
    </View>
  );
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EF2A39",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingBottom: 50,
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 4,
      },
    }),
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderId: {
    fontSize: 15,
    fontWeight: "600",
  },

  items: {
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },

  orderBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  date: {
    fontSize: 12,
    color: "#999",
  },

  total: {
    fontSize: 16,
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
