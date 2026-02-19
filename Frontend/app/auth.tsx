import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (isSignUp && !name) {
      return setError("Please fill in all fields.");
    }

    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setError(null);

    const result = isSignUp
      ? await signUp(name.trim(), email.trim(), password)
      : await signIn(email.trim(), password);

    if (result) {
      return setError(result);
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appSubtitle}>
              {isSignUp ? "Sign Up" : "Login Here"}
            </Text>
          </View>

          {/* Auth Card */}
          <View style={styles.card}>
            {isSignUp && (
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                theme={{
                  colors: {
                    primary: "#B9B093",
                    outline: "#B9B093",
                    text: "#000",
                    placeholder: "#999",
                  },
                }}
              />
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              autoCorrect={false}
              theme={{
                colors: {
                  primary: "#B9B093",
                  outline: "#B9B093",
                  text: "#000",
                  placeholder: "#999",
                },
              }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={hidePassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setHidePassword(!hidePassword)}
                />
              }
              secureTextEntry={hidePassword}
              style={styles.input}
              textContentType="password"
              autoCorrect={false}
              theme={{
                colors: {
                  primary: "#B9B093",
                  outline: "#B9B093",
                  text: "#000",
                  placeholder: "#999",
                },
              }}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              mode="contained"
              onPress={handleAuth}
              style={styles.button}
              labelStyle={{ fontSize: 16, fontWeight: "700", color: "#fff" }}
              contentStyle={{ paddingVertical: 6 }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp
                  ? "Already have an account? "
                  : "Don’t have an account? "}
                <Text style={styles.toggleHighlight}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  logo: {
    width: 185,
    height: 151,
  },
  appSubtitle: {
    color: "#B9B093",
    fontSize: 16,
    fontFamily: "Franklin Gothic Demi",
    lineHeight: 26,
    textAlign: "center",
    marginTop: 7,
    opacity: 1,
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#B9B093",
    marginTop: 8,
    borderRadius: 12,
  },
  toggleText: {
    color: "#333",
    textAlign: "center",
    marginTop: 16,
  },
  toggleHighlight: {
    color: "#B9B093",
    fontWeight: "bold",
  },
  errorText: {
    color: "#B9B093",
    textAlign: "center",
    marginBottom: 10,
  },
});
