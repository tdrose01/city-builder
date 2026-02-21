import React, { useRef, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_PARTICLES = 1000;
const DUMMY = new THREE.Object3D();

/**
 * 3D Particle System using InstancedMesh
 * High performance: 1 draw call for 1000 particles.
 */
const InstancedParticles = forwardRef(({ texture, count = 100, gravity = -9.8, drag = 0.98, ambientType = null }, ref) => {
  const meshRef = useRef();
  const spawnTimer = useRef(0);
  
  // Particle State (CPU side)
  const particles = useMemo(() => {
    return new Array(MAX_PARTICLES).fill(0).map(() => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      rotVel: new THREE.Vector3(),
      scale: 1,
      life: 0,
      maxLife: 1,
      color: new THREE.Color()
    }));
  }, []);

  // Expose API to parent
  useImperativeHandle(ref, () => ({
    emit: (x, y, z, options = {}) => {
      const { 
        amount = 10, 
        color = '#ffffff', 
        speed = 5, 
        spread = 1,
        life = 2,
        scale = 0.5
      } = options;

      let emitted = 0;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (!particles[i].active) {
          const p = particles[i];
          p.active = true;
          p.position.set(x, y, z);
          
          // Random velocity in cone/sphere
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          p.velocity.set(
            Math.sin(phi) * Math.cos(theta),
            Math.abs(Math.cos(phi)), // Bias upward
            Math.sin(phi) * Math.sin(theta)
          ).normalize().multiplyScalar(speed * (0.5 + Math.random()));
          
          p.velocity.x *= spread;
          p.velocity.z *= spread;

          // Random rotation
          p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          p.rotVel.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(5);

          p.scale = scale * (0.8 + Math.random() * 0.4);
          p.life = life;
          p.maxLife = life;
          p.color.set(color);

          emitted++;
          if (emitted >= amount) break;
        }
      }
    }
  }));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Ambient Spawning Logic
    if (ambientType === 'fireflies') {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.2) {
        spawnTimer.current = 0;
        const p = particles.find(p => !p.active);
        if (p) {
          p.active = true;
          p.position.set((Math.random() - 0.5) * 20, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 20);
          p.velocity.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.5);
          p.rotation.set(0, 0, 0); p.rotVel.set(0, 0, 0);
          p.scale = 0.15; p.life = 4 + Math.random() * 4; p.maxLife = p.life;
          p.color.set('#ffffcc').multiplyScalar(2);
        }
      }
    } else if (ambientType === 'rain' || ambientType === 'storm') {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.02) { // Dense rain
        spawnTimer.current = 0;
        const p = particles.find(p => !p.active);
        if (p) {
          p.active = true;
          p.position.set((Math.random() - 0.5) * 25, 10, (Math.random() - 0.5) * 25);
          p.velocity.set(0, -15 - Math.random() * 5, 0); // Fast fall
          p.rotation.set(0, 0, 0); p.rotVel.set(0, 0, 0);
          p.scale = 0.1; p.life = 1.5; p.maxLife = 1.5;
          p.color.set('#60a5fa').multiplyScalar(0.8);
        }
      }
    } else if (ambientType === 'snow') {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.1) {
        spawnTimer.current = 0;
        const p = particles.find(p => !p.active);
        if (p) {
          p.active = true;
          p.position.set((Math.random() - 0.5) * 25, 10, (Math.random() - 0.5) * 25);
          p.velocity.set((Math.random() - 0.5) * 2, -2 - Math.random(), (Math.random() - 0.5) * 2);
          p.rotation.set(Math.random(), Math.random(), Math.random());
          p.rotVel.set(1, 1, 1);
          p.scale = 0.2; p.life = 5; p.maxLife = 5;
          p.color.set('#ffffff');
        }
      }
    }

    let activeCount = 0;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particles[i];
      if (p.active) {
        // Physics Integration
        p.velocity.y += gravity * delta;
        p.velocity.multiplyScalar(drag);
        p.position.addScaledVector(p.velocity, delta);
        
        // Rotation
        p.rotation.x += p.rotVel.x * delta;
        p.rotation.y += p.rotVel.y * delta;
        p.rotation.z += p.rotVel.z * delta;

        // Lifecycle
        p.life -= delta;
        let currentScale = p.scale;
        
        // Scale out at end
        if (p.life < 0.3) {
          currentScale = p.scale * (p.life / 0.3);
        }

        if (p.life <= 0 || p.position.y < -5) {
          p.active = false;
          currentScale = 0;
        }

        // Update Instance Matrix
        DUMMY.position.copy(p.position);
        DUMMY.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        DUMMY.scale.setScalar(currentScale);
        DUMMY.updateMatrix();

        meshRef.current.setMatrixAt(i, DUMMY.matrix);
        meshRef.current.setColorAt(i, p.color);
        
        activeCount++;
      } else {
        // Hide inactive
        meshRef.current.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      }
    }

    if (activeCount > 0 || meshRef.current.count > 0) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, MAX_PARTICLES]}>
      <boxGeometry args={[0.3, 0.3, 0.05]} /> {/* Default shape: Coin-ish / Confetti */}
      <meshStandardMaterial 
        roughness={0.2} 
        metalness={0.8} 
        vertexColors 
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
});

export default InstancedParticles;
