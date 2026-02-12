import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useIdleAnimation from './useIdleAnimation';

/**
 * PlayerPawn
 * 3D player piece that hops between tiles with parabolic arc animation.
 * Uses @react-spring/three for physics-based movement.
 */
const PlayerPawn = forwardRef(({
  position = [0, 0, 0],
  targetPosition = [0, 0, 0],
  isMoving = false,
  themeColor = '#00f3ff',
  hopHeight = 3,
  hopDuration = 600, // ms
  animationState = 'AUTO',
  timeSinceLastRoll = Infinity,
  lastOutcome = 'neutral'
}, ref) => {
  const meshRef = useRef();
  const particlesRef = useRef();
  const idleTimeRef = useRef(0);

  // Animation state
  const hopProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const isHopping = useRef(false);

  // Particle system for hop trail
  const particleCount = 20;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      active: false,
      position: new THREE.Vector3(),
      life: 0,
      offset: Math.random() * 0.5
    }));
  }, []);

  // Spring animation for smooth movement
  const [{ pos }, api] = useSpring(() => ({
    pos: position,
    config: { tension: 120, friction: 14 }
  }));

  // Update when target changes
  React.useEffect(() => {
    if (isMoving && targetPosition) {
      startPos.current.set(...position);
      endPos.current.set(...targetPosition);
      isHopping.current = true;
      hopProgress.current = 0;

      // Animate position with spring
      api.start({
        pos: targetPosition,
        config: {
          tension: 80,
          friction: 20,
          duration: hopDuration
        }
      });
    }
  }, [isMoving, targetPosition, position, api, hopDuration]);

  // Animate each frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Enhanced idle animation
    const idleAnimation = useIdleAnimation({
      animationState,
      timeSinceLastRoll,
      lastOutcome,
      delta
    });

    // Apply enhanced idle animation when not moving
    if (!isMoving) {
      const { position: animPos, rotation: animRot, scale: animScale, emissiveIntensity } = idleAnimation;

      meshRef.current.position.y = animPos.y;
      meshRef.current.rotation.y = animRot.y;
      meshRef.current.rotation.x = animRot.x || 0;
      meshRef.current.rotation.z = animRot.z || 0;
      meshRef.current.scale.setScalar(animScale);

      // Update emissive materials
      if (meshRef.current.material) {
        if (Array.isArray(meshRef.current.material)) {
          meshRef.current.material.forEach(mat => {
            if (mat.emissive) {
              mat.emissiveIntensity = emissiveIntensity;
            }
          });
        } else if (meshRef.current.material.emissive) {
          meshRef.current.material.emissiveIntensity = emissiveIntensity;
        }
      }
    }

    // Particle trail during hop
    if (isHopping.current) {
      hopProgress.current += delta / (hopDuration / 1000);

      if (hopProgress.current >= 1) {
        isHopping.current = false;
        hopProgress.current = 0;
      }

      // Add parabolic Y offset during hop
      const hopT = hopProgress.current;
      const archHeight = Math.sin(hopT * Math.PI) * hopHeight;
      meshRef.current.position.y += archHeight;

      // Spin during hop
      meshRef.current.rotation.y += delta * 8;
      meshRef.current.rotation.x = Math.sin(hopT * Math.PI * 2) * 0.3;
    }

    // Update particles
    const showParticles = isHopping.current || idleAnimation.particleActive;

    if (showParticles && particlesRef.current) {
      const geometry = particlesRef.current.geometry;
      const positions = geometry.attributes.position.array;

      if (isHopping.current) {
        // Hop trail particles
        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          const slot = hopProgress.current + p.offset;

          if (slot < 1 && slot > 0) {
            // Interpolate along hop path
            const t = slot;
            p.position.lerpVectors(startPos.current, endPos.current, t);
            p.position.y = Math.sin(t * Math.PI) * hopHeight * 0.7;

            positions[i * 3] = p.position.x;
            positions[i * 3 + 1] = p.position.y;
            positions[i * 3 + 2] = p.position.z;
          } else {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = -100; // Hide
            positions[i * 3 + 2] = 0;
          }
        }
      } else if (idleAnimation.particleActive) {
        // Excited state particles - floating around pawn
        const excitedPos = meshRef.current.position;

        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2 + time * 2;
          const radius = 0.8 + Math.sin(time * 3 + i) * 0.2;
          const height = Math.sin(time * 4 + i * 0.5) * 0.3;

          positions[i * 3] = excitedPos.x + Math.cos(angle) * radius;
          positions[i * 3 + 1] = excitedPos.y + height;
          positions[i * 3 + 2] = excitedPos.z + Math.sin(angle) * radius;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    }
  });

  // Expose API
  useImperativeHandle(ref, () => ({
    getPosition: () => meshRef.current?.position,
    hopTo: (target, duration = hopDuration) => {
      api.start({
        pos: target,
        config: { duration }
      });
    },
    setAnimationState: (state) => {
      // This could be used to manually control animation state
      console.log('Animation state set to:', state);
    }
  }));

  return (
    <group>
      {/* Hop trail particles */}
      {isMoving && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={new Float32Array(particleCount * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color={themeColor}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}

      {/* Main pawn mesh */}
      <animated.mesh ref={meshRef} position={pos} castShadow>
        {/* Pawn body - stylized token shape */}
        <group>
          {/* Base */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
            <meshStandardMaterial
              color={themeColor}
              metalness={0.6}
              roughness={0.2}
              emissive={themeColor}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Middle section */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 0.4, 16]} />
            <meshStandardMaterial
              color="white"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Top glow orb */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={themeColor}
              emissive={themeColor}
              emissiveIntensity={0.8}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>

          {/* Inner core */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>

        {/* Glow ring */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial
            color={themeColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </animated.mesh>

      {/* Shadow blob (fake shadow for performance) */}
      <mesh
        position={[
          isMoving ? targetPosition[0] : position[0],
          0.01,
          isMoving ? targetPosition[2] : position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
    </group>
  );
});

PlayerPawn.displayName = 'PlayerPawn';

export default PlayerPawn;
