import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FoodgoLoading() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Slide up burgers
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Bouncing dots animation
    const createBounceAnimation = (animValue, delay) => {
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

    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      console.log('Loading complete - navigate to main app');
      // Add your navigation logic here
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>Foodgo</Text>
      </Animated.View>

      {/* Burgers */}
      <Animated.View 
        style={[
          styles.burgersContainer, 
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.burgerLeft}>
          <Image 
            source={require('@/assets/images/image1.png')} 
            style={styles.tripleBurgerImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.burgerRight}>
          <Image 
            source={require('@/assets/images/image2.png')} 
            style={styles.doubleBurgerImage}
            resizeMode="contain"
          />
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF4757',
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.4,
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
    bottom: 40,
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