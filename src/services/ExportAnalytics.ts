export interface ExportData {
  user: {
    id: string;
    name: string;
    email: string;
    joinDate: Date;
  };
  timeRange: {
    start: Date;
    end: Date;
  };
  sessions: SessionData[];
  summary: AnalyticsSummary;
  insights: AIInsight[];
}

export interface SessionData {
  id: string;
  type: 'quick' | 'focus' | 'deep' | 'ultra';
  startTime: Date;
  endTime: Date;
  plannedDuration: number;
  actualDuration: number;
  completed: boolean;
  focusScore: number;
  distractions: number;
  breaks: number;
  productivity: number;
  tags?: string[];
  notes?: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalTime: number;
  averageSessionLength: number;
  completionRate: number;
  averageFocusScore: number;
  streak: {
    current: number;
    longest: number;
  };
  productivity: {
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    weeklyAverage: number;
  };
  timeDistribution: {
    [key: string]: number; // session type -> minutes
  };
  peakHours: string[];
}

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'xlsx';

export class ExportAnalyticsService {
  private static instance: ExportAnalyticsService;

  public static getInstance(): ExportAnalyticsService {
    if (!ExportAnalyticsService.instance) {
      ExportAnalyticsService.instance = new ExportAnalyticsService();
    }
    return ExportAnalyticsService.instance;
  }

  public async generateReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    format: ExportFormat = 'json'
  ): Promise<string | Blob> {
    const exportData = await this.collectData(userId, startDate, endDate);
    
    switch (format) {
      case 'json':
        return this.exportAsJSON(exportData);
      case 'csv':
        return this.exportAsCSV(exportData);
      case 'pdf':
        return this.exportAsPDF(exportData);
      case 'xlsx':
        return this.exportAsXLSX(exportData);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private async collectData(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ExportData> {
    // In a real implementation, this would fetch from database
    const mockSessions: SessionData[] = [
      {
        id: 'session_1',
        type: 'focus',
        startTime: new Date('2025-01-10T09:00:00'),
        endTime: new Date('2025-01-10T09:25:00'),
        plannedDuration: 25,
        actualDuration: 25,
        completed: true,
        focusScore: 85,
        distractions: 2,
        breaks: 0,
        productivity: 92,
        tags: ['work', 'coding']
      },
      {
        id: 'session_2',
        type: 'deep',
        startTime: new Date('2025-01-10T14:00:00'),
        endTime: new Date('2025-01-10T14:45:00'),
        plannedDuration: 45,
        actualDuration: 45,
        completed: true,
        focusScore: 78,
        distractions: 1,
        breaks: 1,
        productivity: 88,
        tags: ['research', 'analysis']
      }
    ];

    const summary = this.calculateSummary(mockSessions);

    return {
      user: {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: new Date('2025-01-01')
      },
      timeRange: {
        start: startDate,
        end: endDate
      },
      sessions: mockSessions,
      summary,
      insights: [] // Would be populated from AI service
    };
  }

  private calculateSummary(sessions: SessionData[]): AnalyticsSummary {
    const completedSessions = sessions.filter(s => s.completed);
    const totalTime = sessions.reduce((sum, s) => sum + s.actualDuration, 0);
    
    const timeDistribution = sessions.reduce((dist, session) => {
      dist[session.type] = (dist[session.type] || 0) + session.actualDuration;
      return dist;
    }, {} as { [key: string]: number });

    return {
      totalSessions: sessions.length,
      totalTime,
      averageSessionLength: totalTime / sessions.length,
      completionRate: (completedSessions.length / sessions.length) * 100,
      averageFocusScore: sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length,
      streak: {
        current: 5,
        longest: 12
      },
      productivity: {
        score: sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length,
        trend: 'improving',
        weeklyAverage: 85
      },
      timeDistribution,
      peakHours: ['09:00-11:00', '14:00-16:00']
    };
  }

  private exportAsJSON(data: ExportData): string {
    return JSON.stringify(data, null, 2);
  }

  private exportAsCSV(data: ExportData): string {
    const headers = [
      'Session ID',
      'Type',
      'Start Time',
      'End Time',
      'Planned Duration',
      'Actual Duration',
      'Completed',
      'Focus Score',
      'Distractions',
      'Breaks',
      'Productivity',
      'Tags'
    ];

    const rows = data.sessions.map(session => [
      session.id,
      session.type,
      session.startTime.toISOString(),
      session.endTime.toISOString(),
      session.plannedDuration,
      session.actualDuration,
      session.completed,
      session.focusScore,
      session.distractions,
      session.breaks,
      session.productivity,
      session.tags?.join(';') || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  private exportAsPDF(data: ExportData): Blob {
    // In a real implementation, this would use a PDF library like jsPDF
    const content = `
TimeBox Productivity Report
Generated: ${new Date().toISOString()}

User: ${data.user.name} (${data.user.email})
Period: ${data.timeRange.start.toDateString()} - ${data.timeRange.end.toDateString()}

SUMMARY
=======
Total Sessions: ${data.summary.totalSessions}
Total Time: ${Math.round(data.summary.totalTime / 60)} hours
Completion Rate: ${data.summary.completionRate.toFixed(1)}%
Average Focus Score: ${data.summary.averageFocusScore.toFixed(1)}
Current Streak: ${data.summary.streak.current} days

SESSION DETAILS
===============
${data.sessions.map(s => 
  `${s.startTime.toISOString()} - ${s.type} (${s.actualDuration}min) - Focus: ${s.focusScore}%`
).join('\n')}
    `;

    return new Blob([content], { type: 'application/pdf' });
  }

  private exportAsXLSX(data: ExportData): Blob {
    // In a real implementation, this would use a library like SheetJS
    const csvContent = this.exportAsCSV(data);
    return new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  public async generateWeeklyReport(userId: string): Promise<ExportData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return this.collectData(userId, startDate, endDate);
  }

  public async generateMonthlyReport(userId: string): Promise<ExportData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    
    return this.collectData(userId, startDate, endDate);
  }

  public async scheduleAutoExport(
    userId: string,
    frequency: 'weekly' | 'monthly',
    format: ExportFormat,
    email: string
  ): Promise<boolean> {
    // In a real implementation, this would set up a scheduled job
    console.log(`Scheduled ${frequency} ${format} reports for ${email}`);
    return true;
  }

  public getAvailableFormats(): ExportFormat[] {
    return ['json', 'csv', 'pdf', 'xlsx'];
  }

  public async shareReport(reportId: string, emails: string[]): Promise<boolean> {
    // In a real implementation, this would send the report via email
    console.log(`Report ${reportId} shared with: ${emails.join(', ')}`);
    return true;
  }
}