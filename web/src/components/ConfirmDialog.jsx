import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ dialog, onConfirm, onCancel }) {
  if (!dialog) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            color: '#fff'
          }}
        >
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: dialog.color || '#fff'
          }}>
            {dialog.title}
          </h3>
          
          <div style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '24px',
            whiteSpace: 'pre-line'
          }}>
            {dialog.message}
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px',
                background: dialog.confirmColor || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: '2px solid ' + (dialog.confirmBorder || '#60a5fa'),
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              {dialog.confirmText || 'Confirm'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
