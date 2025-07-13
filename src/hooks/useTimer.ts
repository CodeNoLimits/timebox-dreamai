import { useState, useEffect, useRef } from 'react';
import { SessionType, TimerSession } from '../types';
import { MMKV } from 'react-native-mmkv';
// import * as Notifications from 'expo-notifications';
// import * as Haptics from 'expo-haptics';

// Initialize MMKV storage
const storage = new MMKV();

interface UseTimerReturn {
  currentSession: TimerSession | null;
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  progress: number; // 0 to 1
  startTimer: (duration: number, type: SessionType, title: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  // Calculate progress (0 to 1)
  const progress = currentSession ? 
    1 - (timeLeft / (currentSession.duration * 60)) : 0;

  // Load saved session on mount
  useEffect(() => {
    loadSavedSession();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Save progress to storage
          if (currentSession) {
            const updatedSession = {
              ...currentSession,
              endTime: newTime === 0 ? new Date() : undefined,
              completed: newTime === 0,
            };
            saveSessionToStorage(updatedSession);
          }
          
          // Handle completion
          if (newTime === 0) {
            handleTimerComplete();
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, currentSession]);

  const loadSavedSession = () => {
    try {
      const savedSession = storage.getString('current_session');
      if (savedSession) {
        const session: TimerSession = JSON.parse(savedSession);
        
        // Check if session is still valid (not older than 24 hours)
        const sessionAge = Date.now() - new Date(session.startTime).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge < maxAge && !session.completed) {
          // Calculate remaining time
          const elapsed = Math.floor(sessionAge / 1000);
          const totalSeconds = session.duration * 60;
          const remaining = Math.max(0, totalSeconds - elapsed);
          
          if (remaining > 0) {
            setCurrentSession(session);
            setTimeLeft(remaining);
            setIsPaused(true); // Start in paused state
          }
        } else {
          // Remove old session
          storage.delete('current_session');
        }
      }
    } catch (error) {
      console.error('Error loading saved session:', error);
    }
  };

  const saveSessionToStorage = (session: TimerSession) => {
    try {
      storage.set('current_session', JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const startTimer = (duration: number, type: SessionType, title: string) => {
    const sessionId = generateSessionId();
    const newSession: TimerSession = {
      id: sessionId,
      title,
      duration,
      startTime: new Date(),
      completed: false,
      interrupted: false,
      sessionType: type,
    };

    setCurrentSession(newSession);
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
    
    // Save to storage
    saveSessionToStorage(newSession);
    
    // Schedule completion notification
    scheduleCompletionNotification(duration * 60);
    
    // Haptic feedback (commented for demo)
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
    
    // Cancel scheduled notification
    if (notificationIdRef.current) {
      Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
    }
    
    // Update session
    if (currentSession) {
      const updatedSession = { ...currentSession, interrupted: true };
      saveSessionToStorage(updatedSession);
    }
    
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resumeTimer = () => {
    if (currentSession && timeLeft > 0) {
      setIsRunning(true);
      setIsPaused(false);
      
      // Reschedule notification
      scheduleCompletionNotification(timeLeft);
      
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Cancel notification (commented for demo)
    // if (notificationIdRef.current) {
    //   Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
    // }
    
    // Update session as interrupted
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date(),
        interrupted: true,
        completed: false,
      };
      saveSessionToStorage(updatedSession);
      addToSessionHistory(updatedSession);
    }
    
    // Clear current session
    setCurrentSession(null);
    setTimeLeft(0);
    storage.delete('current_session');
    
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const resetTimer = () => {
    if (currentSession) {
      setTimeLeft(currentSession.duration * 60);
      setIsRunning(false);
      setIsPaused(true);
      
      // Cancel notification
      if (notificationIdRef.current) {
        Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      }
      
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true,
        interrupted: false,
      };
      
      addToSessionHistory(completedSession);
      storage.delete('current_session');
    }
    
    setCurrentSession(null);
    setTimeLeft(0);
    
    // Success haptic
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Show completion notification
    showCompletionNotification();
  };

  const scheduleCompletionNotification = async (seconds: number) => {
    // Notifications disabled for demo
    console.log(`Session will complete in ${seconds} seconds`);
  };

  const showCompletionNotification = async () => {
    // Notifications disabled for demo
    console.log('Session completed!');
  };

  const addToSessionHistory = (session: TimerSession) => {
    try {
      const existingHistory = storage.getString('session_history');
      const history: TimerSession[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add new session to history
      history.unshift(session);
      
      // Keep only last 100 sessions
      const trimmedHistory = history.slice(0, 100);
      
      storage.set('session_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving session to history:', error);
    }
  };

  return {
    currentSession,
    isRunning,
    isPaused,
    timeLeft,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  };
};

export default useTimer;