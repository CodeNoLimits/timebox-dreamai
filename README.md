# 🚀 TimeBox by DreamAI

**The Most Beautiful Productivity Timer App - Built with React Native & Expo**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.79-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

> Transform your productivity with visual timeboxing, AI insights, and beautiful animations. The first app in the DreamAI ecosystem.

## ✨ Features

### 🎯 **Core Features**
- **Visual Circular Timer** - Beautiful animated progress with particles and glow effects
- **4 Session Types** - Quick (15m), Focus (25m), Deep (45m), Ultra (90m)
- **Real-time Stats** - Track sessions, time, streaks, and productivity scores
- **Smart Persistence** - Resume sessions even after app restart
- **Haptic Feedback** - Tactile responses for all interactions
- **Push Notifications** - Session completion alerts

### 💎 **TimeBox Pro Features**
- **🤖 AI Insights** - Personalized productivity recommendations by DreamAI
- **📊 Advanced Analytics** - Weekly heatmaps and trend analysis
- **⚙️ Custom Sessions** - Any duration from 1 minute to 8 hours
- **🎵 Premium Sounds** - Binaural beats and focus audio
- **👥 Team Features** - Collaborate and compete with friends
- **📅 Calendar Sync** - Auto-block time in your calendar
- **📤 Data Export** - CSV/PDF exports and API integrations

### 🎨 **Design Excellence**
- **Glassmorphism UI** - Modern translucent design language
- **DreamAI Branding** - Consistent purple/violet gradient theme
- **60 FPS Animations** - Smooth Reanimated 3 powered transitions
- **Dark Theme** - Eye-friendly design for focus sessions
- **Responsive Layout** - Perfect on all screen sizes

## 📱 Screenshots

> Coming soon - Beautiful screenshots showcasing the app's interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/dreamai/timebox-dreamai.git
cd timebox-dreamai

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### 🛠️ Development Setup

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI for builds
npm install -g eas-cli

# Login to Expo (optional)
expo login

# Start development
npm start
```

## 🏗️ Architecture

### 📁 Project Structure
```
timebox-dreamai/
├── src/
│   ├── components/
│   │   ├── Timer/          # Circular timer with animations
│   │   ├── Stats/          # Analytics components
│   │   ├── DreamAI/        # AI insights components
│   │   └── common/         # Reusable UI components
│   ├── screens/            # Main app screens
│   ├── hooks/              # Custom React hooks
│   │   ├── useTimer.ts     # Timer logic and persistence
│   │   ├── usePremium.ts   # IAP and premium features
│   │   └── useStats.ts     # Analytics and insights
│   ├── contexts/           # React contexts
│   ├── services/           # API and storage services
│   ├── constants/          # Colors, configs, types
│   └── types/              # TypeScript definitions
├── assets/                 # Images, fonts, sounds
└── App.tsx                 # Root component
```

### 🧪 Tech Stack
- **Framework**: React Native 0.79 with Expo 53
- **Language**: TypeScript 5.8
- **Navigation**: React Navigation 7
- **Animations**: Reanimated 3
- **Storage**: MMKV (fast key-value storage)
- **State**: Context API + hooks
- **UI**: Custom components with glassmorphism
- **Icons**: Expo Vector Icons
- **Gradients**: Expo Linear Gradient

## 🎯 Usage

### Starting a Session
1. Choose your session type (Quick, Focus, Deep, Ultra)
2. Tap the "Start Session" button
3. Watch the beautiful circular timer animate
4. Get notified when your session completes

### Premium Features
- Tap "Upgrade to Pro" to unlock AI insights
- One-time $1.99 payment, no subscriptions
- Instant access to all premium features

### AI Insights (Pro)
TimeBox analyzes your productivity patterns and provides:
- Optimal session duration recommendations
- Best time-of-day analysis
- Energy level predictions
- Personalized productivity tips

## 📊 Stats & Analytics

Track your productivity with:
- **Daily Stats**: Sessions completed, total time, current streak
- **Productivity Score**: AI-calculated 0-100 score
- **Weekly Heatmap**: GitHub-style activity visualization
- **Trends**: Compare week-over-week performance

## 🛒 Monetization

TimeBox follows a **freemium model**:
- **Free**: 4 preset session types, basic stats, 50 sessions/month
- **Pro ($1.99 one-time)**: Unlimited everything + AI features

## 🚢 Deployment

### Building for Production

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production

# Both platforms
eas build --platform all --profile production
```

### Store Submission

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

## 🧬 DreamAI Ecosystem

TimeBox is the **first app** in the DreamAI productivity ecosystem:

- **TimeBox** - Visual timeboxing and focus sessions
- **MindMap AI** - AI-powered mind mapping (coming soon)
- **TaskFlow** - Intelligent task management (coming soon)
- **Focus Suite** - Complete productivity platform (coming soon)

All apps share the same beautiful design language and DreamAI intelligence.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow the established TypeScript patterns
- Maintain 60 FPS animations
- Use DreamAI color scheme consistently
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- **Email**: support@dreamai.app
- **Twitter**: [@DreamAIApps](https://twitter.com/DreamAIApps)
- **Website**: [dreamai.app/timebox](https://dreamai.app/timebox)

## 🎉 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the powerful framework
- **Design Inspiration** - Apple's Human Interface Guidelines
- **Beta Testers** - Early users who helped shape TimeBox

---

**Built with ❤️ by the DreamAI Team**

*Transform your productivity. One session at a time.* 🚀