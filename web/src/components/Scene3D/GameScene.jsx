import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import { checkWebGLSupport } from '../../utils/webglCheck';
import { useWeatherStore } from '../../store/useWeatherStore';

// Ref to prevent StrictMode double-mount issues
const canvasInitializedRef = { current: false };

/**
 * GameScene
 * The global 3D container for the entire game world.
 * Replaces the fragmented DOM/Canvas approach.
 */
export default function GameScene({ children, cameraPosition = [14, 12, 14], seasonalTheme = null }) {
  const [webglInfo, setWebglInfo] = useState(null);
  const [webglError, setWebglError] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Phase 16: Weather System
  const currentWeather = useWeatherStore(state => state.currentWeather);

  // Default theme if none provided
  const theme = seasonalTheme || {
    ambientColor: "#ffffff",
    skyboxGradient: ["#1a1a2e", "#16213e"],
    ambientIntensity: 0.7
  };

  // Weather overrides
  const weatherSkyColor = currentWeather?.skyColor || theme.skyboxGradient[0];
  const weatherAmbientIntensity = (currentWeather?.id === 'rainy' || currentWeather?.id === 'thunder') 
    ? 0.4 
    : theme.ambientIntensity || 0.7;

  // Lightning Logic
  useEffect(() => {
    if (currentWeather?.id !== 'thunder') {
      setIsFlashing(false);
      return;
    }

    let timeout;
    const triggerFlash = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 50 + Math.random() * 100);
      
      // Randomly double flash
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 40);
        }, 150);
      }
      
      const nextFlashIn = 3000 + Math.random() * 10000;
      timeout = setTimeout(triggerFlash, nextFlashIn);
    };

    timeout = setTimeout(triggerFlash, 5000);
    return () => clearTimeout(timeout);
  }, [currentWeather?.id]);

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
      pointerEvents: 'auto',
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
            fov={38} 
            near={0.1} 
            far={1000} 
          />
          
          {/* Lighting Environment - 3 point setup */}
          <ambientLight
            intensity={isFlashing ? 1.4 : weatherAmbientIntensity * 0.32}
            color={isFlashing ? "#b0c4ff" : theme.ambientColor || "#ffffff"}
          />

          {/* Key light: main scene illumination */}
          <directionalLight
            position={[16, 22, 12]}
            intensity={isFlashing ? 5.5 : theme.directionalIntensity || 2.2}
            color={isFlashing ? "#dbeafe" : "#fff7e6"}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={80}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
            shadow-bias={-0.0002}
          />

          {/* Fill light: softens shadow side */}
          <directionalLight
            position={[-12, 10, -10]}
            intensity={isFlashing ? 1.2 : 0.35}
            color={isFlashing ? "#93c5fd" : "#a5d8ff"}
          />

          {/* Rim light: edge separation from backdrop */}
          <directionalLight
            position={[0, 8, -24]}
            intensity={isFlashing ? 1.4 : 0.45}
            color={isFlashing ? "#c4b5fd" : "#d946ef"}
          />

          <Environment
            preset={currentWeather?.id === 'thunder' ? 'night' : theme.environmentPreset || 'city'}
            blur={0.25}
          />
          
          {/* Seasonal Skybox / Background */}
          <color attach="background" args={[isFlashing ? "#475569" : weatherSkyColor]} />
          
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
          <EffectComposer>
            <SSAO
              samples={16}
              radius={0.18}
              intensity={18}
              luminanceInfluence={0.55}
              color="black"
            />
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
