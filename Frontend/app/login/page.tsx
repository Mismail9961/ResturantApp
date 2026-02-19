import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const error = await signIn(email.trim(), password);

      if (error) {
        Alert.alert("Login Failed", error);
        return;
      }

      router.replace("/(tabs)" as any);
    } catch (error: any) {
      const msg = error?.message || "Check your connection or credentials";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("/signup/page" as any)}>Sign Up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#ffffff", borderRadius: 16, padding: 24, elevation: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 26, fontWeight: "bold", color: "#ff0000", textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 14 },
  button: { backgroundColor: "#ff0000", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 10, height: 55, justifyContent: 'center' },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  footerText: { textAlign: "center", marginTop: 20, color: "#555" },
  link: { color: "#ff0000", fontWeight: "600" },
});