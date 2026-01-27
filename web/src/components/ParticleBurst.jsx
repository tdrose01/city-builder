import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const Particle = ({ x, y, size, duration, angle, distance, initialX, initialY, finalX, finalY }) => {

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'gold',
      }}
      animate={{
        x: finalX - initialX,
        y: finalY - initialY,
        opacity: [1, 0],
      }}
      transition={{
        duration,
        ease: 'easeOut',
      }}
    />
  );
};

const ParticleBurst = ({ x, y, count }) => {
  const particleParams = useMemo(() => {
    return Array.from({ length: count }, () => ({
      size: Math.random() * 10 + 5,
      duration: Math.random() * 1 + 0.5,
      angle: Math.random() * 360,
      distance: Math.random() * 100 + 50,
    }));
  }, [count, x, y]); // eslint-disable-line react-hooks/exhaustive-deps

  const particles = useMemo(() => {
    return particleParams.map((params, i) => {
      const initialX = x + Math.cos(params.angle) * 10;
      const initialY = y + Math.sin(params.angle) * 10;
      const finalX = x + Math.cos(params.angle) * params.distance;
      const finalY = y + Math.sin(params.angle) * params.distance;
      
      return (
        <Particle
          key={i}
          x={x}
          y={y}
          size={params.size}
          duration={params.duration}
          angle={params.angle}
          distance={params.distance}
          initialX={initialX}
          initialY={initialY}
          finalX={finalX}
          finalY={finalY}
        />
      );
    });
  }, [x, y, particleParams]);

  return <>{particles}</>;
};

export default ParticleBurst;
