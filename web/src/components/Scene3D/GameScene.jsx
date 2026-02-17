import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { checkWebGLSupport } from '../../utils/webglCheck';

// Ref to prevent StrictMode double-mount issues
const canvasInitializedRef = { current: false };

/**
 * GameScene
 * The global 3D container for the entire game world.
 * Replaces the fragmented DOM/Canvas approach.
 */
export default function GameScene({ children, cameraPosition = [0, 8, 14] }) {
  const [webglInfo, setWebglInfo] = useState(null);
  const [webglError, setWebglError] = useState(null);

  useEffect(() => {
    // Check WebGL support on mount
    try {
      const info = checkWebGLSupport();
      setWebglInfo(info);
      
      if (!info.supported) {
        setWebglError(`WebGL not supported: ${info.reason}`);
        console.error('WebGL not supported:', info);
      }
    } catch (e) {
      setWebglError(e.message);
      console.error('WebGL check failed:', e);
    }
  }, []);

  // Adjust camera position for mobile devices based on aspect ratio
  const getAdjustedCameraPosition = () => {
    if (typeof window === 'undefined') return cameraPosition;
    const aspect = window.innerWidth / window.innerHeight;
    const isTall = aspect < 0.5; // Tall aspect ratio (like Pixel 9a ~20:9)
    
    if (isTall) {
      // Lower and closer camera for tall screens to see more of the board vertically
      return [0, 4, 8];
    } else if (window.innerWidth <= 768) {
      // Regular mobile - lower camera slightly
      return [0, 7, 13];
    }
    return cameraPosition;
  };

  const adjustedCameraPosition = getAdjustedCameraPosition();

  // Show error if WebGL is not supported
  if (webglError || (webglInfo && !webglInfo.supported)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-400">WebGL Required</h2>
          <p className="mb-4">City Slacker requires WebGL to display the 3D game board.</p>
          <p className="text-sm text-gray-400 mb-4">
            Error: {webglError || webglInfo?.reason || 'WebGL not available'}
          </p>
          <div className="text-left bg-gray-800 p-4 rounded text-sm text-gray-300">
            <p className="font-bold mb-2">Try these fixes:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use Chrome, Firefox, or Edge browser</li>
              <li>Enable hardware acceleration in browser settings</li>
              <li>Update your graphics drivers</li>
              <li>Disable browser extensions that block WebGL</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking WebGL
  if (!webglInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking graphics support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-scene-container" style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <Canvas 
        shadows 
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false // Allow software rendering
        }}
        style={{ touchAction: 'pan-y' }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setWebglError('Canvas initialization failed: ' + error.message);
        }}
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
          
          {/* Post Processing */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={1} 
              mipmapBlur 
              intensity={0.5} 
              radius={0.4} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
