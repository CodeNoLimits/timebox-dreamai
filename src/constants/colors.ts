/**
 * DreamAI Brand Colors - TimeBox
 * Official color palette for the DreamAI ecosystem
 */

export const DREAMAI_COLORS = {
  // Primary Brand Colors
  primary: '#6366F1',     // Indigo-500 - Main brand color
  secondary: '#8B5CF6',   // Violet-500 - Secondary accent
  
  // Status Colors
  success: '#10B981',     // Emerald-500 - Success states
  warning: '#F59E0B',     // Amber-500 - Warning states  
  error: '#EF4444',       // Red-500 - Error states
  info: '#3B82F6',        // Blue-500 - Info states
  
  // Background Colors
  background: '#0F172A',  // Slate-900 - Main background
  surface: '#1E293B',     // Slate-800 - Card/surface background
  surfaceLight: '#334155', // Slate-700 - Lighter surface
  surfaceHover: '#475569', // Slate-600 - Hover states
  
  // Text Colors
  text: '#F8FAFC',        // Slate-50 - Primary text
  textSecondary: '#94A3B8', // Slate-400 - Secondary text
  textMuted: '#64748B',   // Slate-500 - Muted text
  textInverse: '#0F172A', // Dark text on light backgrounds
  
  // Border Colors
  border: '#334155',      // Slate-700 - Default borders
  borderLight: '#475569', // Slate-600 - Light borders
  borderFocus: '#6366F1', // Primary - Focus borders
  
  // Gradient Colors
  gradientStart: '#6366F1', // Primary gradient start
  gradientEnd: '#8B5CF6',   // Secondary gradient end
  
  // Timer Specific Colors
  timerProgress: '#6366F1', // Timer progress color
  timerBackground: '#1E293B', // Timer background
  timerGlow: '#6366F1',     // Timer glow effect
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.1)', // Glass overlay
  glassBackground: 'rgba(30, 41, 59, 0.8)', // Glass background
  glassBorder: 'rgba(255, 255, 255, 0.2)', // Glass border
  
  // Shadow Colors
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.25)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
} as const;

/**
 * Gradient definitions for consistent usage
 */
export const GRADIENTS = {
  primary: [DREAMAI_COLORS.primary, DREAMAI_COLORS.secondary],
  success: [DREAMAI_COLORS.success, '#059669'], // success to success-600
  warning: [DREAMAI_COLORS.warning, '#D97706'], // warning to warning-600
  surface: [DREAMAI_COLORS.surface, DREAMAI_COLORS.surfaceLight],
  background: [DREAMAI_COLORS.background, DREAMAI_COLORS.surface],
  timer: [DREAMAI_COLORS.timerProgress, DREAMAI_COLORS.secondary],
  glow: [DREAMAI_COLORS.timerGlow + '40', DREAMAI_COLORS.timerGlow + '00'], // 40% to 0% opacity
} as const;

/**
 * Color utilities for common operations
 */
export const ColorUtils = {
  /**
   * Add opacity to any hex color
   */
  withOpacity: (color: string, opacity: number): string => {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${alpha}`;
  },
  
  /**
   * Get glassmorphism background with opacity
   */
  glassBackground: (opacity: number = 0.1): string => {
    return `rgba(255, 255, 255, ${opacity})`;
  },
  
  /**
   * Get surface color with opacity  
   */
  surfaceWithOpacity: (opacity: number = 0.8): string => {
    const rgb = hexToRgb(DREAMAI_COLORS.surface);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },
} as const;

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Theme configuration for React Navigation
 */
export const NAVIGATION_THEME = {
  dark: true,
  colors: {
    primary: DREAMAI_COLORS.primary,
    background: DREAMAI_COLORS.background,
    card: DREAMAI_COLORS.surface,
    text: DREAMAI_COLORS.text,
    border: DREAMAI_COLORS.border,
    notification: DREAMAI_COLORS.primary,
  },
} as const;

export default DREAMAI_COLORS;