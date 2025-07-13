import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics'; // Temporarily commented for demo
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { DREAMAI_COLORS, GRADIENTS } from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

// Constants for timer design
const TIMER_SIZE = 320;
const STROKE_WIDTH = 12;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
}

interface CircularTimerProps {
  duration: number; // Duration in minutes
  onComplete: () => void;
  onCancel: () => void;
  isPro: boolean;
  sessionTitle: string;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
  duration,
  onComplete,
  onCancel,
  isPro,
  sessionTitle,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [particles, setParticles] = useState<Particle[]>([]);

  // Animated values
  const progress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const pulseScale = useSharedValue(1);

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * TIMER_SIZE,
      y: Math.random() * TIMER_SIZE,
      opacity: useSharedValue(0),
      scale: useSharedValue(0.5),
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles when session starts
  useEffect(() => {
    if (isRunning) {
      particles.forEach((particle, index) => {
        particle.opacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: 2000 + index * 300 }),
            withTiming(0.2, { duration: 2000 + index * 300 })
          ),
          -1,
          true
        );
        particle.scale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 3000 + index * 500 }),
            withTiming(0.8, { duration: 3000 + index * 500 })
          ),
          -1,
          true
        );
      });
    } else {
      particles.forEach((particle) => {
        particle.opacity.value = withTiming(0, { duration: 500 });
        particle.scale.value = withTiming(0.5, { duration: 500 });
      });
    }
  }, [isRunning, particles]);

  // Pulse effect every 5 seconds
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        pulseScale.value = withSequence(
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
        );
        
        glowOpacity.value = withSequence(
          withTiming(0.8, { duration: 300 }),
          withTiming(0.3, { duration: 1000 })
        );
        
        // runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Update progress (0 to 1)
          const progressValue = 1 - (newTime / (duration * 60));
          progress.value = withTiming(progressValue, {
            duration: 1000,
            easing: Easing.linear,
          });
          
          if (newTime === 0) {
            runOnJS(handleComplete)();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, duration]);

  const handleComplete = () => {
    setIsRunning(false);
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const handleStartPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setIsRunning(false);
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    progress.value = withTiming(0, { duration: 300 });
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleCancel = () => {
    setIsRunning(false);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onCancel();
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Animated props for progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
    return {
      strokeDashoffset: strokeDashoffset,
    };
  });

  // Animated style for pulse effect
  const pulseStyle = {
    transform: [{ scale: pulseScale }],
  };

  // Animated style for glow effect
  const glowStyle = {
    opacity: glowOpacity,
  };

  return (
    <LinearGradient
      colors={[DREAMAI_COLORS.background, DREAMAI_COLORS.surface]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={DREAMAI_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{sessionTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Timer Container */}
      <View style={styles.timerContainer}>
        {/* Floating Particles */}
        {particles.map((particle) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
                transform: [{ scale: particle.scale }],
              },
            ]}
          >
            <View style={styles.particleDot} />
          </Animated.View>
        ))}

        {/* Glow Effect */}
        <Animated.View style={[styles.glowEffect, glowStyle]} />

        {/* Main Timer Circle */}
        <Animated.View style={[styles.timerCircle, pulseStyle]}>
          <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={styles.svgContainer}>
            <Defs>
              <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={DREAMAI_COLORS.primary} />
                <Stop offset="100%" stopColor={DREAMAI_COLORS.secondary} />
              </SvgLinearGradient>
            </Defs>
            
            {/* Background Circle */}
            <Circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke={DREAMAI_COLORS.surfaceLight}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeOpacity={0.3}
            />
            
            {/* Progress Circle */}
            <AnimatedCircle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke="url(#progressGradient)"
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeLinecap="round"
              transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
              animatedProps={animatedProps}
            />
          </Svg>

          {/* Time Display */}
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.sessionTypeText}>
              {duration}min {sessionTitle.split(' ')[0]} Session
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleReset} style={styles.secondaryButton}>
          <Ionicons name="refresh" size={24} color={DREAMAI_COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStartPause} style={styles.primaryButton}>
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.primaryButtonGradient}
          >
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={32}
              color={DREAMAI_COLORS.text}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancel} style={styles.secondaryButton}>
          <Ionicons name="stop" size={24} color={DREAMAI_COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* DreamAI Branding */}
      <View style={styles.branding}>
        <Text style={styles.brandingText}>Powered by DreamAI</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: DREAMAI_COLORS.surfaceLight,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleDot: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: DREAMAI_COLORS.primary,
    shadowColor: DREAMAI_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  glowEffect: {
    position: 'absolute',
    width: TIMER_SIZE + 40,
    height: TIMER_SIZE + 40,
    borderRadius: (TIMER_SIZE + 40) / 2,
    backgroundColor: DREAMAI_COLORS.primary,
    shadowColor: DREAMAI_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerCircle: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: DREAMAI_COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textShadowColor: DREAMAI_COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sessionTypeText: {
    fontSize: 16,
    color: DREAMAI_COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 40,
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DREAMAI_COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DREAMAI_COLORS.border,
  },
  branding: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandingText: {
    fontSize: 12,
    color: DREAMAI_COLORS.textMuted,
    opacity: 0.7,
  },
});

export default CircularTimer;