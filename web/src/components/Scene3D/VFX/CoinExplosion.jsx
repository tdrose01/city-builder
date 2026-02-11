import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_COINS = 500;
const DUMMY = new THREE.Object3D();
const GOLD_COLOR = new THREE.Color('#ffd700');
const SILVER_COLOR = new THREE.Color('#c0c0c0');

/**
 * CoinExplosion
 * High-performance 3D coin explosion effect using InstancedMesh.
 * Triggers on big wins, payouts, or achievements.
 */
const CoinExplosion = forwardRef(({
  maxCoins = MAX_COINS
}, ref) => {
  const meshRef = useRef();
  
  // Particle pool
  const coins = useMemo(() => {
    return new Array(maxCoins).fill(0).map(() => ({
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      rotation: new THREE.Vector3(),
      rotVelocity: new THREE.Vector3(),
      scale: 1,
      life: 0,
      maxLife: 2,
      isGold: true,
      bounceCount: 0,
      bounceDelay: 0
    }));
  }, [maxCoins]);

  // Expose API
  useImperativeHandle(ref, () => ({
    explode: (x, y, z, options = {}) => {
      const {
        amount = 50,
        power = 8,
        spread = 1,
        lifetime = 3,
        goldRatio = 0.7,
        bounce = true
      } = options;
      
      let spawned = 0;
      
      for (let i = 0; i < maxCoins; i++) {
        if (!coins[i].active) {
          const coin = coins[i];
          coin.active = true;
          coin.isGold = Math.random() < goldRatio;
          
          // Origin position with slight randomization
          coin.position.set(
            x + (Math.random() - 0.5) * spread * 0.5,
            y + Math.random() * 0.5,
            z + (Math.random() - 0.5) * spread * 0.5
          );
          
          // Explosive velocity (upward bias)
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.5; // Hemisphere
          const speed = power * (0.5 + Math.random() * 0.8);
          
          coin.velocity.set(
            Math.cos(phi) * Math.cos(theta) * speed * spread,
            Math.sin(phi) * speed + power * 0.3, // Upward bias
            Math.cos(phi) * Math.sin(theta) * speed * spread
          );
          
          // Random rotation
          coin.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );
          
          coin.rotVelocity.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          );
          
          coin.scale = 0.3 + Math.random() * 0.2;
          coin.life = lifetime * (0.8 + Math.random() * 0.4);
          coin.maxLife = coin.life;
          coin.bounceCount = bounce ? 0 : 999;
          coin.bounceDelay = 0;
          
          spawned++;
          if (spawned >= amount) break;
        }
      }
    },
    
    fountain: (x, y, z, options = {}) => {
      const { duration = 2, spawnRate = 30, ...rest } = options;
      const startTime = Date.now();
      
      const spawn = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        if (elapsed < duration) {
          // Spawn coins at rate
          for (let i = 0; i < spawnRate; i++) {
            setTimeout(() => {
              this.explode(x, y, z, { amount: 1, power: 6, ...rest });
            }, i * (1000 / spawnRate));
          }
          
          requestAnimationFrame(spawn);
        }
      };
      
      spawn();
    }
  }));

  // Physics simulation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const gravity = -15;
    const drag = 0.98;
    const bounceDamping = 0.6;
    const floorY = 0;
    let activeCount = 0;
    
    for (let i = 0; i < maxCoins; i++) {
      const coin = coins[i];
      
      if (coin.active) {
        // Apply gravity
        coin.velocity.y += gravity * delta;
        coin.velocity.multiplyScalar(drag);
        
        // Apply velocity
        coin.position.addScaledVector(coin.velocity, delta);
        
        // Rotate
        coin.rotation.x += coin.rotVelocity.x * delta;
        coin.rotation.y += coin.rotVelocity.y * delta;
        coin.rotation.z += coin.rotVelocity.z * delta;
        
        // Floor collision
        if (coin.position.y < floorY + coin.scale * 0.5) {
          if (coin.bounceCount < 2 && coin.bounceDelay <= 0) {
            coin.position.y = floorY + coin.scale * 0.5;
            coin.velocity.y *= -bounceDamping;
            coin.velocity.x *= 0.8;
            coin.velocity.z *= 0.8;
            coin.bounceCount++;
            coin.bounceDelay = 0.1;
          }
        }
        
        if (coin.bounceDelay > 0) {
          coin.bounceDelay -= delta;
        }
        
        // Life decay
        coin.life -= delta;
        
        // Scale out at end
        let currentScale = coin.scale;
        if (coin.life < 0.5) {
          currentScale = coin.scale * (coin.life / 0.5);
        }
        
        // Deactivate expired
        if (coin.life <= 0) {
          coin.active = false;
          currentScale = 0;
        }
        
        // Update instance matrix
        DUMMY.position.copy(coin.position);
        DUMMY.rotation.set(coin.rotation.x, coin.rotation.y, coin.rotation.z);
        DUMMY.scale.setScalar(currentScale);
        DUMMY.updateMatrix();
        
        meshRef.current.setMatrixAt(i, DUMMY.matrix);
        meshRef.current.setColorAt(i, coin.isGold ? GOLD_COLOR : SILVER_COLOR);
        
        activeCount++;
      } else {
        // Hide inactive
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

  return (
    <instancedMesh ref={meshRef} args={[null, null, maxCoins]}>
      {/* Coin geometry - flattened cylinder */}
      <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} rotation={[Math.PI / 2, 0, 0]} />
      <meshStandardMaterial
        metalness={1.0}
        roughness={0.2}
        vertexColors
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
});

CoinExplosion.displayName = 'CoinExplosion';

export default CoinExplosion;
