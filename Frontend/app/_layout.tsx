import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get('window');

function FoodgoLoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Bouncing dots animation
    const createBounceAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createBounceAnimation(bounce1, 0).start();
    createBounceAnimation(bounce2, 150).start();
    createBounceAnimation(bounce3, 300).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>Foodgo</Text>
      </Animated.View>

      {/* Loading Dots */}
      <View style={styles.loadingDots}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: bounce3 }] }]} />
      </View>
    </View>
  );
}

function AppLayout() {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingUser) return;

    if (!user) {
      router.replace("/login/page");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, isLoadingUser, router]);

  if (isLoadingUser) {
    return <FoodgoLoadingScreen />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF4757',
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.45,
    width: width,
    alignItems: 'center',
  },
  logo: {
    fontSize: 72,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  burgersContainer: {
    position: 'absolute',
    bottom: 80,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  burgerLeft: {
    alignItems: 'center',
  },
  burgerRight: {
    alignItems: 'center',
  },
  tripleBurgerImage: {
    width: 160,
    height: 200,
  },
  doubleBurgerImage: {
    width: 140,
    height: 180,
  },
  loadingDots: {
    position: 'absolute',
    bottom: height * 0.3,
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
});