/**
 * TypeScript Type Definitions for TimeBox by DreamAI
 */

// Timer related types
export interface TimerSession {
  id: string;
  title: string;
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  interrupted: boolean;
  sessionType: SessionType;
}

export type SessionType = 'quick' | 'focus' | 'deep' | 'ultra' | 'custom';

export interface SessionPreset {
  id: string;
  label: string;
  minutes: number;
  icon: string;
  free: boolean;
  description?: string;
}

// Statistics types
export interface DailyStats {
  date: string; // ISO date string
  sessions: number;
  totalMinutes: number;
  completedSessions: number;
  streak: number;
  productivityScore: number;
}

export interface WeeklyStats {
  week: string; // ISO week string
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  productivityTrend: number; // -1 to 1
  heatmapData: HeatmapDay[];
}

export interface HeatmapDay {
  date: string;
  value: number; // 0-4 intensity
  sessions: number;
}

// AI Insights types
export interface AIInsight {
  id: string;
  type: 'productivity' | 'energy' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  icon: string;
  timestamp: Date;
}

export interface ProductivityPattern {
  peakHours: number[]; // Array of hours (0-23)
  optimalDuration: number; // in minutes
  energyLevels: EnergyLevel[];
  recommendations: string[];
}

export interface EnergyLevel {
  hour: number;
  energy: number; // 0-100
}

// Premium/IAP types
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface IAPProduct {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
}

// User preferences types
export interface UserPreferences {
  defaultDuration: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  workingHours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Timer: {
    duration: number;
    sessionType: SessionType;
    title: string;
  };
  Onboarding: undefined;
  DreamAI: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

// Context types
export interface TimerContextType {
  currentSession: TimerSession | null;
  isRunning: boolean;
  timeLeft: number;
  startTimer: (duration: number, type: SessionType, title: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export interface StatsContextType {
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
  allSessions: TimerSession[];
  updateSession: (session: Partial<TimerSession>) => Promise<void>;
  getStatsByDateRange: (start: Date, end: Date) => Promise<TimerSession[]>;
  exportData: () => Promise<string>;
}

export interface PremiumContextType {
  isPro: boolean;
  features: PremiumFeature[];
  products: IAPProduct[];
  requestUpgrade: () => void;
  restorePurchases: () => Promise<void>;
  purchaseProduct: (productId: string) => Promise<boolean>;
}

// Component prop types
export interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  onPress?: () => void;
}

export interface InsightCard {
  insight: AIInsight;
  onPress?: () => void;
}

// Sound types
export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  frequency?: number; // for binaural beats
  type: 'binaural' | 'ambient' | 'nature' | 'white_noise';
  free: boolean;
  fileUrl?: string;
}

// Team/Social types (for future features)
export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline';
  currentSession?: {
    type: SessionType;
    timeLeft: number;
  };
  stats: {
    totalSessions: number;
    totalTime: number;
    streak: number;
  };
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  activeSessionsCount: number;
  totalTime: number;
}

// Storage types
export interface StorageKey {
  USER_PREFERENCES: 'user_preferences';
  TIMER_SESSIONS: 'timer_sessions';
  DAILY_STATS: 'daily_stats';
  PREMIUM_STATUS: 'premium_status';
  ONBOARDING_COMPLETED: 'onboarding_completed';
  LAST_BACKUP: 'last_backup';
}

// API Response types (for future backend integration)
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// Export utility types
export type Timestamp = number;
export type ISO8601 = string;
export type HexColor = string;

// Animation types
export interface AnimationConfig {
  duration: number;
  easing?: 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut';
  delay?: number;
}

// Notification types
export interface NotificationConfig {
  title: string;
  body: string;
  sound?: boolean;
  vibrate?: boolean;
  scheduledTime?: Date;
  data?: Record<string, any>;
}

export default {};