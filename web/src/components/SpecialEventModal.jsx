import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audioManager';

// Safe render helper - prevents "Objects are not valid as a React child" errors
const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    if (value.name) return value.name;
    if (value.icon) return value.icon;
    try { return JSON.stringify(value); } catch { return fallback; }
  }
  return fallback;
};

/**
 * SpecialEventModal Component
 *
 * Displays special event announcements with two modes:
 * - City-wide events: Full modal with backdrop, animated entrance, dismiss button
 * - Random/milestone events: Compact card, auto-dismisses after 3s
 *
 * @param {Object} event - The event to display
 * @param {string} event.category - 'city_wide', 'random', or 'milestone'
 * @param {string} event.name - Event name
 * @param {string} event.icon - Emoji icon
 * @param {string} event.description - Event description
 * @param {string} [event.color] - Theme color
 * @param {number} [event.duration] - Rolls remaining (city-wide)
 * @param {string} [event.effectText] - Computed effect text to display
 * @param {function} onClose - Callback to dismiss
 */
export default function SpecialEventModal({ event, onClose }) {
  const isCityWide = event?.category === 'city_wide';

  useEffect(() => {
    if (!event) return;

    if (event.sound) {
      audioManager.playSFX(event.sound);
    }

    if (!isCityWide) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [event, isCityWide, onClose]);

  if (!event) return null;

  const color = event.color || '#a855f7';

  if (isCityWide) {
    return (
      <AnimatePresence>
        <motion.div
          data-testid="special-event-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            data-testid="special-event-modal"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: `linear-gradient(135deg, #1a1a2e 0%, ${color}22 100%)`,
              border: `2px solid ${color}`,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              boxShadow: `0 0 40px ${color}44, 0 0 80px ${color}22`,
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>{safeRender(event.icon, '🎉')}</div>
            <h2 style={{
              color,
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              textShadow: `0 0 10px ${color}66`,
            }}>
              {safeRender(event.name, 'Event')}
            </h2>
            <p style={{
              color: '#e2e8f0',
              fontSize: '16px',
              margin: '0 0 8px 0',
              lineHeight: 1.4,
            }}>
              {safeRender(event.description, '')}
            </p>
            {event.duration && (
              <p style={{
                color: color,
                fontSize: '14px',
                margin: '0 0 20px 0',
                fontWeight: 'bold',
              }}>
                Lasts {safeRender(event.duration, '')} rolls
              </p>
            )}
            <button
              data-testid="special-event-dismiss"
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${color}44`,
              }}
            >
              Let&apos;s Go!
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Compact card for random and milestone events
  return (
    <AnimatePresence>
      <motion.div
        data-testid="special-event-toast"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, #1a1a2e 0%, ${color}22 100%)`,
          border: `2px solid ${color}`,
          borderRadius: '12px',
          padding: '16px 24px',
          minWidth: '280px',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9998,
          cursor: 'pointer',
          boxShadow: `0 4px 20px ${color}33`,
        }}
      >
        <span style={{ fontSize: '32px' }}>{safeRender(event.icon, '🎉')}</span>
        <div>
          <div style={{
            color,
            fontSize: '16px',
            fontWeight: 'bold',
          }}>
            {safeRender(event.name, 'Event')}
          </div>
          <div style={{
            color: '#cbd5e1',
            fontSize: '13px',
          }}>
            {safeRender(event.effectText || event.description, '')}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
