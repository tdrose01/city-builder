import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Tile3D from './Tile3D';
import PlayerPawn from './PlayerPawn';
import CameraController from './CameraController';
import { Text } from '@react-three/drei';

/**
 * VisitorAvatar
 * Styled initials replacing emoji - Monopoly Go style
 */
const VisitorAvatar = ({ position, avatar, name }) => {
  const ref = useRef();
  
  // Generate initials from name or use first char of avatar
  const getInitials = () => {
    if (name) {
      const parts = name.split(' ');
      return parts.length > 1 
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    // Fallback: use first 2 chars if not emoji, else 'V'
    if (avatar && !avatar.includes(String.fromCodePoint(0x1F600))) {
      return avatar.substring(0, 2).toUpperCase();
    }
    return 'V';
  };
  
  // Generate consistent color from name/avatar
  const getAvatarColor = () => {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
      '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
      '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'
    ];
    const hash = (name || avatar || 'V').split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };
  
  const initials = getInitials();
  const bgColor = getAvatarColor();
  
  useFrame((state) => {
    if (ref.current) {
      // Floating animation
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Billboard effect (face camera)
      ref.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Circular background */}
      <mesh>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color={bgColor} />
      </mesh>
      {/* Initials text */}
      <Text
        fontSize={0.28}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {initials}
      </Text>
      {/* Glow ring */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[0.32, 0.38, 32]} />
        <meshBasicMaterial color={bgColor} transparent opacity={0.5} />
      </mesh>
      {/* Small shadow under avatar */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

/**
 * Board3D
 * Renders the 20-tile board loop in 3D space.
 * Tiles are arranged in a rectangular path (Monopoly-style).
 */
const Board3D = forwardRef(({ 
  tiles = [],
  playerPosition = 0,
  playerTargetPosition = null,
  isMoving = false,
  themeColor = '#00f3ff',
  boardTint = '#1a1a2e',
  onTileClick,
  activeVisitors = [],
  children
}, ref) => {
  // Calculate responsive scale for mobile devices
  const getBoardScale = () => {
    if (typeof window === 'undefined') return 1;
    
    const aspect = window.innerWidth / window.innerHeight;
    const isTall = aspect < 0.5; // Tall aspect ratio (like Pixel 9a ~20:9)
    
    if (isTall) {
      // Scale up for tall screens to make board appear larger
      return 1.8;
    } else if (window.innerWidth <= 768) {
      // Scale up for regular mobile devices
      return 1.4;
    }
    return 1; // Normal scale for desktop
  };
  
  const boardScale = getBoardScale();
  const boardGroupRef = useRef();
  const pawnRef = useRef();
  const cameraRef = useRef();

  // Board dimensions (Monopoly-style rectangle)
  const BOARD_CONFIG = useMemo(() => ({
    tilesPerSide: 5, // 5 tiles per side (corners = 1 tile)
    tileSize: 2,
    tileSpacing: 0.1,
    cornerSize: 2.5,
    height: 0.3,
    pathRadius: 0.3 // rounded corners
  }), []);

  // Calculate tile positions in 3D space
  const tilePositions = useMemo(() => {
    console.log('🔍 Board3D: Calculating tile positions for', tiles.length, 'tiles');
    
    const positions = [];
    const { tilesPerSide, tileSize, tileSpacing, cornerSize } = BOARD_CONFIG;
    
    const sideLength = tilesPerSide * tileSize + (tilesPerSide - 1) * tileSpacing;
    const halfSide = sideLength / 2;
    
    console.log('🔍 Board3D: Board config - tilesPerSide:', tilesPerSide, 'tileSize:', tileSize, 'sideLength:', sideLength, 'halfSide:', halfSide);
    
    // Calculate center offset to center the board
    const offsetX = 0;
    const offsetZ = 0;
    
    // Tile 0 is bottom-right corner (START)
    // Going counter-clockwise:
    // Side 0: Bottom (tiles 0-5, right to left)
    // Side 1: Left (tiles 5-10, bottom to top)
    // Side 2: Top (tiles 10-15, left to right)
    // Side 3: Right (tiles 15-20/0, top to bottom)
    
    for (let i = 0; i < 20; i++) {
      let x = 0, z = 0, rotation = 0;
      
      if (i <= 5) {
        // Bottom side (moving left from corner 0)
        const pos = i === 0 ? 0 : (5 - i);
        x = halfSide - (pos * (tileSize + tileSpacing));
        z = halfSide;
        rotation = 0;
        if (i === 0) { x = halfSide; z = halfSide; }
      } else if (i <= 10) {
        // Left side (moving up from corner 5)
        const pos = i === 5 ? 0 : (i - 5);
        x = -halfSide;
        z = halfSide - (pos * (tileSize + tileSpacing));
        rotation = Math.PI / 2;
        if (i === 5) { x = -halfSide; z = halfSide; rotation = 0; }
      } else if (i <= 15) {
        // Top side (moving right from corner 10)
        const pos = i === 10 ? 0 : (i - 10);
        x = -halfSide + (pos * (tileSize + tileSpacing));
        z = -halfSide;
        rotation = Math.PI;
        if (i === 10) { x = -halfSide; z = -halfSide; rotation = Math.PI / 2; }
      } else {
        // Right side (moving down from corner 15)
        const pos = i === 15 ? 0 : (i - 15);
        x = halfSide;
        z = -halfSide + (pos * (tileSize + tileSpacing));
        rotation = -Math.PI / 2;
        if (i === 15) { x = halfSide; z = -halfSide; rotation = Math.PI; }
      }
      
      positions.push({
        id: i,
        position: [x + offsetX, 0, z + offsetZ],
        rotation: [0, rotation, 0],
        isCorner: i % 5 === 0
      });
    }
    
    console.log('🔍 Board3D: Generated positions for', positions.length, 'tiles');
    console.log('🔍 Board3D: Sample positions:', positions.slice(0, 3));
    
    return positions;
  }, [BOARD_CONFIG, tiles.length]);

  // Get current and target positions for pawn
  const currentTilePos = tilePositions[playerPosition]?.position || [0, 0, 0];
  const targetTilePos = playerTargetPosition !== null 
    ? tilePositions[playerTargetPosition]?.position 
    : currentTilePos;

  // Expose API to parent
  useImperativeHandle(ref, () => ({
    getTilePosition: (index) => tilePositions[index]?.position || [0, 0, 0],
    getPawnPosition: () => pawnRef.current?.getPosition(),
    triggerCameraShake: (intensity = 0.5, duration = 0.5) => {
      cameraRef.current?.shake(intensity, duration);
    },
    zoomToTile: (tileIndex, zoom = 1.5) => {
      const pos = tilePositions[tileIndex]?.position;
      if (pos) cameraRef.current?.zoomTo(pos, zoom);
    }
  }));

  return (
    <group ref={boardGroupRef} scale={boardScale} rotation={[0, Math.PI / 4, 0]}>
      {/* Camera Controller */}
      <CameraController 
        ref={cameraRef}
        targetPosition={isMoving ? targetTilePos : currentTilePos}
        followPlayer={true}
        defaultDistance={17}
        defaultHeight={12}
        defaultFOV={38}
        smoothness={0.06}
      />
      
      {/* Player Pawn */}
      <PlayerPawn 
        ref={pawnRef}
        position={currentTilePos}
        targetPosition={targetTilePos}
        isMoving={isMoving}
        themeColor={themeColor}
      />
      
      {/* Board Tiles */}
      {tilePositions.map((tileData) => {
        const tileConfig = tiles.find(t => t.id === tileData.id);
        return (
          <Tile3D
            key={tileData.id}
            id={tileData.id}
            position={tileData.position}
            rotation={tileData.rotation}
            type={tileConfig?.type || 'Funds'}
            name={tileConfig?.name || `Tile ${tileData.id}`}
            themeColor={themeColor}
            isCorner={tileData.isCorner}
            onClick={() => onTileClick?.(tileData.id)}
            payout={tileConfig?.payout}
            level={tileConfig?.level}
          />
        );
      })}

      {/* Phase 15: Visitor Avatars */}
      {activeVisitors.map((visitor) => {
        const tilePos = tilePositions[visitor.tileIndex]?.position;
        if (!tilePos) return null;
        return (
          <VisitorAvatar 
            key={visitor.id}
            position={[tilePos[0], 1.2, tilePos[2]]}
            avatar={visitor.avatar}
          />
        );
      })}
      
      {/* Ground plane for shadows */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color={boardTint} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {children}
    </group>
  );
});

Board3D.displayName = 'Board3D';

export default Board3D;
