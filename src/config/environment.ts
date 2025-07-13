// Environment configuration for TimeBox by DreamAI
export interface EnvironmentConfig {
  // Application
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  
  // API
  apiUrl: string;
  apiVersion: string;
  apiTimeout: number;
  
  // Authentication
  authDomain: string;
  googleClientId?: string;
  appleClientId?: string;
  
  // Analytics
  sentryDsn?: string;
  mixpanelToken?: string;
  gaTrackingId?: string;
  
  // AI Services
  openaiApiKey?: string;
  aiModel: string;
  aiMaxTokens: number;
  
  // Premium
  stripePublishableKey?: string;
  iapSharedSecret?: string;
  premiumPrice: string;
  
  // Team Collaboration
  websocketUrl: string;
  pusherAppId?: string;
  pusherKey?: string;
  pusherSecret?: string;
  pusherCluster: string;
  
  // Storage & Export
  awsRegion: string;
  s3Bucket: string;
  cloudfrontUrl: string;
  
  // Feature Flags
  enableAIInsights: boolean;
  enableBinauralBeats: boolean;
  enableTeamCollaboration: boolean;
  enableExportFeatures: boolean;
  enablePremiumFeatures: boolean;
  
  // Debug
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enablePerformanceMonitoring: boolean;
  
  // Social & Support
  facebookAppId?: string;
  twitterHandle: string;
  linkedinUrl: string;
  supportEmail: string;
  docsUrl: string;
  feedbackUrl: string;
}

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

// Helper function to get boolean environment variable
const getBooleanEnv = (key: string, fallback: boolean = false): boolean => {
  const value = getEnvVar(key).toLowerCase();
  return value === 'true' || value === '1';
};

// Helper function to get number environment variable
const getNumberEnv = (key: string, fallback: number): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Environment configuration
export const config: EnvironmentConfig = {
  // Application
  appName: getEnvVar('EXPO_PUBLIC_APP_NAME', 'TimeBox by DreamAI'),
  appVersion: getEnvVar('EXPO_PUBLIC_APP_VERSION', '3.0.0'),
  environment: getEnvVar('EXPO_PUBLIC_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production',
  
  // API
  apiUrl: getEnvVar('EXPO_PUBLIC_API_URL', 'https://api.timebox-dreamai.com'),
  apiVersion: getEnvVar('EXPO_PUBLIC_API_VERSION', 'v1'),
  apiTimeout: getNumberEnv('EXPO_PUBLIC_API_TIMEOUT', 10000),
  
  // Authentication
  authDomain: getEnvVar('EXPO_PUBLIC_AUTH_DOMAIN', 'auth.timebox-dreamai.com'),
  googleClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_CLIENT_ID'),
  appleClientId: getEnvVar('EXPO_PUBLIC_APPLE_CLIENT_ID'),
  
  // Analytics
  sentryDsn: getEnvVar('EXPO_PUBLIC_SENTRY_DSN'),
  mixpanelToken: getEnvVar('EXPO_PUBLIC_MIXPANEL_TOKEN'),
  gaTrackingId: getEnvVar('EXPO_PUBLIC_GA_TRACKING_ID'),
  
  // AI Services
  openaiApiKey: getEnvVar('EXPO_PUBLIC_OPENAI_API_KEY'),
  aiModel: getEnvVar('EXPO_PUBLIC_AI_MODEL', 'gpt-4'),
  aiMaxTokens: getNumberEnv('EXPO_PUBLIC_AI_MAX_TOKENS', 1000),
  
  // Premium
  stripePublishableKey: getEnvVar('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  iapSharedSecret: getEnvVar('EXPO_PUBLIC_IAP_SHARED_SECRET'),
  premiumPrice: getEnvVar('EXPO_PUBLIC_PREMIUM_PRICE', '1.99'),
  
  // Team Collaboration
  websocketUrl: getEnvVar('EXPO_PUBLIC_WEBSOCKET_URL', 'wss://ws.timebox-dreamai.com'),
  pusherAppId: getEnvVar('EXPO_PUBLIC_PUSHER_APP_ID'),
  pusherKey: getEnvVar('EXPO_PUBLIC_PUSHER_KEY'),
  pusherSecret: getEnvVar('EXPO_PUBLIC_PUSHER_SECRET'),
  pusherCluster: getEnvVar('EXPO_PUBLIC_PUSHER_CLUSTER', 'us2'),
  
  // Storage & Export
  awsRegion: getEnvVar('EXPO_PUBLIC_AWS_REGION', 'us-east-1'),
  s3Bucket: getEnvVar('EXPO_PUBLIC_S3_BUCKET', 'timebox-exports'),
  cloudfrontUrl: getEnvVar('EXPO_PUBLIC_CLOUDFRONT_URL', 'https://cdn.timebox-dreamai.com'),
  
  // Feature Flags
  enableAIInsights: getBooleanEnv('EXPO_PUBLIC_ENABLE_AI_INSIGHTS', true),
  enableBinauralBeats: getBooleanEnv('EXPO_PUBLIC_ENABLE_BINAURAL_BEATS', true),
  enableTeamCollaboration: getBooleanEnv('EXPO_PUBLIC_ENABLE_TEAM_COLLABORATION', true),
  enableExportFeatures: getBooleanEnv('EXPO_PUBLIC_ENABLE_EXPORT_FEATURES', true),
  enablePremiumFeatures: getBooleanEnv('EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES', true),
  
  // Debug
  debugMode: getBooleanEnv('EXPO_PUBLIC_DEBUG_MODE', false),
  logLevel: getEnvVar('EXPO_PUBLIC_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
  enablePerformanceMonitoring: getBooleanEnv('EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING', true),
  
  // Social & Support
  facebookAppId: getEnvVar('EXPO_PUBLIC_FACEBOOK_APP_ID'),
  twitterHandle: getEnvVar('EXPO_PUBLIC_TWITTER_HANDLE', '@TimeBoxAI'),
  linkedinUrl: getEnvVar('EXPO_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/company/dreamai'),
  supportEmail: getEnvVar('EXPO_PUBLIC_SUPPORT_EMAIL', 'support@dreamai.com'),
  docsUrl: getEnvVar('EXPO_PUBLIC_DOCS_URL', 'https://docs.timebox-dreamai.com'),
  feedbackUrl: getEnvVar('EXPO_PUBLIC_FEEDBACK_URL', 'https://feedback.timebox-dreamai.com'),
};

// Environment-specific configurations
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isStaging = config.environment === 'staging';

// API configuration
export const apiConfig = {
  baseURL: `${config.apiUrl}/${config.apiVersion}`,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': config.appVersion,
    'X-Platform': 'web',
  },
};

// Feature flags helper
export const isFeatureEnabled = (feature: keyof Pick<EnvironmentConfig, 
  'enableAIInsights' | 'enableBinauralBeats' | 'enableTeamCollaboration' | 
  'enableExportFeatures' | 'enablePremiumFeatures'>): boolean => {
  return config[feature];
};

// Logging helper
export const shouldLog = (level: 'debug' | 'info' | 'warn' | 'error'): boolean => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevelIndex = levels.indexOf(config.logLevel);
  const requestedLevelIndex = levels.indexOf(level);
  return requestedLevelIndex >= currentLevelIndex;
};

export default config;