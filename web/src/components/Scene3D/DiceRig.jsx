import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DiceRig
 * 3D Dice integrated into the board scene (not DOM overlay).
 * Replaces the separate ThreeDice overlay component.
 * 
 * Features:
 * - Physics-based rolling animation
 * - Settles on correct face
 * - Glow effects on roll
 * - Positioned near center of board
 */
const DiceRig = forwardRef(({
  position = [0, 2, 0],
  scale = 0.5,
  onRollComplete
}, ref) => {
  const groupRef = useRef();
  const dice1Ref = useRef();
  const dice2Ref = useRef();
  
  const [isRolling, setIsRolling] = useState(false);
  const animationRef = useRef(null);
  
  // Target rotations for each face
  const faceRotations = useRef({
    1: { x: 0, y: 0, z: 0 },
    2: { x: -Math.PI / 2, y: 0, z: 0 },
    3: { x: 0, y: Math.PI / 2, z: 0 },
    4: { x: 0, y: -Math.PI / 2, z: 0 },
    5: { x: Math.PI / 2, y: 0, z: 0 },
    6: { x: Math.PI, y: 0, z: 0 }
  });

  // Dice dot patterns
  const getDots = (face) => {
    const patterns = {
      1: [[0, 0]],
      2: [[-0.3, 0.3], [0.3, -0.3]],
      3: [[0, 0], [-0.3, 0.3], [0.3, -0.3]],
      4: [[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]],
      5: [[0, 0], [-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]],
      6: [[-0.3, 0.3], [0.3, 0.3], [-0.3, 0], [0.3, 0], [-0.3, -0.3], [0.3, -0.3]]
    };
    return patterns[face] || [];
  };

  // Roll animation
  const animateRoll = (target1, target2, duration = 1500) => {
    if (!dice1Ref.current || !dice2Ref.current) return;
    
    setIsRolling(true);
    const startTime = Date.now();
    
    // Random starting rotations
    dice1Ref.current.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    dice2Ref.current.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    // Target rotations
    const target1Rot = faceRotations.current[target1];
    const target2Rot = faceRotations.current[target2];
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Add tumble during roll
      if (progress < 0.7) {
        const tumble = (1 - progress / 0.7) * 4;
        dice1Ref.current.rotation.x += 0.2 * tumble;
        dice1Ref.current.rotation.y += 0.15 * tumble;
        dice2Ref.current.rotation.x -= 0.18 * tumble;
        dice2Ref.current.rotation.z += 0.12 * tumble;
        
        // Slight height animation
        const bounce = Math.sin(progress * Math.PI * 3);
        dice1Ref.current.position.y = bounce * 0.3;
        dice2Ref.current.position.y = bounce * 0.3;
      }
      
      // Settle to target
      if (progress >= 0.7) {
        const settleProgress = (progress - 0.7) / 0.3;
        
        dice1Ref.current.rotation.x = THREE.MathUtils.lerp(
          dice1Ref.current.rotation.x,
          target1Rot.x,
          settleProgress
        );
        dice1Ref.current.rotation.y = THREE.MathUtils.lerp(
          dice1Ref.current.rotation.y,
          target1Rot.y,
          settleProgress
        );
        dice1Ref.current.rotation.z = THREE.MathUtils.lerp(
          dice1Ref.current.rotation.z,
          target1Rot.z,
          settleProgress
        );
        
        dice2Ref.current.rotation.x = THREE.MathUtils.lerp(
          dice2Ref.current.rotation.x,
          target2Rot.x,
          settleProgress
        );
        dice2Ref.current.rotation.y = THREE.MathUtils.lerp(
          dice2Ref.current.rotation.y,
          target2Rot.y,
          settleProgress
        );
        dice2Ref.current.rotation.z = THREE.MathUtils.lerp(
          dice2Ref.current.rotation.z,
          target2Rot.z,
          settleProgress
        );
        
        // Reset height
        dice1Ref.current.position.y = THREE.MathUtils.lerp(
          dice1Ref.current.position.y,
          0,
          settleProgress
        );
        dice2Ref.current.position.y = THREE.MathUtils.lerp(
          dice2Ref.current.position.y,
          0,
          settleProgress
        );
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsRolling(false);
        onRollComplete?.(target1, target2);
      }
    };
    
    animate();
  };

  // Expose API
  useImperativeHandle(ref, () => ({
    roll: (die1, die2, duration) => {
      animateRoll(die1, die2, duration);
    },
    
    quickRoll: (die1, die2) => {
      animateRoll(die1, die2, 800);
    },
    
    reset: () => {
      if (dice1Ref.current) {
        dice1Ref.current.rotation.set(0, 0, 0);
        dice1Ref.current.position.y = 0;
      }
      if (dice2Ref.current) {
        dice2Ref.current.rotation.set(0, 0, 0);
        dice2Ref.current.position.y = 0;
      }
      setIsRolling(false);
    },
    
    isRolling: () => isRolling
  }));

  const DiceFace = ({ face, color = 'white' }) => {
    const dots = getDots(face);
    
    return (
      <group>
        <RoundedBox
          args={[1, 1, 1]}
          radius={0.1}
          smoothness={4}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.1}
            emissive={isRolling ? '#ffaa00' : '#000000'}
            emissiveIntensity={isRolling ? 0.3 : 0}
          />
        </RoundedBox>
        {/* Dots texture */}
        {dots.map(([x, y], i) => (
          <mesh
            key={i}
            position={[x, y, 0.51]}
          >
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        ))}
      </group>
    );
  };

  const FullDie = ({ face }, ref) => (
    <group ref={ref} scale={scale}>
      {/* Front face (face value visible) */}
      <group position={[0, 0, 0.5]}>
        <DiceFace face={face} />
      </group>
      {/* Back (6) */}
      <group position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
        <DiceFace face={6} />
      </group>
      {/* Right (3) */}
      <group position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <DiceFace face={3} />
      </group>
      {/* Left (4) */}
      <group position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <DiceFace face={4} />
      </group>
      {/* Top (2) */}
      <group position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <DiceFace face={2} />
      </group>
      {/* Bottom (5) */}
      <group position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <DiceFace face={5} />
      </group>
    </group>
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Glow effect during roll */}
      {isRolling && (
        <pointLight
          position={[0, 2, 0]}
          color="#ffaa00"
          intensity={2}
          distance={5}
        />
      )}
      
      {/* Die 1 */}
      <group ref={dice1Ref} position={[-1.2, 0, 0]}>
        <FullDie face={1} ref={dice1Ref} />
      </group>
      
      {/* Die 2 */}
      <group ref={dice2Ref} position={[1.2, 0, 0]}>
        <FullDie face={1} ref={dice2Ref} />
      </group>
    </group>
  );
});

DiceRig.displayName = 'DiceRig';

export default DiceRig;
