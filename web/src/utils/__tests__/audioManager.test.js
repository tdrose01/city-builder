import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import audioManager from '../audioManager';

describe('AudioManager', () => {
  // Mock AudioContext
  const mockAudioContext = {
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn()
      }
    })),
    createOscillator: vi.fn(() => ({
      connect: vi.fn(),
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      start: vi.fn(),
      stop: vi.fn()
    })),
    destination: {},
    currentTime: 0,
    close: vi.fn()
  };

  beforeEach(() => {
    // Reset audioManager state
    audioManager.initialized = false;
    audioManager.muted = false;
    audioManager.volumes = {
      master: 0.7,
      music: 0.5,
      sfx: 0.6
    };

    // Mock window.AudioContext
    global.AudioContext = vi.fn(() => mockAudioContext);
    global.webkitAudioContext = vi.fn(() => mockAudioContext);

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should not be initialized by default', () => {
      expect(audioManager.initialized).toBe(false);
    });

    test('should initialize AudioContext on init()', async () => {
      await audioManager.init();
      expect(audioManager.initialized).toBe(true);
      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('should create gain nodes on init()', async () => {
      await audioManager.init();
      expect(mockAudioContext.createGain).toHaveBeenCalledTimes(3); // master, music, sfx
    });

    test('should not reinitialize if already initialized', async () => {
      await audioManager.init();
      const firstCallCount = global.AudioContext.mock.calls.length;
      
      await audioManager.init();
      expect(global.AudioContext.mock.calls.length).toBe(firstCallCount);
    });

    test('should handle initialization errors gracefully', async () => {
      global.AudioContext = vi.fn(() => {
        throw new Error('AudioContext not supported');
      });

      await audioManager.init();
      expect(audioManager.initialized).toBe(false);
    });
  });

  describe('Volume Control', () => {
    beforeEach(async () => {
      await audioManager.init();
    });

    test('should set master volume', () => {
      audioManager.setVolume('master', 0.5);
      expect(audioManager.volumes.master).toBe(0.5);
    });

    test('should set music volume', () => {
      audioManager.setVolume('music', 0.3);
      expect(audioManager.volumes.music).toBe(0.3);
    });

    test('should set SFX volume', () => {
      audioManager.setVolume('sfx', 0.8);
      expect(audioManager.volumes.sfx).toBe(0.8);
    });

    test('should reject volume below 0', () => {
      const originalVolume = audioManager.volumes.master;
      audioManager.setVolume('master', -0.5);
      expect(audioManager.volumes.master).toBe(originalVolume);
    });

    test('should reject volume above 1', () => {
      const originalVolume = audioManager.volumes.master;
      audioManager.setVolume('master', 1.5);
      expect(audioManager.volumes.master).toBe(originalVolume);
    });

    test('should save settings after volume change', () => {
      audioManager.setVolume('master', 0.5);
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'citySlacker_audioSettings',
        expect.any(String)
      );
    });
  });

  describe('Mute/Unmute', () => {
    beforeEach(async () => {
      await audioManager.init();
    });

    test('should mute audio', () => {
      audioManager.setMuted(true);
      expect(audioManager.muted).toBe(true);
    });

    test('should unmute audio', () => {
      audioManager.setMuted(true);
      audioManager.setMuted(false);
      expect(audioManager.muted).toBe(false);
    });

    test('should toggle mute state', () => {
      const initialState = audioManager.muted;
      audioManager.toggleMute();
      expect(audioManager.muted).toBe(!initialState);
    });

    test('should save mute state', () => {
      audioManager.setMuted(true);
      expect(global.localStorage.setItem).toHaveBeenCalled();
    });

    test('should set master gain to 0 when muted', () => {
      audioManager.setMuted(true);
      audioManager.updateGainValues();
      expect(audioManager.masterGain.gain.setValueAtTime).toHaveBeenCalledWith(
        0,
        mockAudioContext.currentTime
      );
    });
  });

  describe('Sound Effects', () => {
    beforeEach(async () => {
      await audioManager.init();
    });

    test('should play diceRoll SFX', () => {
      audioManager.playSFX('diceRoll');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play upgrade SFX', () => {
      audioManager.playSFX('upgrade');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play funds SFX', () => {
      audioManager.playSFX('funds');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play cityUnlock SFX', () => {
      audioManager.playSFX('cityUnlock');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play milestone SFX', () => {
      audioManager.playSFX('milestone');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play click SFX', () => {
      audioManager.playSFX('click');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play success SFX', () => {
      audioManager.playSFX('success');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play error SFX', () => {
      audioManager.playSFX('error');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play achievement SFX', () => {
      audioManager.playSFX('achievement');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play teleport SFX', () => {
      audioManager.playSFX('teleport');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should play doubles SFX', () => {
      audioManager.playSFX('doubles');
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('should not play SFX when muted', () => {
      audioManager.setMuted(true);
      audioManager.playSFX('click');
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });

    test('should not play SFX when not initialized', () => {
      audioManager.initialized = false;
      audioManager.playSFX('click');
      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });

    test('should handle unknown SFX type gracefully', () => {
      expect(() => audioManager.playSFX('unknown')).not.toThrow();
    });

    test('should handle SFX errors gracefully', () => {
      mockAudioContext.createOscillator = vi.fn(() => {
        throw new Error('Oscillator error');
      });
      
      expect(() => audioManager.playSFX('click')).not.toThrow();
    });
  });

  describe('Settings Persistence', () => {
    test('should load settings from localStorage', () => {
      const savedSettings = {
        volumes: { master: 0.8, music: 0.6, sfx: 0.7 },
        muted: true
      };
      
      global.localStorage.getItem = vi.fn(() => JSON.stringify(savedSettings));
      
      audioManager.loadSettings();
      expect(audioManager.volumes.master).toBe(0.8);
      expect(audioManager.muted).toBe(true);
    });

    test('should handle missing localStorage data', () => {
      global.localStorage.getItem = vi.fn(() => null);
      
      expect(() => audioManager.loadSettings()).not.toThrow();
    });

    test('should handle corrupted localStorage data', () => {
      global.localStorage.getItem = vi.fn(() => 'invalid json');
      
      expect(() => audioManager.loadSettings()).not.toThrow();
    });

    test('should save settings to localStorage', () => {
      audioManager.saveSettings();
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'citySlacker_audioSettings',
        expect.stringContaining('volumes')
      );
    });

    test('should handle localStorage save errors', () => {
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      
      expect(() => audioManager.saveSettings()).not.toThrow();
    });
  });

  describe('Get Settings', () => {
    test('should return current settings', () => {
      const settings = audioManager.getSettings();
      expect(settings).toHaveProperty('volumes');
      expect(settings).toHaveProperty('muted');
      expect(settings).toHaveProperty('initialized');
    });

    test('should return volumes object', () => {
      const settings = audioManager.getSettings();
      expect(settings.volumes).toHaveProperty('master');
      expect(settings.volumes).toHaveProperty('music');
      expect(settings.volumes).toHaveProperty('sfx');
    });

    test('should return copy of volumes (not reference)', () => {
      const settings = audioManager.getSettings();
      settings.volumes.master = 0.1;
      expect(audioManager.volumes.master).not.toBe(0.1);
    });
  });

  describe('Cleanup', () => {
    test('should close AudioContext on dispose', async () => {
      await audioManager.init();
      audioManager.dispose();
      expect(mockAudioContext.close).toHaveBeenCalled();
    });

    test('should reset initialized flag on dispose', async () => {
      await audioManager.init();
      audioManager.dispose();
      expect(audioManager.initialized).toBe(false);
    });

    test('should handle dispose when not initialized', () => {
      expect(() => audioManager.dispose()).not.toThrow();
    });
  });

  describe('Sound Configuration', () => {
    beforeEach(async () => {
      await audioManager.init();
    });

    test('cityUnlock should play sound', () => {
      audioManager.playSFX('cityUnlock');
      // cityUnlock plays 3 notes - just verify oscillators are created
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('milestone should play sound', () => {
      audioManager.playSFX('milestone');
      // milestone plays 4 notes in arpeggio - just verify oscillators are created
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    test('doubles should play sound', () => {
      audioManager.playSFX('doubles');
      // doubles plays 2 simultaneous notes - just verify oscillators are created
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });
});
