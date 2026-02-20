import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/constants/Api";

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  address?: Address;
  avatar?: string;
};

type AuthContextType = {
  user: BackendUser | null;
  isLoadingUser: boolean;
  signUp: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: Address
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (fields: Partial<Pick<BackendUser, 'name' | 'email' | 'phone'> & { address?: Address }>) => Promise<string | null>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
};

const TOKEN_KEY = "userToken";
const USER_KEY = "userInfo";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // ── Internal helper: clear everything and null the user ──
  const forceSignOut = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (_) { }
    setUser(null);
  };

  // ── Global axios interceptor: auto-logout on 401 from backend ──
  // This fires whenever the admin deletes the user, token expires, etc.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        // 401 = not authorised / user not found on protected routes
        if (status === 401) {
          const url: string = error?.config?.url ?? "";
          // Don't auto-logout on the login/signup endpoints themselves
          const isAuthEndpoint =
            url.includes("/login") || url.includes("/signup");
          if (!isAuthEndpoint) {
            await forceSignOut();
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load persisted session on mount ──
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser: BackendUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Failed to load stored auth state", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadStoredUser();
  }, []);

  const signUp = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: Address
  ) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
        phone,
        address,
      });

      if (response.data?.success) {
        const { token, user: userData } = response.data;

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        setUser(userData);
        return null;
      }

      return response.data?.message || "Signup failed.";
    } catch (error: any) {
      const message =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed.";
      return message;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data?.success) {
        const { token, user: userData } = response.data;

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        setUser(userData);
        return null;
      }

      return response.data?.message || "Signin failed.";
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Signin failed.";
      return message;
    }
  };

  const signOut = async () => {
    await forceSignOut();
  };

  const refreshUser = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        await forceSignOut();
        return;
      }
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.success) {
        const updated = response.data.data;
        const userData: BackendUser = {
          id: updated._id ?? updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          address: updated.address,
          avatar: updated.avatar,
        };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      // 401 / 404 → user deleted or token invalid → force logout
      if (status === 401 || status === 404) {
        await forceSignOut();
      } else {
        console.log("Failed to refresh user", error);
      }
    }
  };

  const updateProfile = async (
    fields: Partial<Pick<BackendUser, 'name' | 'email' | 'phone'> & { address?: Address }>
  ): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return "Not authenticated";
      const response = await axios.put(`${API_URL}/updatedetails`, fields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.success) {
        const updated = response.data.data;
        const userData: BackendUser = {
          id: updated._id ?? updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          address: updated.address,
          avatar: updated.avatar,
        };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
        return null;
      }
      return response.data?.message || "Update failed.";
    } catch (error: any) {
      return (
        error?.response?.data?.message ||
        error?.message ||
        "Update failed."
      );
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return "Not authenticated";
      const response = await axios.put(
        `${API_URL}/updatepassword`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success) {
        // token may have rotated, persist the new one
        if (response.data.token) {
          await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
        }
        return null;
      }
      return response.data?.message || "Password update failed.";
    } catch (error: any) {
      return (
        error?.response?.data?.message ||
        error?.message ||
        "Password update failed."
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn, signOut, refreshUser, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside of the AuthProvider");
  return context;
};
