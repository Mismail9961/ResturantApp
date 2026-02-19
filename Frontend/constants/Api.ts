import Constants from "expo-constants";
import { Platform } from "react-native";

// Optional explicit host from .env (recommended when using Expo tunnel)
// Example in .env: EXPO_PUBLIC_API_HOST=192.168.1.5
const envHost = process.env.EXPO_PUBLIC_API_HOST;

// Try several manifest fields to get the host IP used by Expo (only use if it looks like an IP)
const rawDebuggerHost =
  Constants.expoConfig?.hostUri?.split(":").shift() ||
  (Constants.manifest?.debuggerHost &&
    Constants.manifest.debuggerHost.split(":").shift()) ||
  null;

const ipRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
const debuggerHost = rawDebuggerHost && ipRegex.test(rawDebuggerHost) ? rawDebuggerHost : null;

// Fall back to 10.0.2.2 for Android emulator, or localhost for others.
const fallbackHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const host = envHost || debuggerHost || fallbackHost;

export const API_BASE = `http://${host}:5000`;
export const API_URL = `http://${host}:5000/api/auth`;