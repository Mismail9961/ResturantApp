import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  /* ── Step state ── */
  const [step, setStep] = useState<1 | 2>(1);

  /* ── Step 1 fields ── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── Step 2 fields ── */
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  /* ── Animation ── */
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goToStep2 = () => {
    // Validate step 1
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      Alert.alert("Validation", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start(() => setStep(2));
  };

  const goBack = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start(() => setStep(1));
  };

  const handleSignUp = async () => {
    // Validate step 2
    if (!phone.trim()) {
      Alert.alert("Validation", "Please enter your phone number.");
      return;
    }
    if (!address.street.trim()) {
      Alert.alert("Validation", "Please enter your street address.");
      return;
    }
    if (!address.city.trim()) {
      Alert.alert("Validation", "Please enter your city.");
      return;
    }
    if (!address.state.trim()) {
      Alert.alert("Validation", "Please enter your state.");
      return;
    }
    if (!address.zipCode.trim()) {
      Alert.alert("Validation", "Please enter your zip code.");
      return;
    }
    if (!address.country.trim()) {
      Alert.alert("Validation", "Please enter your country.");
      return;
    }

    setLoading(true);
    try {
      const error = await signUp(
        name.trim(),
        email.trim(),
        password,
        phone.trim(),
        {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zipCode: address.zipCode.trim(),
          country: address.country.trim(),
        }
      );

      if (error) {
        Alert.alert("Signup Failed", error);
        return;
      }

      Alert.alert("Welcome! 🎉", "Your account has been created successfully!", [
        { text: "Let's Go!", onPress: () => router.replace("/(tabs)" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────
     Render
  ──────────────────────────────── */
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand header ── */}
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons name="restaurant" size={28} color="#fff" />
            </View>
            <Text style={styles.brandName}>FoodApp</Text>
          </View>

          {/* ── Progress bar ── */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, step === 2 && styles.progressFillFull]} />
            </View>
            <View style={styles.stepsRow}>
              <StepDot number={1} active={step === 1} done={step === 2} label="Account" />
              <StepDot number={2} active={step === 2} done={false} label="Contact" />
            </View>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            {step === 1 ? (
              <>
                <Text style={styles.cardTitle}>Create Account</Text>
                <Text style={styles.cardSubtitle}>
                  Tell us a little about yourself
                </Text>

                <Field
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChangeText={setName}
                  icon="person-outline"
                  autoCapitalize="words"
                />
                <Field
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* Password */}
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#bbb"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((s) => !s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#aaa" />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#aaa" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Repeat your password"
                    placeholderTextColor="#bbb"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirm((s) => !s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={20} color="#aaa" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.primaryBtn} onPress={goToStep2}>
                  <Text style={styles.primaryBtnText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Back button */}
                <TouchableOpacity style={styles.backRow} onPress={goBack}>
                  <Ionicons name="arrow-back" size={20} color="#EF2A39" />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>Contact & Address</Text>
                <Text style={styles.cardSubtitle}>
                  Required for delivery to reach you
                </Text>

                <Field
                  label="Phone Number"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChangeText={setPhone}
                  icon="call-outline"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />

                <Text style={styles.sectionLabel}>Delivery Address</Text>

                <Field
                  label="Street"
                  placeholder="123 Main Street, Apt 4A"
                  value={address.street}
                  onChangeText={(v) => setAddress((a) => ({ ...a, street: v }))}
                  icon="home-outline"
                />
                <View style={styles.row2}>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="City"
                      placeholder="New York"
                      value={address.city}
                      onChangeText={(v) => setAddress((a) => ({ ...a, city: v }))}
                      icon="business-outline"
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Field
                      label="State"
                      placeholder="NY"
                      value={address.state}
                      onChangeText={(v) => setAddress((a) => ({ ...a, state: v }))}
                      icon="map-outline"
                    />
                  </View>
                </View>
                <View style={styles.row2}>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Zip Code"
                      placeholder="10001"
                      value={address.zipCode}
                      onChangeText={(v) => setAddress((a) => ({ ...a, zipCode: v }))}
                      icon="barcode-outline"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Country"
                      placeholder="United States"
                      value={address.country}
                      onChangeText={(v) => setAddress((a) => ({ ...a, country: v }))}
                      icon="globe-outline"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      <Text style={styles.primaryBtnText}>Create Account</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Login link */}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.link}
                onPress={() => router.push("/login/page" as any)}
              >
                Log in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────────────────── */

const StepDot = ({
  number,
  active,
  done,
  label,
}: {
  number: number;
  active: boolean;
  done: boolean;
  label: string;
}) => (
  <View style={dotStyles.wrapper}>
    <View
      style={[
        dotStyles.dot,
        active && dotStyles.activeDot,
        done && dotStyles.doneDot,
      ]}
    >
      {done ? (
        <Ionicons name="checkmark" size={14} color="#fff" />
      ) : (
        <Text style={[dotStyles.num, (active || done) && dotStyles.numActive]}>
          {number}
        </Text>
      )}
    </View>
    <Text style={[dotStyles.label, active && dotStyles.labelActive]}>{label}</Text>
  </View>
);

const dotStyles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 4 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: { backgroundColor: "#EF2A39" },
  doneDot: { backgroundColor: "#2ecc71" },
  num: { fontSize: 13, fontWeight: "700", color: "#aaa" },
  numActive: { color: "#fff" },
  label: { fontSize: 11, color: "#aaa", fontWeight: "600" },
  labelActive: { color: "#EF2A39" },
});

const Field = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={18} color="#aaa" style={styles.fieldIcon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
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
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* brand */
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 8,
    gap: 10,
  },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  /* progress */
  progressContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    paddingTop: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressFillFull: {
    width: "100%",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* card */
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    flex: 1,
    minHeight: 600,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },

  /* back row */
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    color: "#EF2A39",
    fontWeight: "600",
    fontSize: 15,
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

  /* fields */
  fieldLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#eee",
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  /* 2-column row */
  row2: {
    flexDirection: "row",
  },

  /* button */
  primaryBtn: {
    backgroundColor: "#EF2A39",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* footer */
  footerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#999",
    fontSize: 14,
  },
  link: {
    color: "#EF2A39",
    fontWeight: "700",
  },
});