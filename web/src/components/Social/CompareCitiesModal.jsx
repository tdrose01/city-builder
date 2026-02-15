import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile } from '../../lib/friendManager';

/**
 * CompareCitiesModal - Side-by-side city comparison
 */
export default function CompareCitiesModal({ friend, onClose, themeColor }) {
  const player = getUserProfile();

  if (!friend) return null;

  // Calculate who's ahead
  const wealthDiff = friend.netWorth - player.netWorth;
  const levelDiff = friend.level - player.level;
  const friendAhead = wealthDiff > 0;

  // Stats to compare
  const stats = [
    { label: 'Net Worth', player: player.netWorth, friend: friend.netWorth, format: v => `$${v.toLocaleString()}` },
    { label: 'Level', player: player.level, friend: friend.level, format: v => v },
    { label: 'Tiles Owned', player: player.tilesOwned || 12, friend: friend.tilesOwned || 10, format: v => v },
    { label: 'Landmarks', player: player.landmarks || 3, friend: friend.landmarks || 2, format: v => v },
  ];

  const StatRow = ({ label, playerValue, friendValue, format }) => {
    const pHigher = playerValue > friendValue;
    const fHigher = friendValue > playerValue;
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px', 
        marginBottom: '8px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '10px' 
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', fontWeight: 'bold', 
            color: pHigher ? themeColor : '#fff' 
          }}>
            {format(playerValue)}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>YOU</div>
          {pHigher && <span style={{ fontSize: '16px' }}>👑</span>}
        </div>
        
        <div style={{ 
          padding: '4px 16px', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '16px',
          fontSize: '12px', 
          color: '#94a3b8',
          fontWeight: 'bold'
        }}>
          {label}
        </div>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', fontWeight: 'bold', 
            color: fHigher ? themeColor : '#fff' 
          }}>
            {format(friendValue)}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{friend.name.toUpperCase()}</div>
          {fHigher && <span style={{ fontSize: '16px' }}>👑</span>}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '420px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: themeColor }}>
              🏙️ City Comparison
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              {friendAhead 
                ? `${friend.name} is ahead by $${Math.abs(wealthDiff).toLocaleString()}!`
                : `You're ahead by $${Math.abs(wealthDiff).toLocaleString()}!`
              }
            </p>
          </div>

          {/* Avatars */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '40px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' 
              }}>{player.avatar}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: themeColor }}>YOU</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Lvl {player.level}</div>
            </div>

            <div style={{ 
              padding: '8px 16px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px',
              fontSize: '14px', fontWeight: 'bold', color: '#fff'
            }}>
              VS
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>{friend.avatar}</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: themeColor }}>{friend.name}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Lvl {friend.level}</div>
            </div>
          </div>

          {/* Stats Comparison */}
          <div style={{ marginBottom: '20px' }}>
            {stats.map((stat) => (
              <StatRow key={stat.label} {...stat} />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px',
              background: themeColor, color: '#000',
              border: 'none', borderRadius: '12px',
              fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
