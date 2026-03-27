import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Building selection based on tile level
const BUILDING_MODELS = {
  low: [
    '/kenney-city/Models/GLB format/low-detail-building-a.glb',
    '/kenney-city/Models/GLB format/low-detail-building-b.glb',
    '/kenney-city/Models/GLB format/low-detail-building-c.glb',
  ],
  medium: [
    '/kenney-city/Models/GLB format/building-a.glb',
    '/kenney-city/Models/GLB format/building-b.glb',
    '/kenney-city/Models/GLB format/building-c.glb',
  ],
  high: [
    '/kenney-city/Models/GLB format/building-skyscraper-a.glb',
    '/kenney-city/Models/GLB format/building-skyscraper-b.glb',
    '/kenney-city/Models/GLB format/building-skyscraper-c.glb',
  ]
};

// Preload all models
Object.values(BUILDING_MODELS).flat().forEach(path => {
  useGLTF.preload(path);
});

/**
 * Building - 3D building model for property tiles
 * 
 * @param {number} level - Tile level (0-5), determines building complexity
 * @param {string} themeColor - Color tint for the building
 * @param {number} scale - Building scale
 */
const Building = ({ level = 0, themeColor = '#00f3ff', scale = 0.3 }) => {
  const groupRef = useRef();
  
  // Select building based on level
  const modelPath = useMemo(() => {
    const category = level >= 4 ? 'high' : level >= 2 ? 'medium' : 'low';
    const models = BUILDING_MODELS[category];
    return models[level % models.length];
  }, [level]);
  
  // Load the GLB model
  const { scene } = useGLTF(modelPath);
  
  // Clone and customize the scene
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Apply color tint to all meshes
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Clone material and apply tint
        if (child.material) {
          child.material = child.material.clone();
          const color = new THREE.Color(themeColor);
          child.material.color = color;
        }
      }
    });
    
    return clone;
  }, [scene, themeColor]);
  
  // Gentle bobbing animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });
  
  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

/**
 * BuildingPlaceholder - Fallback while loading or if model fails
 */
const BuildingPlaceholder = ({ level = 0, themeColor = '#00f3ff' }) => {
  const height = 0.5 + (level * 0.2);
  
  return (
    <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial 
        color={themeColor}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
};

/**
 * BuildingWithFallback - Building with error boundary
 */
const BuildingWithFallback = ({ level, themeColor, scale }) => {
  return (
    <Suspense fallback={<BuildingPlaceholder level={level} themeColor={themeColor} />}>
      <Building level={level} themeColor={themeColor} scale={scale} />
    </Suspense>
  );
};

export default BuildingWithFallback;
export { BuildingPlaceholder };
