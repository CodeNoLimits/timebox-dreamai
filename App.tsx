import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// DreamAI Brand Colors
const DREAMAI_COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

// Session presets
const SESSION_PRESETS = [
  { id: 'quick', label: 'Quick', minutes: 15, icon: '⚡', color: DREAMAI_COLORS.success },
  { id: 'focus', label: 'Focus', minutes: 25, icon: '🎯', color: DREAMAI_COLORS.primary },
  { id: 'deep', label: 'Deep', minutes: 45, icon: '🧠', color: DREAMAI_COLORS.secondary },
  { id: 'ultra', label: 'Ultra', minutes: 90, icon: '🚀', color: DREAMAI_COLORS.warning },
];

// Simple Timer Component
const SimpleTimer: React.FC<{
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
  sessionTitle: string;
}> = ({ duration, onComplete, onCancel, sessionTitle }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (duration * 60));
  const progressAngle = progress * 360;

  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={styles.timerContainer}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.timerHeader}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={DREAMAI_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.timerTitle}>{sessionTitle}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Timer Circle */}
      <View style={styles.timerCircleContainer}>
        <LinearGradient
          colors={[DREAMAI_COLORS.primary, DREAMAI_COLORS.secondary]}
          style={[styles.timerCircle, { 
            transform: [{ rotate: `${progressAngle}deg` }],
            opacity: progress > 0 ? 1 : 0.3
          }]}
        >
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerSubtext}>{duration}min session</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Controls */}
      <View style={styles.timerControls}>
        <TouchableOpacity 
          onPress={() => setTimeLeft(duration * 60)} 
          style={styles.controlButton}
        >
          <Ionicons name="refresh" size={24} color={DREAMAI_COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRunning(!isRunning)}
          style={styles.playButton}
        >
          <LinearGradient
            colors={[DREAMAI_COLORS.primary, DREAMAI_COLORS.secondary]}
            style={styles.playButtonGradient}
          >
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={32}
              color={DREAMAI_COLORS.text}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} style={styles.controlButton}>
          <Ionicons name="stop" size={24} color={DREAMAI_COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.brandingText}>Powered by DreamAI</Text>
    </LinearGradient>
  );
};

// Main App Component
export default function App() {
  const [selectedPreset, setSelectedPreset] = useState(SESSION_PRESETS[1]);
  const [showTimer, setShowTimer] = useState(false);
  const [todaySessions, setTodaySessions] = useState(0);

  const handleStartSession = () => {
    setShowTimer(true);
  };

  const handleSessionComplete = () => {
    setShowTimer(false);
    setTodaySessions(prev => prev + 1);
    
    Alert.alert(
      '🎉 Session Complete!',
      `Great job! You've completed ${todaySessions + 1} sessions today.`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  const handleSessionCancel = () => {
    setShowTimer(false);
  };

  if (showTimer) {
    return (
      <SimpleTimer
        duration={selectedPreset.minutes}
        onComplete={handleSessionComplete}
        onCancel={handleSessionCancel}
        sessionTitle={`${selectedPreset.label} Session`}
      />
    );
  }

  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to TimeBox!</Text>
            <Text style={styles.subtitle}>by DreamAI - Ready to focus?</Text>
          </View>
          <View style={styles.dreamAIBadge}>
            <Text style={styles.dreamAIEmoji}>🚀</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{todaySessions}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={styles.statValue}>{todaySessions * 25}m</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🤖</Text>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>AI Score</Text>
          </View>
        </View>

        {/* Session Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Focus Session</Text>
          <View style={styles.presetsGrid}>
            {SESSION_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetCard,
                  selectedPreset.id === preset.id && styles.selectedPreset,
                ]}
                onPress={() => setSelectedPreset(preset)}
              >
                <Text style={styles.presetIcon}>{preset.icon}</Text>
                <Text style={styles.presetLabel}>{preset.label}</Text>
                <Text style={styles.presetDuration}>{preset.minutes}min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.aiCard}>
          <LinearGradient
            colors={[DREAMAI_COLORS.primary + '20', DREAMAI_COLORS.secondary + '20']}
            style={styles.aiCardGradient}
          >
            <View style={styles.aiHeader}>
              <Text style={styles.aiTitle}>🤖 AI Insights</Text>
              <Text style={styles.aiPowered}>by DreamAI</Text>
            </View>
            <Text style={styles.aiText}>
              Your productivity peaks at 2-4 PM. Perfect time for a {selectedPreset.label.toLowerCase()} session!
            </Text>
          </LinearGradient>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
          <LinearGradient
            colors={[DREAMAI_COLORS.primary, DREAMAI_COLORS.secondary]}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>
              Start {selectedPreset.label} Session ({selectedPreset.minutes}m)
            </Text>
            <Ionicons name="play" size={24} color={DREAMAI_COLORS.text} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Part of the DreamAI Ecosystem</Text>
          <Text style={styles.footerSubtext}>Transform your productivity with AI</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  dreamAIBadge: {
    width: 50,
    height: 50,
    backgroundColor: DREAMAI_COLORS.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dreamAIEmoji: {
    fontSize: 24,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: DREAMAI_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DREAMAI_COLORS.surfaceLight,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 8,
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
  section: {
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
    width: (screenWidth - 56) / 2,
    backgroundColor: DREAMAI_COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: DREAMAI_COLORS.primary,
    backgroundColor: DREAMAI_COLORS.primary + '20',
  },
  presetIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DREAMAI_COLORS.text,
  },
  presetDuration: {
    fontSize: 14,
    color: DREAMAI_COLORS.textSecondary,
    marginTop: 2,
  },
  aiCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiCardGradient: {
    padding: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  aiPowered: {
    fontSize: 12,
    color: DREAMAI_COLORS.primary,
    backgroundColor: DREAMAI_COLORS.primary + '40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiText: {
    fontSize: 14,
    color: DREAMAI_COLORS.text,
    lineHeight: 20,
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
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: DREAMAI_COLORS.textMuted,
  },
  footerSubtext: {
    fontSize: 12,
    color: DREAMAI_COLORS.textMuted,
    marginTop: 4,
  },
  
  // Timer Styles
  timerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: DREAMAI_COLORS.surfaceLight,
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
  },
  timerCircleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DREAMAI_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerInner: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: DREAMAI_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  timerSubtext: {
    fontSize: 16,
    color: DREAMAI_COLORS.textSecondary,
    marginTop: 8,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginTop: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DREAMAI_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DREAMAI_COLORS.surfaceLight,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingText: {
    fontSize: 12,
    color: DREAMAI_COLORS.textMuted,
    marginTop: 20,
    opacity: 0.7,
  },
});