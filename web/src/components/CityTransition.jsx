import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * CityTransition Component
 * 
 * Handles smooth transitions between cities with celebration effects.
 * Multi-stage animation: fade-out → celebration → zoom → fade-in
 * 
 * Features:
 * - City-specific particle colors
 * - Respects prefers-reduced-motion
 * - GPU-accelerated transforms
 * - Non-blocking (game state updates during animation)
 */

const CITY_CELEBRATION_CONFIG = {
  2: {
    name: 'Deco Heights',
    color: '#fbbf24', // Gold
    particles: '✨',
    message: 'Welcome to the Golden Age!',
    emoji: '🏛️'
  },
  3: {
    name: 'Crystal Plaza',
    color: '#a855f7', // Purple
    particles: '⭐',
    message: 'Enter the Crystal Realm!',
    emoji: '💎'
  },
  4: {
    name: 'Starlight District',
    color: '#3b82f6', // Blue
    particles: '🎆',
    message: 'Reach for the Stars!',
    emoji: '🌟'
  },
  5: {
    name: 'Neon Skyline',
    color: '#06b6d4', // Cyan
    particles: '⚡',
    message: 'The Future Awaits!',
    emoji: '🌃'
  }
};

export default function CityTransition({ 
  targetCityLevel, 
  onComplete, 
  isActive 
}) {
  const [stage, setStage] = useState('idle'); // idle, fadeOut, celebration, zoom, fadeIn, complete
  const [particles, setParticles] = useState([]);

  const config = CITY_CELEBRATION_CONFIG[targetCityLevel] || CITY_CELEBRATION_CONFIG[2];

  // Check for reduced motion preference (with fallback for test environments)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const generateParticles = useCallback(() => {
    if (prefersReducedMotion) return;

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.4,
      symbol: config.particles
    }));
    setParticles(newParticles);
  }, [prefersReducedMotion, config.particles]);

  useEffect(() => {
    if (!isActive) return;

    // Start transition sequence
    const sequence = async () => {
      // Stage 1: Fade Out (300ms)
      setStage('fadeOut');
      await new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 100 : 300));

      // Stage 2: Celebration (1000ms)
      setStage('celebration');
      generateParticles();
      await new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 300 : 1000));

      // Stage 3: Zoom (400ms)
      setStage('zoom');
      await new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 100 : 400));

      // Stage 4: Fade In (300ms)
      setStage('fadeIn');
      await new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 100 : 300));

      // Complete
      setStage('complete');
      if (onComplete) {
        onComplete();
      }
    };

    sequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, targetCityLevel, generateParticles, prefersReducedMotion]);

  if (!isActive || stage === 'complete') {
    return null;
  }

  return (
    <motion.div
        className="city-transition-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
          backgroundColor: 'rgba(0, 0, 0, 0.95)'
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: stage === 'fadeOut' || stage === 'fadeIn' ? 1 : 1 
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
      >
        {/* Idle & Fade Out Stages - just dark overlay, no content needed */}
        {(stage === 'idle' || stage === 'fadeOut') && <div style={{ width: '100%', height: '100%' }} />}

        {/* Celebration Stage */}
        {stage === 'celebration' && (
          <motion.div
            className="celebration-content"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: prefersReducedMotion ? 'tween' : 'spring', 
              stiffness: 200, 
              damping: 20 
            }}
            style={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 10
            }}
          >
            <motion.div
              style={{
                fontSize: '80px',
                marginBottom: '20px'
              }}
              animate={prefersReducedMotion ? {} : { 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {config.emoji}
            </motion.div>

            <motion.div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: config.color,
                marginBottom: '16px',
                textShadow: `0 0 20px ${config.color}80`
              }}
              animate={prefersReducedMotion ? {} : { 
                scale: [0.9, 1.05, 1] 
              }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
            >
              {config.name}
            </motion.div>

            <motion.div
              style={{
                fontSize: '24px',
                color: '#ffffff',
                opacity: 0.9
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {config.message}
            </motion.div>
          </motion.div>
        )}

        {/* Particle Effects */}
        {stage === 'celebration' && !prefersReducedMotion && (
          <div className="particles-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="particle"
                style={{
                  position: 'absolute',
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  fontSize: '24px',
                  pointerEvents: 'none',
                  willChange: 'transform, opacity'
                }}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0.5],
                  y: [-50, 50],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeOut'
                }}
              >
                {particle.symbol}
              </motion.div>
            ))}
          </div>
        )}

        {/* Zoom Stage */}
        {stage === 'zoom' && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: prefersReducedMotion ? 1 : 1.5, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
            style={{
              fontSize: '120px',
              color: config.color
            }}
          >
            {config.emoji}
          </motion.div>
        )}

        {/* Fade In Stage (transparent, just overlay) */}
        {stage === 'fadeIn' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 1)'
            }}
          />
        )}
      </motion.div>
  );
}

// PropTypes removed for React 19 compatibility
