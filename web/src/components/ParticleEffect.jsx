import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * ParticleEffect Component
 * 
 * Reusable particle system supporting multiple effect types:
 * - burst: Explosive radial burst
 * - confetti: Falling colored rectangles
 * - stars: Twinkling star shapes
 * - sparkles: Quick sparkle flashes
 * - coins: Spinning coin effect
 * - fireworks: Upward explosion effect
 * - trail: Following trail effect
 * 
 * Features:
 * - City-specific colors
 * - GPU-accelerated animations
 * - Configurable count, size, duration
 * - Auto-cleanup after animation
 * - Respects prefers-reduced-motion
 */

const PARTICLE_TYPES = {
  burst: {
    shape: 'circle',
    animation: (distance, angle, duration) => ({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0.5]
    }),
    transition: { ease: 'easeOut' }
  },
  confetti: {
    shape: 'rectangle',
    animation: (distance) => ({
      y: distance * 2,
      x: (Math.random() - 0.5) * 100,
      opacity: [1, 1, 0],
      rotate: [0, Math.random() * 720 - 360]
    }),
    transition: { ease: [0.25, 0.46, 0.45, 0.94] }
  },
  stars: {
    shape: 'star',
    animation: (distance, angle) => ({
      x: Math.cos(angle) * distance * 0.5,
      y: Math.sin(angle) * distance * 0.5,
      opacity: [0, 1, 1, 0],
      scale: [0, 1.5, 1, 0],
      rotate: [0, 180]
    }),
    transition: { ease: 'easeInOut' }
  },
  sparkles: {
    shape: 'sparkle',
    animation: () => ({
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0]
    }),
    transition: { ease: 'easeInOut', duration: 0.6 }
  },
  coins: {
    shape: 'circle',
    animation: (distance, angle) => ({
      y: -distance * 0.8,
      x: Math.cos(angle) * distance * 0.3,
      opacity: [1, 1, 0],
      rotateY: [0, 720],
      scale: [1, 1.2, 0.8]
    }),
    transition: { ease: [0.34, 1.56, 0.64, 1] }
  },
  fireworks: {
    shape: 'circle',
    animation: (distance, angle) => ({
      x: Math.cos(angle) * distance * 1.5,
      y: Math.sin(angle) * distance * 1.5 - 100,
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 0.5]
    }),
    transition: { ease: 'easeOut', duration: 1.2 }
  },
  trail: {
    shape: 'circle',
    animation: (distance, angle, duration, delay) => ({
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5]
    }),
    transition: { ease: 'linear' }
  }
};

const CITY_COLORS = {
  1: ['#10b981', '#34d399', '#6ee7b7'], // Green (Emerald City)
  2: ['#fbbf24', '#fcd34d', '#fde68a'], // Gold (Deco Heights)
  3: ['#a855f7', '#c084fc', '#e9d5ff'], // Purple (Crystal Plaza)
  4: ['#3b82f6', '#60a5fa', '#93c5fd'], // Blue (Starlight District)
  5: ['#06b6d4', '#22d3ee', '#67e8f9'], // Cyan (Neon Skyline)
};

const ParticleShape = ({ type, color, size }) => {
  const baseStyle = {
    width: size,
    height: size,
    position: 'absolute',
    pointerEvents: 'none',
  };

  switch (type) {
    case 'circle':
      return (
        <div
          style={{
            ...baseStyle,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 ${size / 2}px ${color}80`,
          }}
        />
      );
    
    case 'rectangle':
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: color,
            borderRadius: '2px',
            boxShadow: `0 2px 4px ${color}40`,
          }}
        />
      );
    
    case 'star':
      return (
        <div
          style={{
            ...baseStyle,
            color: color,
            fontSize: size,
            lineHeight: '1',
            textShadow: `0 0 ${size / 2}px ${color}`,
          }}
        >
          ★
        </div>
      );
    
    case 'sparkle':
      return (
        <div
          style={{
            ...baseStyle,
            color: color,
            fontSize: size,
            lineHeight: '1',
            textShadow: `0 0 ${size / 2}px ${color}`,
          }}
        >
          ✨
        </div>
      );
    
    default:
      return (
        <div
          style={{
            ...baseStyle,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      );
  }
};

const Particle = ({ type, x, y, size, duration, angle, distance, delay, colors, index }) => {
  const particleType = PARTICLE_TYPES[type] || PARTICLE_TYPES.burst;
  const color = colors[index % colors.length];
  
  const animation = particleType.animation(distance, angle, duration, delay);
  const transition = {
    ...particleType.transition,
    duration: duration,
    delay: delay,
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={animation}
      transition={transition}
    >
      <ParticleShape type={particleType.shape} color={color} size={size} />
    </motion.div>
  );
};

const ParticleEffect = ({ 
  x = 0, 
  y = 0, 
  count = 20, 
  type = 'burst',
  cityLevel = 1,
  customColors = null,
  size = 8,
  minSize = 5,
  maxSize = 12,
  duration = 1,
  distance = 100,
  spread = 360,
  onComplete = null
}) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Reduce particle count for reduced motion
  const effectiveCount = prefersReducedMotion ? Math.min(count, 5) : count;
  const effectiveDuration = prefersReducedMotion ? duration * 0.5 : duration;

  // Get city-specific colors or use custom colors
  const colors = customColors || CITY_COLORS[cityLevel] || CITY_COLORS[1];

  const particles = useMemo(() => {
    return Array.from({ length: effectiveCount }, (_, i) => {
      const angleOffset = (spread / effectiveCount) * i;
      const angle = (angleOffset * Math.PI) / 180;
      const randomDistance = distance + (Math.random() - 0.5) * distance * 0.3;
      const particleSize = Math.random() * (maxSize - minSize) + minSize;
      const particleDuration = effectiveDuration + (Math.random() - 0.5) * effectiveDuration * 0.3;
      const delay = Math.random() * 0.2;

      return {
        key: `${type}-${i}-${Date.now()}`,
        angle,
        distance: randomDistance,
        size: particleSize,
        duration: particleDuration,
        delay,
        index: i,
      };
    });
  }, [effectiveCount, type, distance, effectiveDuration, maxSize, minSize, spread]);

  // Call onComplete after all particles finish
  useMemo(() => {
    if (onComplete) {
      const maxDuration = Math.max(...particles.map(p => p.duration + p.delay));
      const timer = setTimeout(onComplete, maxDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [particles, onComplete]);

  if (prefersReducedMotion && type === 'sparkles') {
    // Skip sparkles entirely in reduced motion mode
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      {particles.map((particle) => (
        <Particle
          key={particle.key}
          type={type}
          x={x}
          y={y}
          size={particle.size}
          duration={particle.duration}
          angle={particle.angle}
          distance={particle.distance}
          delay={particle.delay}
          colors={colors}
          index={particle.index}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
