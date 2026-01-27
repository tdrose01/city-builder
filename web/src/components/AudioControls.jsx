import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audioManager';

/**
 * AudioControls Component
 * 
 * Provides UI for controlling game audio:
 * - Toggle button in HUD
 * - Expandable settings panel
 * - Volume sliders for master, music, SFX
 * - Mute/unmute toggle
 * - Visual feedback
 */

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [muted, setMuted] = useState(audioManager.muted);
  const [volumes, setVolumes] = useState(audioManager.volumes);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioManager.init();
      // Remove listener after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggleMute = () => {
    audioManager.toggleMute();
    setMuted(audioManager.muted);
    audioManager.playSFX('click');
  };

  const handleVolumeChange = (channel, value) => {
    const numValue = parseFloat(value);
    audioManager.setVolume(channel, numValue);
    setVolumes({ ...audioManager.volumes });
  };

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      audioManager.playSFX('click');
    }
  };

  return (
    <div className="audio-controls">
      {/* Toggle Button */}
      <button
        onClick={handleToggleMute}
        className="audio-toggle-btn"
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        title={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Settings Button */}
      <button
        onClick={handleTogglePanel}
        className="audio-settings-btn"
        aria-label="Audio settings"
        title="Audio settings"
      >
        ⚙️
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="audio-settings-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="audio-settings-header">
              <h3>Audio Settings</h3>
              <button
                onClick={handleTogglePanel}
                className="close-btn"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="audio-settings-content">
              {/* Master Volume */}
              <div className="volume-control">
                <label htmlFor="master-volume">
                  <span className="volume-label">Master Volume</span>
                  <span className="volume-value">{Math.round(volumes.master * 100)}%</span>
                </label>
                <input
                  id="master-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes.master}
                  onChange={(e) => handleVolumeChange('master', e.target.value)}
                  className="volume-slider"
                />
              </div>

              {/* Music Volume */}
              <div className="volume-control">
                <label htmlFor="music-volume">
                  <span className="volume-label">Music Volume</span>
                  <span className="volume-value">{Math.round(volumes.music * 100)}%</span>
                </label>
                <input
                  id="music-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes.music}
                  onChange={(e) => handleVolumeChange('music', e.target.value)}
                  className="volume-slider"
                  disabled
                  title="Music coming soon!"
                />
              </div>

              {/* SFX Volume */}
              <div className="volume-control">
                <label htmlFor="sfx-volume">
                  <span className="volume-label">SFX Volume</span>
                  <span className="volume-value">{Math.round(volumes.sfx * 100)}%</span>
                </label>
                <input
                  id="sfx-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes.sfx}
                  onChange={(e) => handleVolumeChange('sfx', e.target.value)}
                  className="volume-slider"
                />
              </div>

              {/* Test Sound Button */}
              <button
                onClick={() => audioManager.playSFX('success')}
                className="test-sound-btn"
              >
                🔊 Test Sound
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .audio-controls {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 100;
          display: flex;
          gap: 0.5rem;
        }

        .audio-toggle-btn,
        .audio-settings-btn {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .audio-toggle-btn:hover,
        .audio-settings-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .audio-settings-panel {
          position: absolute;
          top: 60px;
          right: 0;
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 1rem;
          min-width: 300px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .audio-settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .audio-settings-header h3 {
          color: white;
          margin: 0;
          font-size: 1.2rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: white;
        }

        .audio-settings-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .volume-control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .volume-control label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-size: 0.9rem;
        }

        .volume-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .volume-value {
          color: #10b981;
          font-weight: bold;
        }

        .volume-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          transition: all 0.2s;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          background: #34d399;
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .volume-slider::-moz-range-thumb:hover {
          background: #34d399;
          transform: scale(1.2);
        }

        .volume-slider:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .test-sound-btn {
          background: #10b981;
          border: none;
          border-radius: 8px;
          color: white;
          padding: 0.75rem;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .test-sound-btn:hover {
          background: #34d399;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 768px) {
          .audio-controls {
            top: 0.5rem;
            right: 0.5rem;
          }

          .audio-settings-panel {
            min-width: 250px;
          }
        }
      `}</style>
    </div>
  );
}
