import React, { useEffect, useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { RoundedBox, ContactShadows, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const Pip = memo(({ position }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.07, 16, 16]} />
    <meshStandardMaterial color="#222" roughness={0.8} />
  </mesh>
));

const DiceFaceNumber = memo(({ value, face }) => {
  const offset = 0.51;
  let pos = [0, 0, 0];
  let rot = [0, 0, 0];
  if (face === 1) { pos = [0, 0, offset]; rot = [0, 0, 0]; }
  if (face === 2) { pos = [offset, 0, 0]; rot = [0, Math.PI / 2, 0]; }
  if (face === 3) { pos = [0, 0, -offset]; rot = [0, Math.PI, 0]; }
  if (face === 4) { pos = [-offset, 0, 0]; rot = [0, -Math.PI / 2, 0]; }
  if (face === 5) { pos = [0, offset, 0]; rot = [-Math.PI / 2, 0, 0]; }
  if (face === 6) { pos = [0, -offset, 0]; rot = [Math.PI / 2, 0, 0]; }

  return (
    <Text
      position={pos}
      rotation={rot}
      fontSize={0.65}
      color="#00ffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.04}
      outlineColor="#000000"
    >
      {value}
    </Text>
  );
});

const DiceFacePips = ({ value, face }) => {
  const offset = 0.505; // Slightly outside the 1x1x1 cube

  const getPipPositions = (v) => {
    const pos = {
      tl: [-0.25, 0.25], tr: [0.25, 0.25],
      ml: [-0.25, 0], mr: [0.25, 0],
      bl: [-0.25, -0.25], br: [0.25, -0.25],
      c: [0, 0]
    };
    if (v === 1) return [pos.c];
    if (v === 2) return [pos.tl, pos.br];
    if (v === 3) return [pos.tl, pos.c, pos.br];
    if (v === 4) return [pos.tl, pos.tr, pos.bl, pos.br];
    if (v === 5) return [pos.tl, pos.tr, pos.c, pos.bl, pos.br];
    if (v === 6) return [pos.tl, pos.tr, pos.ml, pos.mr, pos.bl, pos.br];
    return [];
  };

  const positions = getPipPositions(value);

  return (
    <group>
      {positions.map((p, i) => {
        let pos;
        if (face === 1) pos = [p[0], p[1], offset]; // Front
        if (face === 2) { pos = [offset, p[1], -p[0]]; } // Right
        if (face === 3) { pos = [-p[0], p[1], -offset]; } // Back
        if (face === 4) { pos = [-offset, p[1], p[0]]; } // Left
        if (face === 5) { pos = [p[0], offset, -p[1]]; } // Top
        if (face === 6) { pos = [p[0], -offset, p[1]]; } // Bottom
        return <Pip key={i} position={pos} />;
      })}
    </group>
  );
};

const DiceCube = ({ position, rotation, value, rolling }) => {
  const meshRef = useRef();
  
  const faceRotations = {
    1: [0, 0, 0],
    2: [0, -Math.PI / 2, 0],
    3: [0, Math.PI, 0],
    4: [0, Math.PI / 2, 0],
    5: [Math.PI / 2, 0, 0],
    6: [-Math.PI / 2, 0, 0],
  };

  const targetRotation = faceRotations[value] || [0, 0, 0];

  const { springRotation, springPosition } = useSpring({
    springRotation: rolling ? [Math.PI * 4, Math.PI * 4, Math.PI * 4] : targetRotation,
    springPosition: rolling ? [position[0], position[1] + 1.5, position[2]] : position,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  useFrame(() => {
    if (rolling && meshRef.current) {
      meshRef.current.rotation.x += 0.2;
      meshRef.current.rotation.y += 0.25;
      meshRef.current.rotation.z += 0.15;
    }
  });

  useEffect(() => {
    if (!rolling && meshRef.current && meshRef.current.rotation) {
      if (typeof meshRef.current.rotation.set === 'function') {
        meshRef.current.rotation.set(0, 0, 0);
      } else {
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;
      }
    }
  }, [rolling]);

  return (
    <animated.group position={springPosition} rotation={springRotation}>
      <animated.mesh ref={meshRef} castShadow>
        <RoundedBox args={[1, 1, 1]} radius={0.12} smoothness={4}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#111111" 
            roughness={0.15} 
            metalness={0.3} 
            envMapIntensity={2.0}
          />
        </RoundedBox>
        
        {/* Pips for all faces (subtle) */}
        <DiceFacePips value={1} face={1} />
        <DiceFacePips value={2} face={2} />
        <DiceFacePips value={3} face={3} />
        <DiceFacePips value={4} face={4} />
        <DiceFacePips value={5} face={5} />
        <DiceFacePips value={6} face={6} />

        {/* Numbers for all faces (Neon Cyan) */}
        <DiceFaceNumber value={1} face={1} />
        <DiceFaceNumber value={2} face={2} />
        <DiceFaceNumber value={3} face={3} />
        <DiceFaceNumber value={4} face={4} />
        <DiceFaceNumber value={5} face={5} />
        <DiceFaceNumber value={6} face={6} />
      </animated.mesh>
    </animated.group>
  );
};

function ThreeDice({ rolling, value1, value2 }) {
  return (
    <div className="three-dice-container" style={{ 
      width: '100%', 
      height: '100%', 
      position: 'absolute', 
      pointerEvents: 'none',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      WebkitFontSmoothing: 'antialiased'
    }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 4, 6], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        
        <DiceCube position={[-0.8, 0, 0]} value={value1 || 1} rolling={rolling} />
        <DiceCube position={[0.8, 0, 0]} value={value2 || 6} rolling={rolling} />
        
        <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(ThreeDice);
