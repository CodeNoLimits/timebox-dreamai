import { useState, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { DailyStats, WeeklyStats, TimerSession, HeatmapDay } from '../types';

// Initialize MMKV storage
const storage = new MMKV();

interface UseStatsReturn {
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
  allSessions: TimerSession[];
  isLoading: boolean;
  updateSession: (session: Partial<TimerSession>) => Promise<void>;
  getStatsByDateRange: (start: Date, end: Date) => Promise<TimerSession[]>;
  exportData: () => Promise<string>;
  refreshStats: () => Promise<void>;
}

const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getThisWeek = (): string => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  return startOfWeek.toISOString().split('T')[0];
};

export const useStats = (): UseStatsReturn => {
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    date: getToday(),
    sessions: 0,
    totalMinutes: 0,
    completedSessions: 0,
    streak: 0,
    productivityScore: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    week: getThisWeek(),
    totalSessions: 0,
    totalMinutes: 0,
    averageSessionLength: 0,
    productivityTrend: 0,
    heatmapData: [],
  });

  const [allSessions, setAllSessions] = useState<TimerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Load all sessions from storage
      const sessionsData = storage.getString('session_history');
      const sessions: TimerSession[] = sessionsData ? JSON.parse(sessionsData) : [];
      
      setAllSessions(sessions);
      
      // Calculate daily stats
      const todaysStats = calculateDailyStats(sessions, getToday());
      setDailyStats(todaysStats);
      
      // Calculate weekly stats
      const weekStats = calculateWeeklyStats(sessions, getThisWeek());
      setWeeklyStats(weekStats);
      
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDailyStats = (sessions: TimerSession[], date: string): DailyStats => {
    const todaySessions = sessions.filter(session => 
      session.startTime && new Date(session.startTime).toISOString().split('T')[0] === date
    );

    const completedToday = todaySessions.filter(session => session.completed);
    const totalMinutes = completedToday.reduce((sum, session) => sum + session.duration, 0);
    
    // Calculate streak
    const streak = calculateStreak(sessions);
    
    // Calculate productivity score (0-100)
    const score = calculateProductivityScore(todaySessions, completedToday, streak);

    return {
      date,
      sessions: todaySessions.length,
      totalMinutes,
      completedSessions: completedToday.length,
      streak,
      productivityScore: score,
    };
  };

  const calculateWeeklyStats = (sessions: TimerSession[], weekStart: string): WeeklyStats => {
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    const weekSessions = sessions.filter(session => {
      if (!session.startTime) return false;
      const sessionDate = new Date(session.startTime);
      return sessionDate >= weekStartDate && sessionDate <= weekEndDate;
    });

    const completedWeekSessions = weekSessions.filter(session => session.completed);
    const totalMinutes = completedWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageLength = completedWeekSessions.length > 0 ? 
      totalMinutes / completedWeekSessions.length : 0;

    // Calculate productivity trend (comparison with previous week)
    const trend = calculateProductivityTrend(sessions, weekStartDate);
    
    // Generate heatmap data
    const heatmapData = generateHeatmapData(sessions, weekStartDate);

    return {
      week: weekStart,
      totalSessions: weekSessions.length,
      totalMinutes,
      averageSessionLength: Math.round(averageLength),
      productivityTrend: trend,
      heatmapData,
    };
  };

  const calculateStreak = (sessions: TimerSession[]): number => {
    if (sessions.length === 0) return 0;

    const today = new Date();
    let currentDate = new Date(today);
    let streak = 0;

    // Check if there's a session today
    const todayString = today.toISOString().split('T')[0];
    const hasSessionToday = sessions.some(session => 
      session.completed && 
      session.startTime && 
      new Date(session.startTime).toISOString().split('T')[0] === todayString
    );

    if (!hasSessionToday) {
      // If no session today, start checking from yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days with completed sessions
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hasSession = sessions.some(session => 
        session.completed && 
        session.startTime && 
        new Date(session.startTime).toISOString().split('T')[0] === dateString
      );

      if (hasSession) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateProductivityScore = (
    totalSessions: TimerSession[], 
    completedSessions: TimerSession[], 
    streak: number
  ): number => {
    let score = 0;

    // Base score from completed sessions (max 40 points)
    score += Math.min(completedSessions.length * 10, 40);

    // Bonus for completion rate (max 20 points)
    const completionRate = totalSessions.length > 0 ? 
      completedSessions.length / totalSessions.length : 0;
    score += completionRate * 20;

    // Bonus for streak (max 25 points)
    score += Math.min(streak * 5, 25);

    // Bonus for consistency (max 15 points)
    const totalMinutes = completedSessions.reduce((sum, session) => sum + session.duration, 0);
    if (totalMinutes >= 60) score += 15; // 1+ hours
    else if (totalMinutes >= 30) score += 10; // 30+ minutes
    else if (totalMinutes >= 15) score += 5; // 15+ minutes

    return Math.min(Math.round(score), 100);
  };

  const calculateProductivityTrend = (sessions: TimerSession[], currentWeekStart: Date): number => {
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 1);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    // Get sessions for both weeks
    const currentWeekSessions = sessions.filter(session => {
      if (!session.startTime || !session.completed) return false;
      const sessionDate = new Date(session.startTime);
      return sessionDate >= currentWeekStart && sessionDate <= currentWeekEnd;
    });

    const previousWeekSessions = sessions.filter(session => {
      if (!session.startTime || !session.completed) return false;
      const sessionDate = new Date(session.startTime);
      return sessionDate >= previousWeekStart && sessionDate <= previousWeekEnd;
    });

    const currentTotal = currentWeekSessions.reduce((sum, s) => sum + s.duration, 0);
    const previousTotal = previousWeekSessions.reduce((sum, s) => sum + s.duration, 0);

    if (previousTotal === 0) return currentTotal > 0 ? 1 : 0;

    const trend = (currentTotal - previousTotal) / previousTotal;
    return Math.max(-1, Math.min(1, trend)); // Clamp between -1 and 1
  };

  const generateHeatmapData = (sessions: TimerSession[], weekStart: Date): HeatmapDay[] => {
    const heatmapData: HeatmapDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(session => 
        session.completed &&
        session.startTime && 
        new Date(session.startTime).toISOString().split('T')[0] === dateString
      );

      const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration, 0);
      
      // Convert minutes to intensity (0-4)
      let intensity = 0;
      if (totalMinutes >= 120) intensity = 4; // 2+ hours
      else if (totalMinutes >= 90) intensity = 3; // 1.5+ hours
      else if (totalMinutes >= 60) intensity = 2; // 1+ hour
      else if (totalMinutes >= 30) intensity = 1; // 30+ minutes

      heatmapData.push({
        date: dateString,
        value: intensity,
        sessions: daySessions.length,
      });
    }

    return heatmapData;
  };

  const updateSession = async (session: Partial<TimerSession>): Promise<void> => {
    try {
      // This would typically be called when a session completes
      // For now, just refresh stats
      await refreshStats();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const getStatsByDateRange = async (start: Date, end: Date): Promise<TimerSession[]> => {
    try {
      const sessions = allSessions.filter(session => {
        if (!session.startTime) return false;
        const sessionDate = new Date(session.startTime);
        return sessionDate >= start && sessionDate <= end;
      });
      
      return sessions;
    } catch (error) {
      console.error('Error getting stats by date range:', error);
      return [];
    }
  };

  const exportData = async (): Promise<string> => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalSessions: allSessions.length,
        completedSessions: allSessions.filter(s => s.completed).length,
        totalTime: allSessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0),
        dailyStats,
        weeklyStats,
        sessions: allSessions,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const refreshStats = async (): Promise<void> => {
    await loadStats();
  };

  return {
    dailyStats,
    weeklyStats,
    allSessions,
    isLoading,
    updateSession,
    getStatsByDateRange,
    exportData,
    refreshStats,
  };
};

export default useStats;