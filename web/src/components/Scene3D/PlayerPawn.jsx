import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import useIdleAnimation from './useIdleAnimation';

const CHARACTER_PATH = '/kenney-characters/Models/GLB format/character-a.glb';
useGLTF.preload(CHARACTER_PATH);

const PlayerPawn = forwardRef(({
  position = [0, 0, 0],
  targetPosition = [0, 0, 0],
  isMoving = false,
  themeColor = '#00f3ff',
  hopHeight = 3,
  hopDuration = 600,
  animationState = 'AUTO',
  timeSinceLastRoll = Infinity,
  lastOutcome = 'neutral'
}, ref) => {
  const groupRef = useRef();
  const modelContainerRef = useRef();
  const particlesRef = useRef();

  const hopProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const isHopping = useRef(false);

  const gltf = useGLTF(CHARACTER_PATH);
  const sceneClone = useMemo(() => {
    const scene = gltf.scene.clone(true);

    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((material) => {
        if (!material) return;
        if ('map' in material && material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.needsUpdate = true;
        }
        if ('envMapIntensity' in material && material.envMapIntensity == null) {
          material.envMapIntensity = 1.05;
        }
        material.needsUpdate = true;
      });
    });

    return scene;
  }, [gltf.scene]);

  const { actions, names } = useAnimations(gltf.animations, modelContainerRef);

  const walkActionName = useMemo(
    () => names.find((n) => n === 'Walk') || names.find((n) => /walk|run|jog|move/i.test(n)) || names[0],
    [names]
  );
  const idleActionName = useMemo(
    () => names.find((n) => n === 'Idle') || names.find((n) => /idle|stand|breathe/i.test(n)) || names[0],
    [names]
  );
  const celebrateActionName = useMemo(
    () => names.find((n) => /celebrate|victory|cheer|dance|happy|taunt/i.test(n)),
    [names]
  );

  const shouldCelebrate = !isMoving && lastOutcome === 'win' && timeSinceLastRoll < 2000;

  React.useEffect(() => {
    if (!actions || names.length === 0) return;

    let nextAction;

    if (shouldCelebrate && celebrateActionName && actions[celebrateActionName]) {
      nextAction = actions[celebrateActionName];
      nextAction.reset();
      nextAction.setLoop(THREE.LoopOnce, 1);
      nextAction.clampWhenFinished = true;
    } else {
      const activeName = isMoving ? walkActionName : idleActionName;
      nextAction = actions[activeName];
      nextAction?.reset();
      nextAction?.setLoop(THREE.LoopRepeat, Infinity);
      if (nextAction) nextAction.clampWhenFinished = false;
    }

    if (!nextAction) return;

    Object.values(actions).forEach((action) => {
      if (action !== nextAction) action?.fadeOut(0.2);
    });

    nextAction.fadeIn(0.2).play();

    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions, names, isMoving, shouldCelebrate, celebrateActionName, walkActionName, idleActionName]);

  const particleCount = 20;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(),
      offset: Math.random() * 0.5
    }));
  }, []);

  const [{ pos }, api] = useSpring(() => ({
    pos: position,
    config: { tension: 120, friction: 14 }
  }));

  React.useEffect(() => {
    if (isMoving && targetPosition) {
      startPos.current.set(...position);
      endPos.current.set(...targetPosition);
      isHopping.current = true;
      hopProgress.current = 0;

      api.start({
        pos: targetPosition,
        config: { tension: 80, friction: 20, duration: hopDuration }
      });
    }
  }, [isMoving, targetPosition, position, api, hopDuration]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const idleAnimation = useIdleAnimation({ animationState, timeSinceLastRoll, lastOutcome, delta });

    if (!isMoving) {
      groupRef.current.position.y = idleAnimation.position.y;
      groupRef.current.rotation.y = idleAnimation.rotation.y;
      groupRef.current.rotation.x = idleAnimation.rotation.x || 0;
      groupRef.current.rotation.z = idleAnimation.rotation.z || 0;
      groupRef.current.scale.setScalar(idleAnimation.scale);
    }

    if (isHopping.current) {
      hopProgress.current += delta / (hopDuration / 1000);
      if (hopProgress.current >= 1) {
        isHopping.current = false;
        hopProgress.current = 0;
      }

      const hopT = hopProgress.current;
      const archHeight = Math.sin(hopT * Math.PI) * hopHeight;
      groupRef.current.position.y += archHeight;
      groupRef.current.rotation.y += delta * 4;
    }

    if (isHopping.current && particlesRef.current) {
      const geometry = particlesRef.current.geometry;
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const slot = hopProgress.current + p.offset;

        if (slot < 1 && slot > 0) {
          const t = slot;
          p.position.lerpVectors(startPos.current, endPos.current, t);
          p.position.y = Math.sin(t * Math.PI) * hopHeight * 0.7;
          positions[i * 3] = p.position.x;
          positions[i * 3 + 1] = p.position.y;
          positions[i * 3 + 2] = p.position.z;
        } else {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = -100;
          positions[i * 3 + 2] = 0;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    }
  });

  useImperativeHandle(ref, () => ({
    getPosition: () => groupRef.current?.position,
    hopTo: (target, duration = hopDuration) => {
      api.start({ pos: target, config: { duration } });
    },
  }));

  return (
    <group>
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
          <pointsMaterial size={0.1} color={themeColor} transparent opacity={0.6} sizeAttenuation />
        </points>
      )}

      <animated.group ref={groupRef} position={pos} castShadow>
        <group ref={modelContainerRef} position={[0, 0.3, 0]} scale={[0.5, 0.5, 0.5]}>
          <primitive object={sceneClone} />
        </group>

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.62, 32]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </animated.group>

      <mesh
        position={[isMoving ? targetPosition[0] : position[0], 0.01, isMoving ? targetPosition[2] : position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.25} />
      </mesh>
    </group>
  );
});

PlayerPawn.displayName = 'PlayerPawn';

export default PlayerPawn;
