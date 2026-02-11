import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import CoinExplosion from './VFX/CoinExplosion';
import LevelUpBurst from './VFX/LevelUpBurst';
import InstancedParticles from './VFX/InstancedParticles';

/**
 * VFXManager
 * Centralized manager for all 3D visual effects.
 * Provides unified API for triggering effects from game logic.
 */
const VFXManager = forwardRef((props, ref) => {
  const coinExplosionRef = useRef();
  const levelUpRef = useRef();
  const particlesRef = useRef();

  // Expose unified VFX API
  useImperativeHandle(ref, () => ({
    // Coin effects
    coinExplosion: (x, y, z, options) => {
      coinExplosionRef.current?.explode(x, y, z, options);
    },
    
    coinFountain: (x, y, z, options) => {
      coinExplosionRef.current?.fountain(x, y, z, options);
    },
    
    // Level up/Achievement effects
    levelUp: (x, y, z, options) => {
      levelUpRef.current?.burst(x, y, z, {
        colors: 'gold',
        shapes: 'mixed',
        amount: 100,
        ...options
      });
    },
    
    achievement: (x, y, z, options) => {
      levelUpRef.current?.burst(x, y, z, {
        colors: 'rainbow',
        shapes: 'star',
        amount: 150,
        ...options
      });
    },
    
    celebration: (x, y, z, options) => {
      // Combo: coins + burst
      coinExplosionRef.current?.explode(x, y + 1, z, {
        amount: 50,
        power: 8,
        ...options?.coinOptions
      });
      setTimeout(() => {
        levelUpRef.current?.burst(x, y + 2, z, {
          colors: 'neon',
          shapes: 'mixed',
          amount: 80,
          ...options?.burstOptions
        });
      }, 100);
    },
    
    spiralEffect: (x, y, z, options) => {
      levelUpRef.current?.spiral(x, y, z, options);
    },
    
    // Generic particles
    emitParticles: (x, y, z, options) => {
      particlesRef.current?.emit(x, y, z, options);
    },
    
    // Utility - stop all effects
    clear: () => {
      // Effects auto-expire, but could add immediate clear here
    }
  }));

  return (
    <group>
      <CoinExplosion ref={coinExplosionRef} />
      <LevelUpBurst ref={levelUpRef} />
      <InstancedParticles ref={particlesRef} />
    </group>
  );
});

VFXManager.displayName = 'VFXManager';

export default VFXManager;
