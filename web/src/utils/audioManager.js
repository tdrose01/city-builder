/**
 * AudioManager - Game Audio System
 * 
 * Features:
 * - Synthesized sound effects (no external files needed)
 * - Volume controls (master, music, SFX)
 * - Mute/unmute functionality
 * - LocalStorage persistence
 * - Browser autoplay handling
 * - Reduced motion support
 * 
 * Uses Web Audio API for all sounds
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    
    // Volume levels (0-1)
    this.volumes = {
      master: 0.7,
      music: 0.5,
      sfx: 0.6
    };
    
    this.muted = false;
    this.initialized = false;
    this.currentMusic = null;
    
    // Load saved settings
    this.loadSettings();
  }

  /**
   * Initialize Web Audio API
   * Must be called from user interaction due to browser autoplay restrictions
   */
  async init() {
    if (this.initialized) return;

    try {
      // Create AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes for volume control
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      
      // Connect gain nodes: music/sfx -> master -> destination
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
      
      // Set initial volumes
      this.updateGainValues();
      
      this.initialized = true;
      console.log('AudioManager initialized');
    } catch (error) {
      console.warn('AudioManager initialization failed:', error);
    }
  }

  /**
   * Update gain node values based on current volumes
   */
  updateGainValues() {
    if (!this.initialized) return;

    const masterVolume = this.muted ? 0 : this.volumes.master;
    this.masterGain.gain.setValueAtTime(masterVolume, this.audioContext.currentTime);
    this.musicGain.gain.setValueAtTime(this.volumes.music, this.audioContext.currentTime);
    this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.audioContext.currentTime);
  }

  /**
   * Play a synthesized sound effect
   */
  playSFX(type) {
    if (!this.initialized || this.muted) return;

    try {
      const ctx = this.audioContext;
      const currentTime = ctx.currentTime;

      switch (type) {
        case 'diceRoll':
          this.playDiceRoll(ctx, currentTime);
          break;
        case 'upgrade':
          this.playUpgrade(ctx, currentTime);
          break;
        case 'funds':
          this.playFunds(ctx, currentTime);
          break;
        case 'cityUnlock':
          this.playCityUnlock(ctx, currentTime);
          break;
        case 'milestone':
          this.playMilestone(ctx, currentTime);
          break;
        case 'click':
          this.playClick(ctx, currentTime);
          break;
        case 'success':
          this.playSuccess(ctx, currentTime);
          break;
        case 'error':
          this.playError(ctx, currentTime);
          break;
        case 'achievement':
          this.playAchievement(ctx, currentTime);
          break;
        case 'teleport':
          this.playTeleport(ctx, currentTime);
          break;
        case 'doubles':
          this.playDoubles(ctx, currentTime);
          break;
        default:
          console.warn('Unknown SFX type:', type);
      }
    } catch (error) {
      console.warn('Error playing SFX:', error);
    }
  }

  /**
   * Dice roll sound - quick rattle
   */
  playDiceRoll(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
  }

  /**
   * Upgrade sound - rising chime
   */
  playUpgrade(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, startTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }

  /**
   * Funds gain sound - coin clink
   */
  playFunds(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, startTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.05);
  }

  /**
   * City unlock sound - triumphant fanfare
   */
  playCityUnlock(ctx, startTime) {
    // Play three notes in sequence
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.1);
      
      gainNode.gain.setValueAtTime(0.4, startTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.3);
      
      oscillator.start(startTime + i * 0.1);
      oscillator.stop(startTime + i * 0.1 + 0.3);
    });
  }

  /**
   * Milestone sound - celebratory arpeggio
   */
  playMilestone(ctx, startTime) {
    const frequencies = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.08);
      
      gainNode.gain.setValueAtTime(0.3, startTime + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.08 + 0.4);
      
      oscillator.start(startTime + i * 0.08);
      oscillator.stop(startTime + i * 0.08 + 0.4);
    });
  }

  /**
   * Click sound - short blip
   */
  playClick(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, startTime);
    
    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.03);
  }

  /**
   * Success sound - positive confirmation
   */
  playSuccess(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, startTime); // C5
    oscillator.frequency.setValueAtTime(659.25, startTime + 0.1); // E5
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }

  /**
   * Error sound - descending tone
   */
  playError(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(240, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, startTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.35, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }

  /**
   * Achievement sound - bright ascending chime
   */
  playAchievement(ctx, startTime) {
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.07);
      
      gainNode.gain.setValueAtTime(0.28, startTime + i * 0.07);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.07 + 0.25);
      
      oscillator.start(startTime + i * 0.07);
      oscillator.stop(startTime + i * 0.07 + 0.25);
    });
  }

  /**
   * Teleport sound - quick frequency sweep
   */
  playTeleport(ctx, startTime) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, startTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.25, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.18);
  }

  /**
   * Doubles sound - exciting double-note
   */
  playDoubles(ctx, startTime) {
    // Play two notes simultaneously
    [440, 880].forEach(freq => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }

  /**
   * Set volume for a specific channel
   */
  setVolume(channel, value) {
    if (value < 0 || value > 1) {
      console.warn('Volume must be between 0 and 1');
      return;
    }

    this.volumes[channel] = value;
    this.updateGainValues();
    this.saveSettings();
  }

  /**
   * Mute/unmute all audio
   */
  setMuted(muted) {
    this.muted = muted;
    this.updateGainValues();
    this.saveSettings();
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.setMuted(!this.muted);
  }

  /**
   * Get current settings
   */
  getSettings() {
    return {
      volumes: { ...this.volumes },
      muted: this.muted,
      initialized: this.initialized
    };
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      const settings = {
        volumes: this.volumes,
        muted: this.muted
      };
      localStorage.setItem('citySlacker_audioSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('citySlacker_audioSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.volumes = settings.volumes || this.volumes;
        this.muted = settings.muted || false;
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.initialized = false;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
