import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_PARTICLES = 300;
const DUMMY = new THREE.Object3D();

/**
 * Particle shapes for different burst types
 */
const SHAPES = {
  STAR: 0,
  CONFETTI: 1,
  SPARKLE: 2
};

/**
 * LevelUpBurst
 * 3D celebration effect for level ups, achievements, and big wins.
 * Features stars, confetti, and sparkle particles.
 */
const LevelUpBurst = forwardRef(({
  maxParticles = MAX_PARTICLES
}, ref) => {
  const meshRef = useRef();
  
  // Color palettes
  const colorPalettes = useMemo(() => ({
    gold: ['#ffd700', '#ffaa00', '#ffdd44', '#e6c200'],
    rainbow: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'],
    neon: ['#00f3ff', '#ff00ff', '#00ff00', '#ffff00', '#ff0088'],
    achievement: ['#ffd700', '#ffffff', '#ffaa00', '#ffffff']
  }), []);

  // Particle pool
  const particles = useMemo(() => {
    return new Array(maxParticles).fill(0).map(() => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      rotVelocity: new THREE.Vector3(),
      scale: 1,
      life: 0,
      maxLife: 2,
      shape: SHAPES.STAR,
      color: new THREE.Color(),
      gravity: -9.8,
      drag: 0.96
    }));
  }, [maxParticles]);

  // Expose API
  useImperativeHandle(ref, () => ({
    burst: (x, y, z, options = {}) => {
      const {
        amount = 100,
        power = 10,
        colors = 'gold',
        spread = 1,
        lifetime = 3,
        shapes = 'mixed'
      } = options;
      
      const palette = colorPalettes[colors] || colorPalettes.gold;
      const shapeTypes = shapes === 'mixed' 
        ? [SHAPES.STAR, SHAPES.CONFETTI, SHAPES.SPARKLE]
        : [SHAPES[shapes.toUpperCase()] || SHAPES.STAR];
      
      let spawned = 0;
      
      for (let i = 0; i < maxParticles; i++) {
        if (!particles[i].active) {
          const p = particles[i];
          p.active = true;
          
          // Position
          p.position.set(
            x + (Math.random() - 0.5) * spread * 0.3,
            y,
            z + (Math.random() - 0.5) * spread * 0.3
          );
          
          // Radial explosion
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random()); // Full sphere
          const speed = power * (0.4 + Math.random() * 0.9);
          
          p.velocity.set(
            Math.sin(phi) * Math.cos(theta) * speed * spread,
            Math.abs(Math.cos(phi)) * speed + power * 0.5, // Upward bias
            Math.sin(phi) * Math.sin(theta) * speed * spread
          );
          
          // Rotation
          p.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          p.rotVelocity.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          );
          
          // Properties
          p.shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          p.scale = 0.2 + Math.random() * 0.3;
          p.life = lifetime * (0.7 + Math.random() * 0.6);
          p.maxLife = p.life;
          p.gravity = -8 - Math.random() * 4;
          p.drag = 0.94 + Math.random() * 0.04;
          p.color.set(palette[Math.floor(Math.random() * palette.length)]);
          
          spawned++;
          if (spawned >= amount) break;
        }
      }
    },
    
    spiral: (x, y, z, options = {}) => {
      const { amount = 80, duration = 1.5, ...rest } = options;
      const startTime = Date.now();
      
      const spawn = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = elapsed / duration;
        
        if (progress < 1) {
          const angle = progress * Math.PI * 4; // 2 full rotations
          const radius = 2 * (1 - progress);
          
          const px = x + Math.cos(angle) * radius;
          const pz = z + Math.sin(angle) * radius;
          const py = y + progress * 3;
          
          this.burst(px, py, pz, { amount: 3, power: 4, ...rest });
          requestAnimationFrame(spawn);
        }
      };
      
      spawn();
    },
    
    fountain: (x, y, z, options = {}) => {
      const { duration = 2, spawnRate = 20, ...rest } = options;
      const startTime = Date.now();
      
      const emit = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        if (elapsed < duration) {
          for (let i = 0; i < spawnRate; i++) {
            setTimeout(() => {
              this.burst(x, y, z, { 
                amount: 1, 
                power: 6 + Math.random() * 4, 
                ...rest 
              });
            }, i * (1000 / spawnRate));
          }
          requestAnimationFrame(emit);
        }
      };
      
      emit();
    }
  }));

  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let activeCount = 0;
    const floorY = -0.5;
    
    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      
      if (p.active) {
        // Physics
        p.velocity.y += p.gravity * delta;
        p.velocity.multiplyScalar(p.drag);
        p.position.addScaledVector(p.velocity, delta);
        
        // Rotation
        p.rotation.x += p.rotVelocity.x * delta;
        p.rotation.y += p.rotVelocity.y * delta;
        p.rotation.z += p.rotVelocity.z * delta;
        
        // Floor collision
        if (p.position.y < floorY) {
          p.position.y = floorY;
          p.velocity.y *= -0.4;
          p.velocity.x *= 0.7;
          p.velocity.z *= 0.7;
        }
        
        // Life cycle
        p.life -= delta;
        
        // Scale animation
        let scale = p.scale;
        const lifeRatio = p.life / p.maxLife;
        
        if (lifeRatio > 0.9) {
          // Pop in
          scale = p.scale * ((1 - lifeRatio) * 10);
        } else if (p.life < 0.3) {
          // Fade out
          scale = p.scale * (p.life / 0.3);
        }
        
        if (p.life <= 0 || p.position.y < -5) {
          p.active = false;
          scale = 0;
        }
        
        // Update matrix
        DUMMY.position.copy(p.position);
        DUMMY.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        DUMMY.scale.setScalar(scale);
        DUMMY.updateMatrix();
        
        meshRef.current.setMatrixAt(i, DUMMY.matrix);
        meshRef.current.setColorAt(i, p.color);
        
        activeCount++;
      } else {
        // Hide
        meshRef.current.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
      }
    }
    
    if (activeCount > 0) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  });

  // Custom shader material for particles
  return (
    <instancedMesh ref={meshRef} args={[null, null, maxParticles]}>
      {/* Star/Cross shape geometry */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
});

LevelUpBurst.displayName = 'LevelUpBurst';

export default LevelUpBurst;
