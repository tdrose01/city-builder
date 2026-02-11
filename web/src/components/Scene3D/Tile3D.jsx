import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

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

  // Tile configuration based on type
  const tileConfig = useMemo(() => {
    const configs = {
      Start: {
        color: '#22c55e',
        emissive: '#15803d',
        icon: '★',
        height: 0.4,
        baseSize: 2.5
      },
      Funds: {
        color: themeColor,
        emissive: themeColor,
        emissiveIntensity: 0.2,
        icon: '💰',
        height: 0.25,
        baseSize: 2
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
        icon: '🎁',
        height: 0.35,
        baseSize: 2.5
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
        icon: '⛓️',
        height: 0.35,
        baseSize: 2.5
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
        icon: '🎉',
        height: 0.3,
        baseSize: 2
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
        icon: '?',
        height: 0.25,
        baseSize: 2
      }
    };
    return configs[type] || configs.Default;
  }, [type, themeColor, level]);

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
    
    meshRef.current.position.y = baseY + floatY + tileConfig.height / 2;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
  });

  const size = isCorner ? tileConfig.baseSize : 2;
  const rounded = isCorner ? 0.3 : 0.15;

  return (
    <group position={position} rotation={rotation}>
      {/* Main tile mesh */}
      <RoundedBox
        ref={meshRef}
        args={[size, tileConfig.height, size]}
        radius={rounded}
        smoothness={4}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={tileConfig.color}
          emissive={tileConfig.emissive}
          emissiveIntensity={hovered ? tileConfig.emissiveIntensity * 2 : tileConfig.emissiveIntensity}
          roughness={0.3}
          metalness={0.4}
        />
      </RoundedBox>
      
      {/* Tile label - HTML OVERLAY for guaranteed visibility */}
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
          background: 'rgba(0,0,0,0.7)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: `1px solid ${tileConfig.color}`,
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          transform: 'translateY(-50%)',
        }}>
          {name.toUpperCase()}
        </div>
      </Html>
      
      {/* Icon emoji */}
      <Html
        position={[0, tileConfig.height / 2 + 0.05, 0.4]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ fontSize: '18px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
          {tileConfig.icon}
        </div>
      </Html>
      
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
      
      {/* Hover glow ring */}
      {hovered && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.6, size * 0.7, 32]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

export default React.memo(Tile3D);
