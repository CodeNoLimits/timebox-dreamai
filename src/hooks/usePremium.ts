import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { PremiumFeature, IAPProduct } from '../types';

// Initialize MMKV storage
const storage = new MMKV();

interface UsePremiumReturn {
  isPro: boolean;
  features: PremiumFeature[];
  products: IAPProduct[];
  isLoading: boolean;
  requestUpgrade: () => void;
  restorePurchases: () => Promise<void>;
  purchaseProduct: (productId: string) => Promise<boolean>;
}

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

// IAP Products (mock for now, real implementation would use react-native-iap)
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

export const usePremium = (): UsePremiumReturn => {
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
      
      // For development/demo, you can uncomment this to test pro features:
      // setIsPro(true);
      
      setIsPro(storedStatus || false);
      
      // Log premium status for debugging
      if (storedStatus) {
        console.log('Premium user detected, purchased on:', purchaseDate);
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
    Alert.alert(
      '🚀 Upgrade to TimeBox Pro',
      'Unlock all premium features and support indie development!\n\n' +
      '✨ AI-powered insights\n' +
      '📊 Advanced analytics\n' +
      '⚙️ Custom durations\n' +
      '🎵 Premium sounds\n' +
      '👥 Team features\n' +
      '📅 Calendar sync\n\n' +
      'One-time payment • No subscriptions • Lifetime access',
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
          '💳 Purchase Simulation',
          'This is a development build. Simulate successful purchase?',
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
        'Sorry, we couldn\'t complete your purchase. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    } finally {
      setIsLoading(false);
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
        'Thank you for your purchase! All premium features are now unlocked. Enjoy enhanced productivity with DreamAI!',
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
        Alert.alert(
          '✅ Purchases Restored',
          'Your TimeBox Pro features have been restored successfully!',
          [{ text: 'Great!' }]
        );
      } else {
        // Simulate checking app store
        Alert.alert(
          '🔍 Checking Purchases',
          'No previous purchases found for this Apple ID / Google account.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Restore purchases error:', error);
      
      Alert.alert(
        'Restore Failed',
        'We couldn\'t restore your purchases. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const trackPurchaseEvent = (productId: string) => {
    // Track purchase for analytics
    console.log('Purchase tracked:', {
      product_id: productId,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    });
    
    // In production, send to analytics service
    // Analytics.track('premium_purchase', { product_id: productId });
  };

  // Helper functions for feature checks
  const hasFeature = (featureId: string): boolean => {
    if (!isPro) return false;
    return features.find(f => f.id === featureId)?.available || false;
  };

  // Add helper methods to return object
  const extendedReturn = {
    isPro,
    features,
    products,
    isLoading,
    requestUpgrade,
    restorePurchases,
    purchaseProduct,
    
    // Helper methods
    hasFeature,
    canUseCustomDurations: () => hasFeature('custom_durations'),
    canUseAIInsights: () => hasFeature('ai_insights'),
    canUseAdvancedStats: () => hasFeature('advanced_stats'),
    canUseBinauralBeats: () => hasFeature('binaural_beats'),
    canUseTeamFeatures: () => hasFeature('team_features'),
    canUseCalendarIntegration: () => hasFeature('calendar_integration'),
    canExportData: () => hasFeature('export_data'),
  };

  return extendedReturn;
};

export default usePremium;