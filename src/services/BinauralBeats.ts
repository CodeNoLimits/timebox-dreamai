export interface BinauralBeatPreset {
  id: string;
  name: string;
  frequency: number; // Hz
  description: string;
  icon: string;
  color: string;
  category: 'focus' | 'relaxation' | 'creativity' | 'meditation';
  duration?: number; // minutes
}

export interface AudioState {
  isPlaying: boolean;
  currentPreset: BinauralBeatPreset | null;
  volume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

export const BINAURAL_PRESETS: BinauralBeatPreset[] = [
  {
    id: 'gamma-focus',
    name: 'Gamma Focus',
    frequency: 40,
    description: 'High-frequency waves for intense concentration and cognitive enhancement',
    icon: '🧠',
    color: '#FF6B6B',
    category: 'focus'
  },
  {
    id: 'beta-alertness',
    name: 'Beta Alertness',
    frequency: 20,
    description: 'Beta waves for active thinking and problem-solving',
    icon: '⚡',
    color: '#4ECDC4',
    category: 'focus'
  },
  {
    id: 'alpha-creativity',
    name: 'Alpha Creativity',
    frequency: 10,
    description: 'Alpha waves for creative flow and relaxed awareness',
    icon: '🎨',
    color: '#45B7D1',
    category: 'creativity'
  },
  {
    id: 'theta-deep',
    name: 'Theta Deep Work',
    frequency: 6,
    description: 'Theta waves for deep meditation and subconscious processing',
    icon: '🧘',
    color: '#96CEB4',
    category: 'meditation'
  },
  {
    id: 'delta-rest',
    name: 'Delta Recovery',
    frequency: 2,
    description: 'Delta waves for deep rest and healing',
    icon: '😴',
    color: '#FFEAA7',
    category: 'relaxation'
  }
];

export class BinauralBeatsService {
  private static instance: BinauralBeatsService;
  private audioContext: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private currentState: AudioState = {
    isPlaying: false,
    currentPreset: null,
    volume: 0.3,
    fadeInDuration: 5,
    fadeOutDuration: 3
  };

  public static getInstance(): BinauralBeatsService {
    if (!BinauralBeatsService.instance) {
      BinauralBeatsService.instance = new BinauralBeatsService();
    }
    return BinauralBeatsService.instance;
  }

  private initializeAudioContext(): void {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    } else {
      console.warn('Web Audio API not supported in this environment');
    }
  }

  public async playPreset(preset: BinauralBeatPreset): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (!this.audioContext) {
      console.error('AudioContext not available');
      return;
    }

    // Stop current audio if playing
    await this.stop();

    try {
      // Create oscillators for binaural beat
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      // Set frequencies (binaural beat = difference between left and right)
      const baseFrequency = 200; // Hz
      this.leftOscillator.frequency.setValueAtTime(baseFrequency, this.audioContext.currentTime);
      this.rightOscillator.frequency.setValueAtTime(
        baseFrequency + preset.frequency, 
        this.audioContext.currentTime
      );

      // Create stereo panner for left/right separation
      const leftPanner = this.audioContext.createStereoPanner();
      const rightPanner = this.audioContext.createStereoPanner();
      leftPanner.pan.setValueAtTime(-1, this.audioContext.currentTime);
      rightPanner.pan.setValueAtTime(1, this.audioContext.currentTime);

      // Connect the audio graph
      this.leftOscillator.connect(leftPanner);
      this.rightOscillator.connect(rightPanner);
      leftPanner.connect(this.gainNode);
      rightPanner.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Set initial volume and fade in
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        this.currentState.volume,
        this.audioContext.currentTime + this.currentState.fadeInDuration
      );

      // Start oscillators
      this.leftOscillator.start();
      this.rightOscillator.start();

      this.currentState = {
        ...this.currentState,
        isPlaying: true,
        currentPreset: preset
      };

    } catch (error) {
      console.error('Error playing binaural beats:', error);
    }
  }

  public async stop(): Promise<void> {
    if (this.gainNode && this.audioContext && this.currentState.isPlaying) {
      // Fade out
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + this.currentState.fadeOutDuration
      );

      // Stop oscillators after fade out
      setTimeout(() => {
        if (this.leftOscillator) {
          this.leftOscillator.stop();
          this.leftOscillator = null;
        }
        if (this.rightOscillator) {
          this.rightOscillator.stop();
          this.rightOscillator = null;
        }
        this.gainNode = null;
      }, this.currentState.fadeOutDuration * 1000);
    }

    this.currentState = {
      ...this.currentState,
      isPlaying: false,
      currentPreset: null
    };
  }

  public setVolume(volume: number): void {
    this.currentState.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this.currentState.volume,
        this.audioContext.currentTime
      );
    }
  }

  public getState(): AudioState {
    return { ...this.currentState };
  }

  public getPresetsByCategory(category: string): BinauralBeatPreset[] {
    return BINAURAL_PRESETS.filter(preset => preset.category === category);
  }

  public getRecommendedPreset(sessionType: string): BinauralBeatPreset | null {
    const recommendations = {
      'focus': 'gamma-focus',
      'deep': 'beta-alertness',
      'quick': 'alpha-creativity',
      'ultra': 'theta-deep'
    };

    const presetId = recommendations[sessionType as keyof typeof recommendations];
    return BINAURAL_PRESETS.find(preset => preset.id === presetId) || null;
  }
}