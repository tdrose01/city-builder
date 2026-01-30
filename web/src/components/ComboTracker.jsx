import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ComboTracker Component
 * Displays current tile landing combo and multiplier
 */
export default function ComboTracker({ comboChain, getComboMultiplier }) {
  const [prevCount, setPrevCount] = useState(0);
  const { type, count } = comboChain;
  
  useEffect(() => {
    // We want to detect if the combo was broken or increased
    const timer = setTimeout(() => {
      setPrevCount(count);
    }, 100);
    return () => clearTimeout(timer);
  }, [count]);

  if (count <= 1) return null;

  const multiplier = getComboMultiplier(count);
  const isIncreasing = count > prevCount;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${type}-${count}`}
        className="combo-tracker-container"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -10 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          padding: '8px 16px',
          borderRadius: '16px',
          border: '1px solid #f97316',
          marginTop: '12px',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(249, 115, 22, 0.4)',
          minWidth: '140px'
        }}
      >
        <div style={{ 
          fontSize: '10px', 
          color: '#f97316', 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          marginBottom: '2px'
        }}>
          {type} CHAIN
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={isIncreasing ? { 
              scale: [1, 1.4, 1],
              rotate: [0, -10, 10, 0],
            } : {}}
            transition={{ duration: 0.4 }}
            style={{ 
              fontSize: '28px', 
              fontWeight: '900', 
              color: '#fff', 
              textShadow: '0 0 10px rgba(249, 115, 22, 0.8), 0 0 20px rgba(249, 115, 22, 0.4)' 
            }}
          >
            {count}
          </motion.div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: '#f97316',
              lineHeight: '1'
            }}>
              x{multiplier.toFixed(2)}
            </span>
            <span style={{ 
              fontSize: '9px', 
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 'bold'
            }}>
              BONUS
            </span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '2px', 
          marginTop: '6px', 
          overflow: 'hidden',
          position: 'relative'
        }}>
          <motion.div
            initial={{ width: `${Math.min(100, ((count - 1) / 5) * 100)}%` }}
            animate={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, #f97316, #fbbf24)',
              boxShadow: '0 0 8px #f97316'
            }}
          />
        </div>
        
        {count >= 5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              fontSize: '9px', 
              color: '#fbbf24', 
              marginTop: '4px', 
              fontWeight: 'bold',
              textShadow: '0 0 4px rgba(251, 191, 36, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span role="img" aria-label="star">⭐</span> POWER-UP GRANTED!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
