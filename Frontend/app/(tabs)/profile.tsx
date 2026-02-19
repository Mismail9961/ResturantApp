import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/300",
          }}
          style={styles.avatar}
        />
      </View>

      {/* Card */}
      <ScrollView contentContainerStyle={styles.card}>
        <Input label="Name" value="Sophia Patel" />
        <Input label="Email" value="sophiapatel@gmail.com" />
        <Input
          label="Delivery address"
          value="123 Main St Apartment 4A, New York, NY"
        />
        <Input label="Password" value="•••••••••" secure />

        <Divider />

        <MenuItem label="Payment Details" />
        <MenuItem label="Order history" />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText} onPress={() => router.push("/signup/page")}>Log out</Text>
            <Ionicons name="log-out-outline" size={18} color="#EF2A39" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Components ---------- */

const Input = ({
  label,
  value,
  secure,
}: {
  label: string;
  value: string;
  secure?: boolean;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.input}>
      <Text>{secure ? "••••••••" : value}</Text>
      {secure && <Ionicons name="lock-closed-outline" size={16} color="#999" />}
    </View>
  </View>
);

const MenuItem = ({ label }: { label: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuText}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EF2A39",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 20,
    zIndex: 10,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingTop: 70,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 15,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },

  editBtn: {
    flex: 1,
    backgroundColor: "#2E2E2E",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#EF2A39",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "#EF2A39",
    fontWeight: "600",
  },
});
