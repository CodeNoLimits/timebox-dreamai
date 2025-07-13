import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DREAMAI_COLORS, GRADIENTS } from '../constants/colors';
import { SessionType, QuickStat } from '../types';
import { useTimer } from '../hooks/useTimer';
import { usePremium } from '../hooks/usePremium';
import { useStats } from '../hooks/useStats';
import CircularTimer from '../components/Timer/CircularTimer';

const { width: screenWidth } = Dimensions.get('window');

// Session presets
const SESSION_PRESETS = [
  { id: 'quick', label: 'Quick', minutes: 15, icon: '⚡', free: true, color: DREAMAI_COLORS.success },
  { id: 'focus', label: 'Focus', minutes: 25, icon: '🎯', free: true, color: DREAMAI_COLORS.primary },
  { id: 'deep', label: 'Deep', minutes: 45, icon: '🧠', free: true, color: DREAMAI_COLORS.secondary },
  { id: 'ultra', label: 'Ultra', minutes: 90, icon: '🚀', free: false, color: DREAMAI_COLORS.warning },
];

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isPro, requestUpgrade } = usePremium();
  const { dailyStats } = useStats();
  const { currentSession, isRunning, startTimer } = useTimer();
  
  const [selectedPreset, setSelectedPreset] = useState(SESSION_PRESETS[1]); // Focus as default
  const [showTimer, setShowTimer] = useState(false);
  const [customDuration, setCustomDuration] = useState(30);

  // Generate AI insights based on current time and stats
  const generateAIInsight = (): string => {
    const hour = new Date().getHours();
    const { sessions, streak, totalMinutes } = dailyStats;

    if (!isPro) {
      return "Upgrade to Pro to unlock AI-powered productivity insights! 🤖";
    }

    if (hour < 9) {
      return "🌅 Morning energy detected! Your brain is fresh for deep work sessions.";
    } else if (hour < 12) {
      return "⚡ Peak morning productivity! Perfect time for your most challenging tasks.";
    } else if (hour < 14) {
      return "🎯 Pre-lunch focus window. Consider a 25-minute session before the afternoon dip.";
    } else if (hour < 17) {
      return sessions > 2 
        ? "🔥 You're on fire today! Maybe take a short break before your next session."
        : "📈 Afternoon focus time. Your second wind is here!";
    } else if (hour < 20) {
      return "🌆 Evening wind-down. Shorter sessions work better as your energy decreases.";
    } else {
      return "🌙 Late evening detected. Consider light tasks or tomorrow's planning.";
    }
  };

  const quickStats: QuickStat[] = [
    {
      label: 'Today',
      value: `${dailyStats.sessions}`,
      icon: '📊',
      color: DREAMAI_COLORS.primary,
      onPress: () => navigation.navigate('Stats'),
    },
    {
      label: 'Time',
      value: `${dailyStats.totalMinutes}m`,
      icon: '⏱️',
      color: DREAMAI_COLORS.secondary,
      onPress: () => navigation.navigate('Stats'),
    },
    {
      label: 'Streak',
      value: `${dailyStats.streak}`,
      icon: '🔥',
      color: DREAMAI_COLORS.warning,
      onPress: () => navigation.navigate('Stats'),
    },
    {
      label: 'AI Score',
      value: isPro ? `${dailyStats.productivityScore}%` : '?',
      icon: '🤖',
      color: DREAMAI_COLORS.success,
      onPress: () => {
        if (!isPro) {
          requestUpgrade();
        } else {
          navigation.navigate('Stats');
        }
      },
    },
  ];

  const handlePresetSelect = (preset: typeof SESSION_PRESETS[0]) => {
    if (!preset.free && !isPro) {
      Alert.alert(
        '🚀 Unlock Premium Sessions',
        `${preset.label} sessions (${preset.minutes}min) are available in TimeBox Pro!\n\nUpgrade now for unlimited session types and AI insights.`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade for $1.99', onPress: requestUpgrade },
        ]
      );
      return;
    }

    setSelectedPreset(preset);
  };

  const handleStartSession = () => {
    const sessionTitle = `${selectedPreset.label} Session`;
    startTimer(selectedPreset.minutes, selectedPreset.id as SessionType, sessionTitle);
    setShowTimer(true);
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    
    Alert.alert(
      '🎉 Session Complete!',
      `Congratulations! You've completed your ${selectedPreset.label} session.\n\nTotal sessions today: ${dailyStats.sessions + 1}`,
      [
        {
          text: 'View Stats',
          onPress: () => navigation.navigate('Stats'),
        },
        {
          text: 'Start Another',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTimerCancel = () => {
    setShowTimer(false);
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    const name = 'Focus Master'; // Could be personalized
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  // Show timer if there's an active session
  if (showTimer || (currentSession && isRunning)) {
    return (
      <CircularTimer
        duration={selectedPreset.minutes}
        onComplete={handleTimerComplete}
        onCancel={handleTimerCancel}
        isPro={isPro}
        sessionTitle={`${selectedPreset.label} Session`}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
      >
        {/* Header */}
        <LinearGradient
          colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface + '80']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.subtitle}>Ready to boost your productivity?</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('DreamAI')}
              style={styles.dreamAIButton}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.dreamAIGradient}
              >
                <Text style={styles.dreamAIEmoji}>🚀</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { borderColor: stat.color + '40' }]}
              onPress={stat.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Text style={styles.statEmoji}>{stat.icon}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session Type Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Choose Your Focus Session</Text>
          <View style={styles.presetsGrid}>
            {SESSION_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetCard,
                  selectedPreset.id === preset.id && styles.selectedPreset,
                  !preset.free && !isPro && styles.lockedPreset,
                ]}
                onPress={() => handlePresetSelect(preset)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={selectedPreset.id === preset.id 
                    ? [preset.color + '20', preset.color + '10']
                    : [DREAMAI_COLORS.surface, DREAMAI_COLORS.surfaceLight]
                  }
                  style={styles.presetGradient}
                >
                  <Text style={styles.presetIcon}>{preset.icon}</Text>
                  <Text style={styles.presetLabel}>{preset.label}</Text>
                  <Text style={styles.presetDuration}>{preset.minutes}min</Text>
                  
                  {!preset.free && !isPro && (
                    <View style={styles.proBadge}>
                      <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <TouchableOpacity
          style={styles.aiInsightsCard}
          onPress={() => {
            if (!isPro) {
              requestUpgrade();
            } else {
              navigation.navigate('Stats');
            }
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isPro 
              ? [DREAMAI_COLORS.primary + '20', DREAMAI_COLORS.secondary + '20']
              : [DREAMAI_COLORS.surface, DREAMAI_COLORS.surfaceLight]
            }
            style={styles.aiInsightsGradient}
          >
            <View style={styles.aiInsightsHeader}>
              <Text style={styles.aiInsightsTitle}>🤖 AI Insights</Text>
              <View style={styles.poweredByBadge}>
                <Text style={styles.poweredByText}>by DreamAI</Text>
              </View>
            </View>
            <Text style={styles.aiInsightsText}>
              {generateAIInsight()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Upgrade Card for Free Users */}
        {!isPro && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={requestUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.upgradeGradient}
            >
              <Text style={styles.upgradeTitle}>🚀 Unlock TimeBox Pro</Text>
              <Text style={styles.upgradeSubtitle}>
                AI insights • Custom sessions • Advanced stats • Premium sounds
              </Text>
              <View style={styles.upgradePrice}>
                <Text style={styles.upgradePriceText}>One-time $1.99</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSession}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>
              Start {selectedPreset.label} Session ({selectedPreset.minutes}m)
            </Text>
            <Ionicons name="play" size={24} color={DREAMAI_COLORS.text} style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* DreamAI Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={styles.footerText}>Part of the DreamAI Ecosystem</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DreamAI')}>
          <Text style={styles.footerLink}>Learn More →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DREAMAI_COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: DREAMAI_COLORS.textSecondary,
    marginTop: 4,
  },
  dreamAIButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  dreamAIGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dreamAIEmoji: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: DREAMAI_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 90,
    justifyContent: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: DREAMAI_COLORS.textSecondary,
    marginTop: 2,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
    marginBottom: 16,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: (screenWidth - 56) / 2, // 2 cards per row with gaps
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedPreset: {
    transform: [{ scale: 1.02 }],
  },
  lockedPreset: {
    opacity: 0.7,
  },
  presetGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  presetIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DREAMAI_COLORS.text,
    marginBottom: 4,
  },
  presetDuration: {
    fontSize: 14,
    color: DREAMAI_COLORS.textSecondary,
  },
  proBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: DREAMAI_COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  aiInsightsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiInsightsGradient: {
    padding: 20,
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiInsightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  poweredByBadge: {
    backgroundColor: DREAMAI_COLORS.primary + '40',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  poweredByText: {
    fontSize: 11,
    color: DREAMAI_COLORS.primary,
    fontWeight: '600',
  },
  aiInsightsText: {
    fontSize: 14,
    color: DREAMAI_COLORS.text,
    lineHeight: 20,
  },
  upgradeCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
    marginBottom: 8,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: DREAMAI_COLORS.text,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradePrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradePriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  startButton: {
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  startButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: DREAMAI_COLORS.textMuted,
  },
  footerLink: {
    fontSize: 14,
    color: DREAMAI_COLORS.primary,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default HomeScreen;