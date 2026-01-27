import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TextPop = memo(({ x, y, text, color = '#fbbf24' }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ opacity: 1, scale: 1.5, y: -50 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          color: color,
          fontWeight: '900',
          fontSize: '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 1000,
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
});

export default TextPop;
