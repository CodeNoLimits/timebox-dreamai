import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DreamAIScreen from './src/screens/DreamAIScreen';

// Import Colors
import { DREAMAI_COLORS, NAVIGATION_THEME } from './src/constants/colors';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Navigation Types
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: DREAMAI_COLORS.primary,
        tabBarInactiveTintColor: DREAMAI_COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: DREAMAI_COLORS.surface,
          borderTopColor: DREAMAI_COLORS.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ tabBarLabel: 'Stats' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={{ 
          fontSize: 42, 
          fontWeight: 'bold', 
          color: DREAMAI_COLORS.text,
          marginBottom: 8 
        }}>
          TimeBox
        </Text>
        <Text style={{ 
          fontSize: 18, 
          color: DREAMAI_COLORS.primary,
          marginBottom: 40,
          fontWeight: '600'
        }}>
          by DreamAI
        </Text>
        <ActivityIndicator size="large" color={DREAMAI_COLORS.primary} />
        <Text style={{ 
          fontSize: 14, 
          color: DREAMAI_COLORS.textSecondary,
          marginTop: 20,
          textAlign: 'center'
        }}>
          Loading your productivity dashboard...
        </Text>
      </View>
    </LinearGradient>
  );
}

// Placeholder screens for development
function StatsScreen() {
  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 24, color: DREAMAI_COLORS.text, fontWeight: 'bold' }}>
        📊 Stats Coming Soon
      </Text>
      <Text style={{ fontSize: 16, color: DREAMAI_COLORS.textSecondary, marginTop: 10 }}>
        Advanced analytics and insights
      </Text>
    </LinearGradient>
  );
}

function SettingsScreen() {
  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 24, color: DREAMAI_COLORS.text, fontWeight: 'bold' }}>
        ⚙️ Settings Coming Soon
      </Text>
      <Text style={{ fontSize: 16, color: DREAMAI_COLORS.textSecondary, marginTop: 10 }}>
        Customize your TimeBox experience
      </Text>
    </LinearGradient>
  );
}

function DreamAIScreen() {
  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 32, marginBottom: 20 }}>🚀</Text>
      <Text style={{ fontSize: 24, color: DREAMAI_COLORS.text, fontWeight: 'bold' }}>
        DreamAI Ecosystem
      </Text>
      <Text style={{ fontSize: 16, color: DREAMAI_COLORS.textSecondary, marginTop: 10, textAlign: 'center', paddingHorizontal: 40 }}>
        TimeBox is just the beginning. Discover the full suite of AI-powered productivity tools.
      </Text>
    </LinearGradient>
  );
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }

      // Setup default preferences
      console.log('Setting up TimeBox...');
      
      // Simulate loading time for smooth experience
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
      await SplashScreen.hideAsync();
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={NAVIGATION_THEME}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="DreamAI" 
            component={DreamAIScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
