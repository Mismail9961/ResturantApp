import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

/* ---------- Types ---------- */

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

interface PaymentCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

/* ---------- Screen ---------- */

export default function CheckoutScreen() {
  const router = useRouter();  
  const [selectedPayment, setSelectedPayment] = useState<
    "credit" | "debit" | "cod"
  >("credit");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} onPress={() => router.push("/products/[id]")} />
          <Text style={styles.headerTitle}>Order summary</Text>
          <Ionicons name="search" size={22} />
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Row label="Order" value="$16.48" />
          <Row label="Taxes" value="$0.3" />
          <Row label="Delivery fees" value="$1.5" />

          <View style={styles.divider} />

          <Row label="Total:" value="$18.19" bold />

          <Text style={styles.deliveryText}>
            Estimated delivery time:{" "}
            <Text style={styles.bold}>15 - 30 mins</Text>
          </Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment methods</Text>

        <PaymentCard
          title="Credit card"
          subtitle="3586 **** **** 6055"
          icon="logo-mastercard"
          selected={selectedPayment === "credit"}
          onPress={() => setSelectedPayment("credit")}
        />

        <PaymentCard
          title="Debit card"
          subtitle="3586 **** **** 6055"
          icon="logo-visa"
          selected={selectedPayment === "debit"}
          onPress={() => setSelectedPayment("debit")}
        />

        <PaymentCard
          title="Cash on Delivery"
          subtitle="Pay when food arrives"
          icon="cash-outline"
          selected={selectedPayment === "cod"}
          onPress={() => setSelectedPayment("cod")}
        />

        {/* COD FORM */}
        {selectedPayment === "cod" && (
          <View style={styles.codBox}>
            <Text style={styles.codTitle}>Delivery Details</Text>

            <TextInput
              placeholder="Delivery Address"
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />

            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        )}

        {/* Save Card */}
        {selectedPayment !== "cod" && (
          <View style={styles.saveCard}>
            <Ionicons name="checkbox" size={18} color="red" />
            <Text style={styles.saveText}>
              Save card details for future payments
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total price</Text>
          <Text style={styles.footerPrice}>$18.19</Text>
        </View>

        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText} onPress={() => router.push("/success/page")}>
            {selectedPayment === "cod" ? "Place Order" : "Pay Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

const Row: React.FC<RowProps> = ({ label, value, bold = false }) => (
  <View style={styles.row}>
    <Text style={[styles.rowText, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.rowText, bold && styles.bold]}>{value}</Text>
  </View>
);

const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}) => (
  <TouchableOpacity style={styles.paymentCard} onPress={onPress}>
    <Ionicons name={icon as any} size={32} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.paymentTitle}>{title}</Text>
      {subtitle && (
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      )}
    </View>
    <Ionicons
      name={selected ? "radio-button-on" : "radio-button-off"}
      size={22}
    />
  </TouchableOpacity>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  rowText: {
    fontSize: 14,
    color: "#333",
  },

  bold: {
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  deliveryText: {
    marginTop: 8,
    fontSize: 13,
    color: "#444",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
  },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 12,
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  paymentSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  codBox: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },

  codTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  saveCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },

  saveText: {
    marginLeft: 8,
    fontSize: 13,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  footerLabel: {
    fontSize: 13,
    color: "#666",
  },

  footerPrice: {
    fontSize: 18,
    fontWeight: "700",
  },

  payButton: {
    backgroundColor: "#2b2b2b",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 24,
  },

  payText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
