export interface AIInsight {
  id: string;
  type: 'productivity' | 'focus' | 'break' | 'optimization';
  title: string;
  message: string;
  confidence: number;
  timestamp: Date;
  actionable: boolean;
  category: string;
}

export interface ProductivityMetrics {
  focusScore: number;
  peakHours: string[];
  distractionCount: number;
  sessionCompletionRate: number;
  averageSessionLength: number;
  weeklyTrend: 'improving' | 'declining' | 'stable';
}

export class AIInsightsEngine {
  private static instance: AIInsightsEngine;
  
  public static getInstance(): AIInsightsEngine {
    if (!AIInsightsEngine.instance) {
      AIInsightsEngine.instance = new AIInsightsEngine();
    }
    return AIInsightsEngine.instance;
  }

  public async generateInsights(metrics: ProductivityMetrics): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    
    // Focus Score Analysis
    if (metrics.focusScore < 70) {
      insights.push({
        id: `focus-${Date.now()}`,
        type: 'focus',
        title: '🎯 Focus Optimization',
        message: `Your focus score is ${metrics.focusScore}%. Try shorter sessions with more breaks.`,
        confidence: 0.85,
        timestamp: new Date(),
        actionable: true,
        category: 'Performance'
      });
    }

    // Peak Hours Analysis
    if (metrics.peakHours.length > 0) {
      insights.push({
        id: `peak-${Date.now()}`,
        type: 'productivity',
        title: '⏰ Peak Performance Hours',
        message: `You're most productive at ${metrics.peakHours.join(', ')}. Schedule important tasks then.`,
        confidence: 0.92,
        timestamp: new Date(),
        actionable: true,
        category: 'Timing'
      });
    }

    // Session Completion Analysis
    if (metrics.sessionCompletionRate < 80) {
      insights.push({
        id: `completion-${Date.now()}`,
        type: 'optimization',
        title: '📊 Session Completion',
        message: `${metrics.sessionCompletionRate}% completion rate. Consider shorter sessions or identify interruption patterns.`,
        confidence: 0.78,
        timestamp: new Date(),
        actionable: true,
        category: 'Efficiency'
      });
    }

    // Weekly Trend Analysis
    if (metrics.weeklyTrend === 'declining') {
      insights.push({
        id: `trend-${Date.now()}`,
        type: 'productivity',
        title: '📉 Performance Trend',
        message: 'Your productivity has been declining this week. Consider adjusting your routine or taking a longer break.',
        confidence: 0.88,
        timestamp: new Date(),
        actionable: true,
        category: 'Wellness'
      });
    }

    return insights;
  }

  public async getPersonalizedRecommendations(userId: string): Promise<string[]> {
    // Simulate AI-generated recommendations
    const recommendations = [
      'Try the 45-minute Deep Focus session for complex tasks',
      'Take a 15-minute walk between sessions to boost creativity',
      'Use binaural beats at 40Hz for enhanced concentration',
      'Schedule your most challenging work during your peak hours',
      'Consider a longer break after 3 consecutive sessions'
    ];

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  public calculateFocusScore(sessionData: any[]): number {
    if (sessionData.length === 0) return 0;
    
    let totalScore = 0;
    let validSessions = 0;

    sessionData.forEach(session => {
      if (session.completed && session.duration > 0) {
        const completionRatio = session.actualDuration / session.plannedDuration;
        const score = Math.min(completionRatio * 100, 100);
        totalScore += score;
        validSessions++;
      }
    });

    return validSessions > 0 ? Math.round(totalScore / validSessions) : 0;
  }
}