import React from 'react';
import { motion } from 'framer-motion';

export default function LeaderboardItem({ friend, rank, onSendGift, onReceiveGift, themeColor }) {
  const isPlayer = friend.isPlayer;
  
  return (
    <motion.div 
      className={`leaderboard-item ${isPlayer ? 'is-player' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        margin: '6px 0',
        backgroundColor: isPlayer ? `${themeColor}22` : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: isPlayer ? `1px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Rank */}
      <div style={{ 
        width: '24px', 
        fontWeight: 'bold', 
        color: rank <= 3 ? '#fbbf24' : '#94a3b8',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        #{rank}
      </div>

      {/* Avatar */}
      <div style={{ 
        fontSize: '24px', 
        margin: '0 12px',
        filter: isPlayer ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' : 'none'
      }}>
        {friend.avatar}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 'bold', 
          color: isPlayer ? themeColor : '#fff',
          fontSize: '13px'
        }}>
          {friend.name}
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Level {friend.level} • ${friend.netWorth.toLocaleString()}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {friend.giftReceived && (
          <button
            onClick={() => onReceiveGift(friend.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            GET GIFT
          </button>
        )}
        
        {!friend.giftSent && !isPlayer && (
          <button
            onClick={() => onSendGift(friend.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: themeColor,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            SEND
          </button>
        )}
        
        {friend.giftSent && (
          <span style={{ fontSize: '11px', color: '#94a3b8', padding: '6px' }}>
            Sent ✓
          </span>
        )}
      </div>
    </motion.div>
  );
}
