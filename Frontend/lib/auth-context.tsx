import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/constants/Api";

type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  address?: unknown;
  avatar?: string;
};

type AuthContextType = {
  user: BackendUser | null;
  isLoadingUser: boolean;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const TOKEN_KEY = "userToken";
const USER_KEY = "userInfo";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
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
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.log("Error clearing auth storage", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside of the AuthProvider");
  return context;
};
