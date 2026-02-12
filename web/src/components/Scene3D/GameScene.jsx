import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/**
 * GameScene
 * The global 3D container for the entire game world.
 * Replaces the fragmented DOM/Canvas approach.
 */
export default function GameScene({ children, cameraPosition = [0, 8, 14] }) {
  // Adjust camera position for mobile devices based on aspect ratio
  const getAdjustedCameraPosition = () => {
    if (typeof window === 'undefined') return cameraPosition;
    
    const aspect = window.innerWidth / window.innerHeight;
    const isTall = aspect < 0.5; // Tall aspect ratio (like Pixel 9a ~20:9)
    
    if (isTall) {
      // Lower and closer camera for tall screens to see more of the board vertically
      return [0, 6, 12];
    } else if (window.innerWidth <= 768) {
      // Regular mobile - lower camera slightly
      return [0, 7, 13];
    }
    return cameraPosition;
  };

  const adjustedCameraPosition = getAdjustedCameraPosition();

  return (
    <div className="game-scene-container" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1, // Lower zIndex to allow scroll events to pass through
      pointerEvents: 'none', // Allow scroll events to pass through to document
    }}>
      <Canvas
        shadows
        dpr={[1, 2]} // Handle high-res screens
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          {/* Camera Rig */}
          <PerspectiveCamera 
            makeDefault 
            position={adjustedCameraPosition} 
            fov={50}
            near={0.1}
            far={1000}
          />
          
          {/* Lighting Environment */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          <Environment preset="city" blur={0.8} />

          {/* World Content */}
          <group>
            {children}
          </group>

          {/* Ground Shadows */}
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={40} 
            blur={2} 
            far={4} 
            color="#000000"
          />

          {/* Post Processing (The "Juice") */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={1} 
              mipmapBlur 
              intensity={0.5} 
              radius={0.4}
            />
          </EffectComposer>

          {/* Dev Controls (remove in prod if needed, useful for tuning view) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.5} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
