import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#EF2A39", // soft beige
          height: 65,
          borderTopWidth: 0,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.active]}>
              <Entypo
                name="home"
                size={22}
                color={focused ? "#EF2A39" : "#fff"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.active]}>
              <FontAwesome
                name="shopping-cart"
                size={22}
                color={focused ? "#EF2A39" : "#fff"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.active]}>
              <Ionicons
                name="heart"
                size={22}
                color={focused ? "#EF2A39" : "#fff"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.active]}>
              <AntDesign
                name="user"
                size={22}
                color={focused ? "#EF2A39" : "#fff"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    borderRadius: 50,
    marginTop:29
  },
  active: {
    backgroundColor: "#F3F0E3", // light circle behind active icon
  },
});
