# Framer Auction Market 🛒📱

A modern **mobile auction marketplace** built with **React Native (Expo)**, designed for smooth animations, real-time bidding experience, and a clean user interface. The app allows users to browse auctions, place bids, track active auctions, and manage listings with an intuitive UX powered by **Framer Motion–style animations** and Expo tooling.

---

## ✨ Features

* 🔐 User Authentication (Login / Register)
* 🛍️ Browse Live Auctions
* ⏱️ Real-Time Bidding Experience
* 🧾 Product Listing & Auction Details
* ❤️ Wishlist / Favorites
* 👤 User Profile & My Auctions
* 🎨 Smooth Animations (Framer-style transitions)
* 🌙 Light & Dark Mode Support
* 📱 Fully Responsive (Android & iOS)

---

## 🛠️ Tech Stack

* **React Native** (Expo)
* **Expo Router / React Navigation**
* **Framer Motion / Reanimated** (for animations)
* **TypeScript**
* **Context API / Redux / Zustand** (state management)
* **REST API / Firebase / Supabase** (backend – optional)
* **Expo Secure Store** (auth tokens)

---

## 📦 Installation

### Prerequisites

* Node.js (>= 18)
* Expo CLI
* Android Studio / Xcode (for emulator)

```bash
npm install -g expo-cli
```

### Clone the Repository

```bash
git clone https://github.com/your-username/framer-auction-market.git
cd framer-auction-market
```

### Install Dependencies

```bash
npm install
```

### Start the App

```bash
npx expo start
```

Scan the QR code using **Expo Go** app or run on an emulator.

---

## 📁 Project Structure

```bash
src/
 ├── components/     # Reusable UI components
 ├── screens/        # App screens
 ├── navigation/     # Navigation setup
 ├── context/        # Global state
 ├── services/       # API services
 ├── hooks/          # Custom hooks
 ├── assets/         # Images & icons
 └── utils/          # Helper functions
```

---

## 🎞️ Animations

The app uses **Framer-inspired animations** for:

* Screen transitions
* Card hover / press effects
* Auction countdown effects
* Modal & bottom-sheet animations

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.example.com
```

---

## 🚀 Build for Production

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```

or using EAS:

```bash
eas build
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`feature/new-feature`)
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

For questions or collaboration:

* Email: [your@email.com](mailto:your@email.com)
* GitHub: [https://github.com/your-username](https://github.com/your-username)

---

**Framer Auction Market** – Bid Smart. Win Fast. 🚀
