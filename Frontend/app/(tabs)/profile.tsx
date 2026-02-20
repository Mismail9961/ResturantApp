import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

/* ──────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────── */
type Address = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type EditForm = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/* ──────────────────────────────────────────────────────────────
   Main Screen
────────────────────────────────────────────────────────────── */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoadingUser, refreshUser, updateProfile, updatePassword, signOut } = useAuth();

  /* ── state ── */
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const [form, setForm] = useState<EditForm>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [pwdForm, setPwdForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  /* ── load fresh profile once on mount ── */
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── auto-redirect when user becomes null (logout OR admin deleted account) ── */
  useEffect(() => {
    if (!isLoadingUser && user === null) {
      // Replace so the user can't go back to the profile screen
      router.replace("/signup/page" as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoadingUser]);

  /* ── pull-to-refresh ── */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  }, [refreshUser]);

  /* ── helpers ── */
  const getAddressString = (address?: Address): string => {
    if (!address) return "—";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  const openEditModal = () => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      street: (user?.address as Address)?.street ?? "",
      city: (user?.address as Address)?.city ?? "",
      state: (user?.address as Address)?.state ?? "",
      zipCode: (user?.address as Address)?.zipCode ?? "",
      country: (user?.address as Address)?.country ?? "",
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    setSaving(true);
    const error = await updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: {
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.trim(),
        country: form.country.trim(),
      },
    });
    setSaving(false);
    if (error) {
      Alert.alert("Error", error);
    } else {
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    }
  };

  const handleSavePassword = async () => {
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      Alert.alert("Validation", "Please fill in all password fields.");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      Alert.alert("Validation", "New passwords do not match.");
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      Alert.alert("Validation", "New password must be at least 6 characters.");
      return;
    }
    setSavingPwd(true);
    const error = await updatePassword(pwdForm.currentPassword, pwdForm.newPassword);
    setSavingPwd(false);
    if (error) {
      Alert.alert("Error", error);
    } else {
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwdModalVisible(false);
      Alert.alert("Success", "Password updated successfully!");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          // signOut clears storage + sets user=null;
          // the useEffect above then redirects automatically
          onPress: () => signOut(),
        },
      ],
      { cancelable: true }
    );
  };

  /* ── avatar initials fallback ── */
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  /* ──────────────────────────────────────────────────────────────
     Render
  ────────────────────────────────────────────────────────────── */
  return (
    <View style={styles.container}>
      {/* ── Red header strip ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <Ionicons name="refresh-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Avatar ── */}
      <View style={styles.avatarWrapper}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
        )}
        <View style={styles.onlineDot} />
      </View>

      {/* ── Card ── */}
      <ScrollView
        contentContainerStyle={styles.card}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF2A39" />
        }
      >
        {user ? (
          <>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role ?? "user"}</Text>

            {/* Info rows */}
            <InfoRow icon="mail-outline" label="Email" value={user.email} />
            <InfoRow icon="call-outline" label="Phone" value={user.phone || "—"} />
            <InfoRow
              icon="location-outline"
              label="Address"
              value={getAddressString(user.address as Address)}
            />

            <Divider />

            <MenuItem
              icon="receipt-outline"
              label="Order History"
              onPress={() => { }}
            />
            <MenuItem
              icon="card-outline"
              label="Payment Details"
              onPress={() => { }}
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => setPwdModalVisible(true)}
            />

            {/* Action Buttons */}
            <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#EF2A39" />
            <Text style={styles.loadingText}>Loading profile…</Text>
          </View>
        )}
      </ScrollView>

      {/* ════════════════════════════════════
          Edit Profile Modal
      ════════════════════════════════════ */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                style={styles.saveHeaderBtn}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#EF2A39" />
                ) : (
                  <Text style={styles.saveHeaderText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              <SectionLabel title="Personal Info" />
              <EditField
                label="Full Name"
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your full name"
                icon="person-outline"
              />
              <EditField
                label="Email"
                value={form.email}
                onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@example.com"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <EditField
                label="Phone"
                value={form.phone}
                onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
                placeholder="+1 234 567 8900"
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <SectionLabel title="Delivery Address" />
              <EditField
                label="Street"
                value={form.street}
                onChangeText={(v) => setForm((f) => ({ ...f, street: v }))}
                placeholder="123 Main St"
                icon="home-outline"
              />
              <EditField
                label="City"
                value={form.city}
                onChangeText={(v) => setForm((f) => ({ ...f, city: v }))}
                placeholder="New York"
                icon="business-outline"
              />
              <EditField
                label="State"
                value={form.state}
                onChangeText={(v) => setForm((f) => ({ ...f, state: v }))}
                placeholder="NY"
                icon="map-outline"
              />
              <EditField
                label="Zip Code"
                value={form.zipCode}
                onChangeText={(v) => setForm((f) => ({ ...f, zipCode: v }))}
                placeholder="10001"
                icon="barcode-outline"
                keyboardType="numeric"
              />
              <EditField
                label="Country"
                value={form.country}
                onChangeText={(v) => setForm((f) => ({ ...f, country: v }))}
                placeholder="United States"
                icon="globe-outline"
              />

              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ════════════════════════════════════
          Change Password Modal
      ════════════════════════════════════ */}
      <Modal
        visible={pwdModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPwdModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setPwdModalVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Change Password</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              keyboardShouldPersistTaps="handled"
            >
              <PasswordField
                label="Current Password"
                value={pwdForm.currentPassword}
                onChangeText={(v) => setPwdForm((f) => ({ ...f, currentPassword: v }))}
                placeholder="Enter current password"
                visible={showCurrentPwd}
                onToggle={() => setShowCurrentPwd((s) => !s)}
              />
              <PasswordField
                label="New Password"
                value={pwdForm.newPassword}
                onChangeText={(v) => setPwdForm((f) => ({ ...f, newPassword: v }))}
                placeholder="Min. 6 characters"
                visible={showNewPwd}
                onToggle={() => setShowNewPwd((s) => !s)}
              />
              <PasswordField
                label="Confirm New Password"
                value={pwdForm.confirmPassword}
                onChangeText={(v) => setPwdForm((f) => ({ ...f, confirmPassword: v }))}
                placeholder="Repeat new password"
                visible={showConfirmPwd}
                onToggle={() => setShowConfirmPwd((s) => !s)}
              />

              <TouchableOpacity
                style={[styles.saveBtn, savingPwd && styles.saveBtnDisabled]}
                onPress={handleSavePassword}
                disabled={savingPwd}
              >
                {savingPwd ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Update Password</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* ──────────────────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────────────────── */

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconBox}>
      <Ionicons name={icon} size={18} color="#EF2A39" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  </View>
);

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIconBox}>
        <Ionicons name={icon} size={18} color="#EF2A39" />
      </View>
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const SectionLabel = ({ title }: { title: string }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
);

const EditField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "words",
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) => (
  <View style={styles.editGroup}>
    <Text style={styles.editLabel}>{label}</Text>
    <View style={styles.editInputWrapper}>
      <Ionicons name={icon} size={18} color="#aaa" style={styles.editIcon} />
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  </View>
);

const PasswordField = ({
  label,
  value,
  onChangeText,
  placeholder,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.editGroup}>
    <Text style={styles.editLabel}>{label}</Text>
    <View style={styles.editInputWrapper}>
      <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.editIcon} />
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        secureTextEntry={!visible}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={20} color="#aaa" />
      </TouchableOpacity>
    </View>
  </View>
);

/* ──────────────────────────────────────────────────────────────
   Styles
────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EF2A39",
  },

  /* header */
  header: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* avatar */
  avatarWrapper: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarFallback: {
    backgroundColor: "#c0392b",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: "37%",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2ecc71",
    borderWidth: 2,
    borderColor: "#EF2A39",
  },

  /* card */
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: "100%",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 24,
  },

  /* info rows */
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F5",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFE5E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  /* divider */
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 20,
  },

  /* menu items */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  /* buttons */
  editBtn: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: "#EF2A39",
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* loading */
  loadingBox: {
    alignItems: "center",
    paddingTop: 60,
    gap: 16,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 15,
  },

  /* ── Modal ── */
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  saveHeaderBtn: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  saveHeaderText: {
    color: "#EF2A39",
    fontWeight: "700",
    fontSize: 16,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* section label */
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF2A39",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },

  /* edit fields */
  editGroup: {
    marginBottom: 14,
  },
  editLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    fontWeight: "600",
  },
  editInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#eee",
  },
  editIcon: {
    marginRight: 10,
  },
  editInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  /* save button */
  saveBtn: {
    backgroundColor: "#EF2A39",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
