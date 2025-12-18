import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodgoApp() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());

  const categories = ['All', 'Combos', 'Sliders', 'Chicken'];

  const foodItems = [
    {
      id: 1,
      name: 'Cheeseburger',
      description: "Wendy's Burger",
      rating: 4.9,
      image: require('../../assets/images/image6.png'),
    },
    {
      id: 2,
      name: 'Hamburger',
      description: 'Veggie Burger',
      rating: 4.8,
      image: require('../../assets/images/image6.png'),
    },
    {
      id: 3,
      name: 'Hamburger',
      description: 'Chicken Burger',
      rating: 4.6,
      image: require('../../assets/images/image6.png'),
    },
    {
      id: 4,
      name: 'Hamburger',
      description: 'Fried Chicken Burger',
      rating: 4.5,
      image: require('../../assets/images/image6.png'),
    },
  ];

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>Foodgo</Text>
            <Text style={styles.tagline}>Order your favourite food!</Text>
          </View>
          <View style={styles.profilePic}>
            {/* Replace with actual profile image */}
            <View style={styles.profilePlaceholder} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food Grid */}
        <View style={styles.foodGrid}>
          {foodItems.map((item) => (
            <View key={item.id} style={styles.foodCard}>
              <View style={styles.imageContainer}>
                {/* Replace with actual Image component */}
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.burgerEmoji}>🍔</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDescription}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFA500" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Ionicons
                      name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={favorites.has(item.id) ? '#EF2A39' : '#666'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
    fontFamily: 'cursive',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
  },
  menuButton: {
    backgroundColor: '#EF2A39',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#EF2A39',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 100,
  },
  foodCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  burgerEmoji: {
    fontSize: 60,
  },
  cardContent: {
    padding: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
});