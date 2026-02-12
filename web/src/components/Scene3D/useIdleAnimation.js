import { useRef } from 'react';
import * as THREE from 'three';

/**
 * Enhanced idle animation system for player pawn
 * Provides different animation states based on game events
 */
export const useIdleAnimation = (props) => {
  const { 
    animationState = 'IDLE',
    timeSinceLastRoll = Infinity,
    lastOutcome = 'neutral',
    delta 
  } = props;
  
  const time = useRef(0);
  time.current += delta;
  
  // State transition logic
  const getAnimationState = () => {
    if (lastOutcome === 'win' && timeSinceLastRoll < 2000) {
      return 'EXCITED';
    } else if (timeSinceLastRoll > 10000) {
      return 'BORED';
    }
    return 'IDLE';
  };
  
  // Calculate animation values for each state
  const calculateIdle = (t) => {
    const bobY = Math.sin(t * 2) * 0.05;
    const rotY = Math.sin(t * 0.5) * 0.1;
    const scale = 1.0;
    const emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.1;
    
    return {
      position: { y: bobY + 0.5 },
      rotation: { y: rotY },
      scale: scale,
      emissiveIntensity: emissiveIntensity,
      particleActive: false
    };
  };
  
  const calculateExcited = (t) => {
    const bounceY = Math.sin(t * 8) * 0.15;
    const rotY = Math.sin(t * 4) * 0.3;
    const scale = 1.0 + Math.sin(t * 6) * 0.1;
    const emissiveIntensity = 0.8 + Math.sin(t * 10) * 0.3;
    
    return {
      position: { y: bounceY + 0.5 },
      rotation: { y: rotY },
      scale: scale,
      emissiveIntensity: emissiveIntensity,
      particleActive: true
    };
  };
  
  const calculateBored = (t) => {
    const driftY = Math.sin(t * 0.8) * 0.03;
    const rotY = (time.current * 0.1) % (Math.PI * 2); // Linear rotation
    const scale = 1.0;
    const emissiveIntensity = 0.2 + Math.sin(t * 0.5) * 0.05;
    
    // Random direction changes
    const directionChange = Math.floor(time.current / 5) % 2;
    const rotX = directionChange * 0.1;
    const rotZ = (1 - directionChange) * 0.1;
    
    return {
      position: { y: driftY + 0.5 },
      rotation: { y: rotY, x: rotX, z: rotZ },
      scale: scale,
      emissiveIntensity: emissiveIntensity,
      particleActive: false
    };
  };
  
  // Determine current animation state
  const currentState = animationState === 'AUTO' ? getAnimationState() : animationState;
  
  // Calculate animation values
  let animation;
  switch (currentState) {
    case 'IDLE':
      animation = calculateIdle(time.current);
      break;
    case 'EXCITED':
      animation = calculateExcited(time.current);
      break;
    case 'BORED':
      animation = calculateBored(time.current);
      break;
    default:
      animation = calculateIdle(time.current);
  }
  
  return {
    ...animation,
    currentState,
    time: time.current
  };
};

export default useIdleAnimation;