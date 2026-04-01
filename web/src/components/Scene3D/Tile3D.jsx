import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html, Billboard, Points, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const KENNEY_BUILDING_BASE_PATH = '/kenney-city/Models/GLB format/';
const LEVEL_BUILDING_MODELS = {
  1: ['building-a.glb', 'building-b.glb', 'building-c.glb', 'building-d.glb', 'building-e.glb', 'building-f.glb'],
  2: ['building-g.glb', 'building-h.glb', 'building-i.glb', 'building-j.glb', 'building-k.glb', 'building-l.glb', 'building-m.glb', 'building-n.glb'],
  3: ['building-skyscraper-a.glb', 'building-skyscraper-b.glb', 'building-skyscraper-c.glb', 'building-skyscraper-d.glb', 'building-skyscraper-e.glb']
};

Object.values(LEVEL_BUILDING_MODELS)
  .flat()
  .forEach((file) => useGLTF.preload(`${KENNEY_BUILDING_BASE_PATH}${file}`));

const seededIndex = (seed, length) => {
  if (length <= 0) return 0;
  const normalized = Math.abs(Math.sin(seed * 127.1337) * 10000);
  return Math.floor(normalized) % length;
};

const KenneyBuilding = ({ tileId = 0, tileType = 'Funds', level = 0 }) => {
  const propertyLevel = Math.min(Math.max(level || 1, 1), 3);
  const candidates = LEVEL_BUILDING_MODELS[propertyLevel] || LEVEL_BUILDING_MODELS[1];

  const modelPath = useMemo(() => {
    const typeSeed = tileType.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = tileId * 37 + propertyLevel * 97 + typeSeed;
    const file = candidates[seededIndex(seed, candidates.length)];
    return `${KENNEY_BUILDING_BASE_PATH}${file}`;
  }, [tileId, tileType, propertyLevel, candidates]);

  const gltf = useGLTF(modelPath);
  const clonedScene = useMemo(() => {
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
          material.envMapIntensity = 1.1;
        }
        material.needsUpdate = true;
      });
    });

    return scene;
  }, [gltf.scene]);

  return (
    <group position={[0, 0.2, 0]} scale={[0.3, 0.3, 0.3]}>
      <primitive object={clonedScene} />
    </group>
  );
};

/**
 * Tile3D
 * Individual 3D tile with rounded box geometry and appropriate styling per type.
 */
const Tile3D = ({ 
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  type = 'Funds',
  name = 'Tile',
  themeColor = '#00f3ff',
  isCorner = false,
  onClick,
  payout,
  level = 0
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [iconBounce, setIconBounce] = useState(0);
  const [particles, setParticles] = useState(null);

  // Tile configuration based on type
  const tileConfig = useMemo(() => {
    const configs = {
      Start: {
        color: '#22c55e',
        emissive: '#15803d',
        emissiveIntensity: 0.3,
        rimLightColor: '#22c55e',
        rimLightIntensity: 0.8,
        icon: '★',
        height: 0.4,
        baseSize: 2.5,
        labelSize: 18,
        iconSize: 24,
        glowColor: '#22c55e',
        isSpecial: true
      },
      Funds: {
        color: themeColor,
        emissive: themeColor,
        emissiveIntensity: 0.2,
        rimLightColor: themeColor,
        rimLightIntensity: 0.6,
        icon: '💰',
        height: 0.25,
        baseSize: 2,
        labelSize: 16,
        iconSize: 22,
        glowColor: themeColor,
        isSpecial: false
      },
      Lottery: {
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.3,
        icon: '🎰',
        height: 0.3,
        baseSize: 2
      },
      Tax: {
        color: '#ef4444',
        emissive: '#b91c1c',
        emissiveIntensity: 0.2,
        icon: '💸',
        height: 0.25,
        baseSize: 2
      },
      Shield: {
        color: '#3b82f6',
        emissive: '#1d4ed8',
        emissiveIntensity: 0.3,
        icon: '🛡️',
        height: 0.25,
        baseSize: 2
      },
      Corner: {
        color: '#a855f7',
        emissive: '#7c3aed',
        emissiveIntensity: 0.4,
        rimLightColor: '#a855f7',
        rimLightIntensity: 0.8,
        icon: '🎁',
        height: 0.35,
        baseSize: 2.5,
        labelSize: 18,
        iconSize: 24,
        glowColor: '#a855f7',
        isSpecial: true
      },
      Heist: {
        color: '#7c2d12',
        emissive: '#451a03',
        emissiveIntensity: 0.2,
        icon: '🦹',
        height: 0.25,
        baseSize: 2
      },
      Landmark: {
        color: '#059669',
        emissive: '#047857',
        emissiveIntensity: 0.3,
        icon: '🏛️',
        height: 0.25 + (level * 0.1),
        baseSize: 2
      },
      Card: {
        color: '#ec4899',
        emissive: '#db2777',
        emissiveIntensity: 0.2,
        icon: '🃏',
        height: 0.25,
        baseSize: 2
      },
      Jail: {
        color: '#374151',
        emissive: '#1f2937',
        emissiveIntensity: 0.1,
        rimLightColor: '#374151',
        rimLightIntensity: 0.8,
        icon: '⛓️',
        height: 0.35,
        baseSize: 2.5,
        labelSize: 18,
        iconSize: 24,
        glowColor: '#f59e0b',
        isSpecial: true
      },
      Sticker: {
        color: '#8b5cf6',
        emissive: '#7c3aed',
        emissiveIntensity: 0.3,
        icon: '📖',
        height: 0.25,
        baseSize: 2
      },
      Shutdown: {
        color: '#dc2626',
        emissive: '#991b1b',
        emissiveIntensity: 0.4,
        icon: '⚡',
        height: 0.3,
        baseSize: 2
      },
      Bonus: {
        color: '#fbbf24',
        emissive: '#f59e0b',
        emissiveIntensity: 0.4,
        rimLightColor: '#fbbf24',
        rimLightIntensity: 0.8,
        icon: '🎉',
        height: 0.3,
        baseSize: 2,
        labelSize: 18,
        iconSize: 24,
        glowColor: '#fbbf24',
        isSpecial: true
      },
      Fortune: {
        color: '#06b6d4',
        emissive: '#0891b2',
        emissiveIntensity: 0.3,
        icon: '🔮',
        height: 0.28,
        baseSize: 2
      },
      Dice: {
        color: '#6366f1',
        emissive: '#4f46e5',
        emissiveIntensity: 0.2,
        icon: '🎲',
        height: 0.25,
        baseSize: 2
      },
      Rent: {
        color: '#84cc16',
        emissive: '#65a30d',
        emissiveIntensity: 0.2,
        icon: '🏠',
        height: 0.25,
        baseSize: 2
      },
      Default: {
        color: '#6b7280',
        emissive: '#4b5563',
        emissiveIntensity: 0.1,
        rimLightColor: '#6b7280',
        rimLightIntensity: 0.6,
        icon: '?',
        height: 0.25,
        baseSize: 2,
        labelSize: 16,
        iconSize: 22,
        glowColor: '#6b7280',
        isSpecial: false
      }
    };
    return configs[type] || configs.Default;
  }, [type, themeColor, level]);

  // Icon bounce animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIconBounce(prev => (prev + 1) % 2);
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate hover/pulse
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const baseY = position[1];
    
    // Subtle floating animation
    const floatY = Math.sin(time * 2 + id) * 0.02;
    
    // Pulse on hover
    const hoverScale = hovered ? 1.05 : 1;
    const targetScale = pulseScale * hoverScale;
    
    // Lift up effect on hover
    const liftY = hovered ? 0.2 : 0;
    
    meshRef.current.position.y = baseY + tileConfig.height / 2 + floatY + liftY;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
  });

  const size = isCorner ? tileConfig.baseSize : 2;
  const rounded = isCorner ? 0.3 : 0.15;
      
  return (
    <group position={position} rotation={rotation}>
      {/* Base platform */}
      <RoundedBox args={[size * 1.08, 0.22, size * 1.08]} radius={rounded + 0.08} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.45} metalness={0.35} envMapIntensity={0.7} />
      </RoundedBox>

      {/* Beveled accent rim */}
      <RoundedBox args={[size * 1.02, 0.1, size * 1.02]} position={[0, 0.12, 0]} radius={rounded + 0.04} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color={tileConfig.glowColor} roughness={0.3} metalness={0.25} emissive={tileConfig.glowColor} emissiveIntensity={hovered ? 0.2 : 0.08} envMapIntensity={0.9} />
      </RoundedBox>

      {/* Main tile surface */}
      <RoundedBox
        ref={meshRef}
        position={[0, 0.2, 0]}
        args={[size, tileConfig.height, size]}
        radius={rounded}
        smoothness={5}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={tileConfig.color}
          emissive={tileConfig.emissive}
          emissiveIntensity={hovered ? tileConfig.emissiveIntensity * 3 : tileConfig.emissiveIntensity}
          roughness={0.2}
          metalness={0.2}
          envMapIntensity={1}
        />
      </RoundedBox>
      
      {/* 3D buildings/props as primary tile visuals */}
      {!isCorner && (
        <Suspense fallback={null}>
          <group position={[0, 0.22 + tileConfig.height, 0]}>
            <KenneyBuilding tileId={id} tileType={type} level={level} />
          </group>
        </Suspense>
      )}
      
      {/* Tile label - HTML OVERLAY for guaranteed visibility */}
      <Billboard>
        <Html
          position={[0, tileConfig.height / 2 + 0.05, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '3px 10px',
            borderRadius: '6px',
            border: `2px solid ${tileConfig.color}`,
            color: 'white',
            fontSize: `${tileConfig.labelSize}px`,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: `0 0 8px ${tileConfig.glowColor}, 0 2px 4px rgba(0,0,0,0.8)`,
            transform: 'translateY(-50%)',
            boxShadow: `0 0 15px ${tileConfig.glowColor}40`,
          }}>
            {name.toUpperCase()}
          </div>
        </Html>
      </Billboard>
      
      
      {/* Icon emoji */}
      <Billboard>
        <Html
          position={[0, tileConfig.height / 2 + 0.05, 0.4]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{ 
            fontSize: `${tileConfig.iconSize}px`, 
            filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.6)) brightness(1.1)`,
            transform: iconBounce === 1 ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}>
            {tileConfig.icon}
          </div>
        </Html>
      </Billboard>
      
      {/* Payout text for Funds tiles */}
      {payout && (
        <Html
          position={[0, tileConfig.height / 2 + 0.05, -0.4]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: '#fbbf24',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}>
            +{payout}
          </div>
        </Html>
      )}
      
      {/* Level indicators for Landmark */}
      {type === 'Landmark' && level > 0 && (
        <group position={[0, tileConfig.height + 0.1, 0]}>
          {Array.from({ length: level }).map((_, i) => (
            <mesh
              key={i}
              position={[(i - (level - 1) / 2) * 0.15, 0, 0]}
            >
              <sphereGeometry args={[0.05]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Enhanced hover glow ring */}
      {hovered && (
        <>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 0.55, size * 0.65, 32]} />
            <meshBasicMaterial 
              color={tileConfig.glowColor} 
              transparent 
              opacity={0.8} 
              emissive={tileConfig.glowColor}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 0.65, size * 0.75, 32]} />
            <meshBasicMaterial 
              color={tileConfig.glowColor} 
              transparent 
              opacity={0.4} 
              emissive={tileConfig.glowColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        </>
      )}
      
      {/* Particle effects for special tiles */}
      {tileConfig.isSpecial && (
        <Points position={[0, tileConfig.height / 2 + 0.2, 0]}>
          <pointsMaterial
            size={0.05}
            color={tileConfig.glowColor}
            transparent
            opacity={0.6}
            sizeAttenuation={true}
          />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={20}
              array={new Float32Array(Array.from({ length: 20 }, () => (Math.random() - 0.5) * 2))}
              itemSize={3}
            />
          </bufferGeometry>
        </Points>
      )}
    </group>
  );
};

export default React.memo(Tile3D);
