import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      </View>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {/* Bot */}
        <BotBubble text="Hi, how can I help you?" />

        {/* User */}
        <UserBubble text="Hello, I ordered two fried chicken burgers, can I know how much time it will get to arrive?" />

        {/* Bot */}
        <BotBubble text="Ok, please let me check!" />

        {/* User */}
        <UserBubble text="Sure..." />

        {/* Bot */}
        <BotBubble text="It’ll get 25 minutes to arrive to your address" />

        <Text style={styles.time}>26 minutes ago</Text>

        {/* User */}
        <UserBubble text="Ok, thanks for your support" />
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Type here..."
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

const BotBubble = ({ text }: { text: string }) => (
  <View style={styles.botRow}>
    <View style={styles.botAvatar}>
      <Ionicons name="person" size={16} color="#fff" />
    </View>
    <View style={styles.botBubble}>
      <Text style={styles.botText}>{text}</Text>
    </View>
  </View>
);

const UserBubble = ({ text }: { text: string }) => (
  <View style={styles.userRow}>
    <View style={styles.userBubble}>
      <Text style={styles.userText}>{text}</Text>
    </View>
    <Image
      source={{ uri: "https://i.pravatar.cc/100" }}
      style={styles.userAvatar}
    />
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  messages: {
    padding: 16,
    paddingBottom: 30,
  },

  /* Bot */
  botRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  botBubble: {
    backgroundColor: "#F1F1F1",
    padding: 12,
    borderRadius: 14,
    maxWidth: "70%",
  },

  botText: {
    color: "#000",
    fontSize: 14,
  },

  /* User */
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  userBubble: {
    backgroundColor: "#EF2A39",
    padding: 12,
    borderRadius: 14,
    maxWidth: "70%",
    marginRight: 8,
  },

  userText: {
    color: "#fff",
    fontSize: 14,
  },

  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  time: {
    textAlign: "center",
    color: "#999",
    fontSize: 11,
    marginVertical: 6,
  },

  /* Input */
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },

  sendBtn: {
    marginLeft: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EF2A39",
    justifyContent: "center",
    alignItems: "center",
  },
});
