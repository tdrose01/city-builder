import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '2px solid #34d399',
          icon: '✓'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: '2px solid #f87171',
          icon: '✕'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: '2px solid #fbbf24',
          icon: '⚠'
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          border: '2px solid #60a5fa',
          icon: 'ℹ'
        };
    }
  };

  const style = getNotificationStyle(notification.type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          minWidth: '300px',
          maxWidth: '500px',
          padding: '16px 20px',
          background: style.background,
          border: style.border,
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          minWidth: '32px',
          textAlign: 'center'
        }}>
          {style.icon}
        </div>
        <div style={{ flex: 1, color: '#fff', fontSize: '14px', fontWeight: '500' }}>
          {notification.message}
        </div>
        {notification.duration !== Infinity && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
