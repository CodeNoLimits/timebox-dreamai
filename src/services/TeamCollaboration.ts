export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  status: 'online' | 'away' | 'busy' | 'offline';
  currentSession?: {
    type: string;
    startTime: Date;
    duration: number;
  };
  stats: {
    totalSessions: number;
    totalTime: number;
    averageFocus: number;
    streak: number;
  };
}

export interface TeamRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  members: TeamMember[];
  activeSession?: {
    type: string;
    startTime: Date;
    duration: number;
    participants: string[];
  };
  settings: {
    requireApproval: boolean;
    allowBreaks: boolean;
    syncBreaks: boolean;
    sharedGoals: boolean;
  };
}

export interface TeamSession {
  id: string;
  roomId: string;
  type: 'focus' | 'break' | 'meeting';
  startTime: Date;
  duration: number;
  participants: TeamMember[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  goals?: string[];
  results?: {
    completionRate: number;
    averageFocus: number;
    achievements: string[];
  };
}

export interface TeamStats {
  totalMembers: number;
  activeSessions: number;
  completedSessions: number;
  averageProductivity: number;
  topPerformers: TeamMember[];
  weeklyProgress: {
    sessions: number;
    totalTime: number;
    averageFocus: number;
  };
}

export class TeamCollaborationService {
  private static instance: TeamCollaborationService;
  private rooms: Map<string, TeamRoom> = new Map();
  private currentUser: TeamMember | null = null;

  public static getInstance(): TeamCollaborationService {
    if (!TeamCollaborationService.instance) {
      TeamCollaborationService.instance = new TeamCollaborationService();
    }
    return TeamCollaborationService.instance;
  }

  public async createRoom(name: string, description: string): Promise<TeamRoom> {
    const roomId = `room_${Date.now()}`;
    const room: TeamRoom = {
      id: roomId,
      name,
      description,
      createdBy: this.currentUser?.id || 'unknown',
      createdAt: new Date(),
      members: this.currentUser ? [this.currentUser] : [],
      settings: {
        requireApproval: false,
        allowBreaks: true,
        syncBreaks: false,
        sharedGoals: true
      }
    };

    this.rooms.set(roomId, room);
    return room;
  }

  public async joinRoom(roomId: string, member: TeamMember): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    if (room.settings.requireApproval && member.role === 'member') {
      // In a real implementation, this would notify room admins
      console.log(`${member.name} requested to join ${room.name}`);
      return false;
    }

    room.members.push(member);
    this.rooms.set(roomId, room);
    return true;
  }

  public async startTeamSession(
    roomId: string, 
    sessionType: string, 
    duration: number
  ): Promise<TeamSession | null> {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const sessionId = `session_${Date.now()}`;
    const session: TeamSession = {
      id: sessionId,
      roomId,
      type: sessionType as 'focus' | 'break' | 'meeting',
      startTime: new Date(),
      duration,
      participants: room.members.filter(m => m.status === 'online'),
      status: 'active'
    };

    // Update room with active session
    room.activeSession = {
      type: sessionType,
      startTime: session.startTime,
      duration,
      participants: session.participants.map(p => p.id)
    };

    this.rooms.set(roomId, room);
    return session;
  }

  public async syncBreaks(roomId: string): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room || !room.settings.syncBreaks) return false;

    const onlineMembers = room.members.filter(m => m.status === 'online');
    
    // Notify all online members to take a synchronized break
    onlineMembers.forEach(member => {
      console.log(`Synchronized break started for ${member.name}`);
    });

    return true;
  }

  public async getTeamStats(roomId: string): Promise<TeamStats | null> {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const stats: TeamStats = {
      totalMembers: room.members.length,
      activeSessions: room.activeSession ? 1 : 0,
      completedSessions: 0, // Would be tracked in real implementation
      averageProductivity: this.calculateAverageProductivity(room.members),
      topPerformers: this.getTopPerformers(room.members),
      weeklyProgress: {
        sessions: 0,
        totalTime: 0,
        averageFocus: 0
      }
    };

    return stats;
  }

  public async inviteMembers(roomId: string, emails: string[]): Promise<boolean> {
    // In a real implementation, this would send invitation emails
    console.log(`Invitations sent to: ${emails.join(', ')}`);
    return true;
  }

  public async setRoomSettings(
    roomId: string, 
    settings: Partial<TeamRoom['settings']>
  ): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.settings = { ...room.settings, ...settings };
    this.rooms.set(roomId, room);
    return true;
  }

  public getMemberStatus(memberId: string): 'online' | 'away' | 'busy' | 'offline' {
    // In a real implementation, this would check actual member status
    return 'online';
  }

  public async updateMemberStatus(
    memberId: string, 
    status: TeamMember['status']
  ): Promise<void> {
    this.rooms.forEach((room, roomId) => {
      const memberIndex = room.members.findIndex(m => m.id === memberId);
      if (memberIndex !== -1) {
        room.members[memberIndex].status = status;
        this.rooms.set(roomId, room);
      }
    });
  }

  private calculateAverageProductivity(members: TeamMember[]): number {
    if (members.length === 0) return 0;
    
    const totalFocus = members.reduce((sum, member) => sum + member.stats.averageFocus, 0);
    return Math.round(totalFocus / members.length);
  }

  private getTopPerformers(members: TeamMember[]): TeamMember[] {
    return members
      .sort((a, b) => b.stats.averageFocus - a.stats.averageFocus)
      .slice(0, 3);
  }

  public getRooms(): TeamRoom[] {
    return Array.from(this.rooms.values());
  }

  public getRoom(roomId: string): TeamRoom | null {
    return this.rooms.get(roomId) || null;
  }
}