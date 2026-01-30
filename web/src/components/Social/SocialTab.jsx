import React from 'react';
import LeaderboardItem from './LeaderboardItem';
import { SOCIAL_CONFIG } from '../../config/social';

export default function SocialTab({ 
  friends, 
  cityLevel, 
  netWorth, 
  themeColor,
  onSendGift,
  onReceiveGift,
  dailyGiftCount 
}) {
  // Create player object
  const player = {
    id: 'player',
    name: 'YOU',
    avatar: '😎',
    level: cityLevel,
    netWorth: netWorth || 0,
    isPlayer: true
  };

  // Merge and sort
  const leaderboard = [...friends, player].sort((a, b) => b.netWorth - a.netWorth);

  return (
    <div className="social-tab">
      <div className="social-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '12px',
        padding: '8px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Daily Gifts Received
        </div>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: themeColor }}>
          {dailyGiftCount} / {SOCIAL_CONFIG.MAX_DAILY_GIFTS_RECEIVED}
        </div>
      </div>

      <div className="leaderboard-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {leaderboard.map((friend, index) => (
          <LeaderboardItem
            key={friend.id}
            rank={index + 1}
            friend={friend}
            onSendGift={onSendGift}
            onReceiveGift={onReceiveGift}
            themeColor={themeColor}
          />
        ))}
      </div>
    </div>
  );
}
