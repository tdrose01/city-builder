import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CameraController
 * Dynamic camera with follow mode, zoom events, and impact shake.
 * Provides "Monopoly Go" style camera juice.
 */
const CameraController = forwardRef(({
  targetPosition = [0, 0, 0],
  followPlayer = true,
  defaultDistance = 12,
  defaultHeight = 9,
  defaultFOV = 35,
  smoothness = 0.05
}, ref) => {
  const cameraRef = useRef();
  const { camera, set } = useThree();
  
  // Camera state
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [shakeDuration, setShakeDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const eventFocusTarget = useRef(null);
  const eventFocusTimeoutRef = useRef(null);
  
  // Current camera params for smooth interpolation
  const currentPos = useRef(new THREE.Vector3(0, defaultHeight, defaultDistance));
  const targetPos = useRef(new THREE.Vector3(...targetPosition));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const shakeOffset = useRef(new THREE.Vector3());
  
  // Shake animation
  useEffect(() => {
    if (shakeDuration > 0 && shakeIntensity > 0) {
      const timer = setTimeout(() => {
        setShakeDuration(0);
        setShakeIntensity(0);
        shakeOffset.current.set(0, 0, 0);
      }, shakeDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [shakeDuration, shakeIntensity]);

  useEffect(() => {
    return () => {
      if (eventFocusTimeoutRef.current) {
        clearTimeout(eventFocusTimeoutRef.current);
      }
    };
  }, []);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    const activeTarget = eventFocusTarget.current || targetPosition;
    
    // Update target position
    if (followPlayer) {
      targetPos.current.set(
        activeTarget[0],
        0,
        activeTarget[2] + defaultDistance / zoomLevel
      );
    }
    
    // Smooth position interpolation
    currentPos.current.lerp(
      new THREE.Vector3(
        targetPos.current.x,
        defaultHeight / zoomLevel,
        targetPos.current.z + defaultDistance * (2 - zoomLevel)
      ),
      smoothness
    );
    
    // Calculate look-at target (always look at player/board center)
    const lookTarget = new THREE.Vector3(activeTarget[0], 0, activeTarget[2]);
    currentLookAt.current.lerp(lookTarget, smoothness);
    
    // Apply shake
    if (shakeIntensity > 0 && shakeDuration > 0) {
      shakeOffset.current.set(
        (Math.random() - 0.5) * shakeIntensity,
        (Math.random() - 0.5) * shakeIntensity * 0.5,
        (Math.random() - 0.5) * shakeIntensity
      );
    }
    
    // Apply final position
    const finalPosition = currentPos.current.clone().add(shakeOffset.current);
    cameraRef.current.position.copy(finalPosition);
    cameraRef.current.lookAt(currentLookAt.current);
    
    // Update global camera
    if (camera !== cameraRef.current) {
      camera.position.copy(finalPosition);
      camera.lookAt(currentLookAt.current);
      camera.updateProjectionMatrix();
    }
    
    // Decay shake
    if (shakeDuration > 0) {
      setShakeDuration(prev => Math.max(0, prev - delta));
      setShakeIntensity(prev => prev * 0.95); // Decay
    }
  });

  // Expose API
  useImperativeHandle(ref, () => ({
    // Trigger screen shake
    shake: (intensity = 0.5, duration = 0.5) => {
      setShakeIntensity(intensity);
      setShakeDuration(duration);
    },
    
    // Zoom to a specific tile
    zoomTo: (position, zoom = 1.5, duration = 1000) => {
      setIsZooming(true);
      eventFocusTarget.current = [position[0], 0, position[2]];

      if (eventFocusTimeoutRef.current) {
        clearTimeout(eventFocusTimeoutRef.current);
      }

      eventFocusTimeoutRef.current = setTimeout(() => {
        eventFocusTarget.current = null;
      }, duration + 350);

      const startZoom = zoomLevel;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        setZoomLevel(startZoom + (zoom - startZoom) * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsZooming(false);
        }
      };
      
      animate();
    },
    
    // Reset zoom to default
    resetZoom: (duration = 800) => {
      setIsZooming(true);
      const startZoom = zoomLevel;
      const startTime = Date.now();
      const targetZoom = 1;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        
        setZoomLevel(startZoom + (targetZoom - startZoom) * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsZooming(false);
        }
      };
      
      animate();
    },
    
    // Quick zoom effect (for events like Lottery)
    zoomPulse: (zoomIn = 0.6, duration = 600) => {
      setIsZooming(true);
      const startZoom = zoomLevel;
      const startTime = Date.now();
      const halfDuration = duration / 2;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < halfDuration) {
          // Zoom in
          const progress = elapsed / halfDuration;
          const ease = 1 - Math.pow(1 - progress, 2);
          setZoomLevel(startZoom + (zoomIn - startZoom) * ease);
          requestAnimationFrame(animate);
        } else if (elapsed < duration) {
          // Zoom out
          const progress = (elapsed - halfDuration) / halfDuration;
          const ease = 1 - Math.pow(1 - progress, 3);
          setZoomLevel(zoomIn + (startZoom - zoomIn) * ease);
          requestAnimationFrame(animate);
        } else {
          setZoomLevel(startZoom);
          setIsZooming(false);
        }
      };
      
      animate();
    },
    
    // Get current position
    getPosition: () => currentPos.current.clone(),
    
    // Jump cut to position (instant)
    jumpTo: (position) => {
      currentPos.current.set(
        position[0],
        position[1] + defaultHeight,
        position[2] + defaultDistance
      );
    },
    
    // Smooth pan to position
    panTo: (position, duration = 1000) => {
      eventFocusTarget.current = [position[0], 0, position[2]];

      if (eventFocusTimeoutRef.current) {
        clearTimeout(eventFocusTimeoutRef.current);
      }

      eventFocusTimeoutRef.current = setTimeout(() => {
        eventFocusTarget.current = null;
      }, duration + 250);

      const startPos = currentPos.current.clone();
      const endPos = new THREE.Vector3(
        position[0],
        position[1] + defaultHeight,
        position[2] + defaultDistance
      );
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        
        currentPos.current.lerpVectors(startPos, endPos, ease);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }));

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, defaultHeight, defaultDistance]}
      fov={defaultFOV}
    />
  );
});

CameraController.displayName = 'CameraController';

export default CameraController;
