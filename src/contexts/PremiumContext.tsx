import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { PremiumContextType, PremiumFeature, IAPProduct } from '../types';

// Initialize MMKV storage
const storage = new MMKV();

// Create context
const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

// Premium features definition
const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'custom_durations',
    name: 'Custom Session Durations',
    description: 'Create sessions of any length from 1 minute to 8 hours',
    icon: '⚙️',
    available: false,
  },
  {
    id: 'ai_insights',
    name: 'AI-Powered Insights',
    description: 'Get personalized productivity recommendations powered by DreamAI',
    icon: '🤖',
    available: false,
  },
  {
    id: 'advanced_stats',
    name: 'Advanced Analytics',
    description: 'Detailed weekly/monthly reports, productivity trends, and heatmaps',
    icon: '📊',
    available: false,
  },
  {
    id: 'unlimited_sessions',
    name: 'Unlimited Sessions',
    description: 'No limits on daily sessions and session history',
    icon: '∞',
    available: false,
  },
  {
    id: 'binaural_beats',
    name: 'Binaural Beats Library',
    description: 'Access to premium focus sounds and binaural frequencies',
    icon: '🎵',
    available: false,
  },
  {
    id: 'team_features',
    name: 'Team Collaboration',
    description: 'Join teams, sync sessions, and compete with friends',
    icon: '👥',
    available: false,
  },
  {
    id: 'calendar_integration',
    name: 'Calendar Integration',
    description: 'Auto-block calendar time and sync with your schedule',
    icon: '📅',
    available: false,
  },
  {
    id: 'export_data',
    name: 'Data Export',
    description: 'Export your productivity data to CSV, PDF, or connect to other apps',
    icon: '📤',
    available: false,
  },
];

// IAP Products
const IAP_PRODUCTS: IAPProduct[] = [
  {
    productId: 'timebox_pro_lifetime',
    price: '$1.99',
    currency: 'USD',
    title: 'TimeBox Pro - Lifetime',
    description: 'Unlock all premium features forever. One-time payment, no subscriptions.',
    type: 'non_consumable',
  },
];

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const [isPro, setIsPro] = useState(false);
  const [features, setFeatures] = useState<PremiumFeature[]>(PREMIUM_FEATURES);
  const [products] = useState<IAPProduct[]>(IAP_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  // Load premium status on mount
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  // Update features availability when premium status changes
  useEffect(() => {
    updateFeaturesAvailability();
  }, [isPro]);

  const loadPremiumStatus = async () => {
    try {
      // Check stored premium status
      const storedStatus = storage.getBoolean('is_pro');
      const purchaseDate = storage.getString('purchase_date');
      
      // For development/demo, uncomment this to test pro features:
      // setIsPro(true);
      // storage.set('is_pro', true);
      
      setIsPro(storedStatus || false);
      
      // Log premium status for debugging
      if (storedStatus) {
        console.log('TimeBox Pro user detected, purchased on:', purchaseDate);
      } else {
        console.log('Free TimeBox user');
      }
      
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeaturesAvailability = () => {
    const updatedFeatures = PREMIUM_FEATURES.map(feature => ({
      ...feature,
      available: isPro,
    }));
    setFeatures(updatedFeatures);
  };

  const requestUpgrade = () => {
    const proFeaturesList = [
      '🤖 AI-powered insights by DreamAI',
      '📊 Advanced analytics & heatmaps',
      '⚙️ Custom session durations',
      '🎵 Premium focus sounds',
      '👥 Team collaboration features',
      '📅 Calendar integration',
      '📤 Data export capabilities',
      '∞ Unlimited sessions & history'
    ].join('\n');

    Alert.alert(
      '🚀 Upgrade to TimeBox Pro',
      `Unlock the full power of TimeBox and support indie development!\n\n${proFeaturesList}\n\n💎 One-time payment • No subscriptions • Lifetime access`,
      [
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
        {
          text: 'Restore Purchases',
          style: 'default',
          onPress: restorePurchases,
        },
        {
          text: 'Upgrade for $1.99',
          style: 'default',
          onPress: () => purchaseProduct('timebox_pro_lifetime'),
        },
      ],
      { cancelable: true }
    );
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock purchase flow for development
      // In production, this would use react-native-iap
      
      return new Promise((resolve) => {
        Alert.alert(
          '💳 Purchase TimeBox Pro',
          'This is a development build. Would you like to simulate a successful purchase to test Pro features?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setIsLoading(false);
                resolve(false);
              },
            },
            {
              text: 'Simulate Success',
              style: 'default',
              onPress: () => {
                // Simulate successful purchase
                handleSuccessfulPurchase(productId);
                setIsLoading(false);
                resolve(true);
              },
            },
          ]
        );
      });
      
    } catch (error) {
      console.error('Purchase error:', error);
      
      Alert.alert(
        'Purchase Failed',
        'Sorry, we couldn\'t complete your purchase. Please try again or contact support at support@dreamai.app.',
        [{ text: 'OK' }]
      );
      
      setIsLoading(false);
      return false;
    }
  };

  const handleSuccessfulPurchase = (productId: string) => {
    try {
      // Store premium status
      storage.set('is_pro', true);
      storage.set('purchase_date', new Date().toISOString());
      storage.set('product_id', productId);
      
      // Update state
      setIsPro(true);
      
      // Show success message
      Alert.alert(
        '🎉 Welcome to TimeBox Pro!',
        'Thank you for supporting TimeBox! All premium features are now unlocked. You\'re now part of the DreamAI family! 🚀\n\nEnjoy enhanced productivity with AI-powered insights!',
        [{ text: 'Awesome!' }]
      );
      
      // Track purchase event (for analytics)
      trackPurchaseEvent(productId);
      
    } catch (error) {
      console.error('Error handling successful purchase:', error);
    }
  };

  const restorePurchases = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Mock restore for development
      // In production, this would check with the app store
      
      const hasExistingPurchase = storage.getBoolean('is_pro');
      
      if (hasExistingPurchase) {
        setIsPro(true);
        Alert.alert(
          '✅ Purchases Restored',
          'Your TimeBox Pro features have been restored successfully! Welcome back!',
          [{ text: 'Great!' }]
        );
      } else {
        // Simulate checking app store
        Alert.alert(
          '🔍 No Purchases Found',
          'No previous purchases found for this Apple ID / Google account.\n\nIf you believe this is an error, please contact support at support@dreamai.app.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Restore purchases error:', error);
      
      Alert.alert(
        'Restore Failed',
        'We couldn\'t restore your purchases. Please try again or contact support at support@dreamai.app.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const trackPurchaseEvent = (productId: string) => {
    // Track purchase for analytics
    const purchaseData = {
      product_id: productId,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      app_version: '1.0.0',
      user_id: storage.getString('device_id') || 'anonymous',
    };
    
    console.log('🎯 Purchase event tracked:', purchaseData);
    
    // In production, send to analytics service
    // Analytics.track('premium_purchase', purchaseData);
    // Mixpanel.track('TimeBox Pro Purchased', purchaseData);
  };

  // Context value
  const contextValue: PremiumContextType = {
    isPro,
    features,
    products,
    requestUpgrade,
    restorePurchases,
    purchaseProduct,
  };

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
};

// Custom hook to use premium context
export const usePremiumContext = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremiumContext must be used within a PremiumProvider');
  }
  return context;
};

// Helper functions for feature checks
export const useFeatureCheck = () => {
  const { isPro, features } = usePremiumContext();
  
  const hasFeature = (featureId: string): boolean => {
    if (!isPro) return false;
    return features.find(f => f.id === featureId)?.available || false;
  };

  return {
    hasFeature,
    canUseCustomDurations: () => hasFeature('custom_durations'),
    canUseAIInsights: () => hasFeature('ai_insights'),
    canUseAdvancedStats: () => hasFeature('advanced_stats'),
    canUseBinauralBeats: () => hasFeature('binaural_beats'),
    canUseTeamFeatures: () => hasFeature('team_features'),
    canUseCalendarIntegration: () => hasFeature('calendar_integration'),
    canExportData: () => hasFeature('export_data'),
  };
};

export default PremiumContext;