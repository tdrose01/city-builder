import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile, getSortedFriends } from '../../lib/friendManager';
import { getPendingGifts, sendGift, receiveGift, canSendGift, getDailyGiftsCount, GIFT_TYPES } from '../../lib/giftManager';

export default function LeaderboardView({ cityLevel, netWorth, themeColor, onCompareCity }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingGifts, setPendingGifts] = useState([]);
  const [dailyCount, setDailyCount] = useState({ sent: 0, received: 0 });
  const [sentGifts, setSentGifts] = useState(new Set());

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => {
    setFriends(getSortedFriends());
    setPendingGifts(getPendingGifts());
    setDailyCount(getDailyGiftsCount());
  };

  const player = {
    id: getUserProfile().id, name: 'YOU', avatar: '😎',
    level: cityLevel, netWorth: netWorth || 0, isPlayer: true
  };

  const friendsWithPlayer = [...friends, player].sort((a, b) => b.netWorth - a.netWorth);

  const mockPlayers = [
    { id: 'm1', name: 'CityTycoon', avatar: '🦁', level: 45, netWorth: 2500000 },
    { id: 'm2', name: 'DiceMaster', avatar: '🦊', level: 42, netWorth: 2100000 },
    { id: 'm3', name: 'UrbanKing', avatar: '👑', level: 38, netWorth: 1800000 },
  ];

  const globalLeaderboard = [...mockPlayers, ...friendsWithPlayer]
    .sort((a, b) => b.netWorth - a.netWorth).slice(0, 15);
  const currentLeaderboard = activeTab === 'friends' ? friendsWithPlayer : globalLeaderboard;

  const hasPendingGift = (fid) => pendingGifts.some(g => g.fromId === fid);
  const hasSentGift = (fid) => sentGifts.has(fid);

  const handleSendGift = (fid) => {
    if (!canSendGift()) { alert('Daily limit (5/5)'); return; }
    const r = sendGift(fid, 'dice', cityLevel);
    if (r.success) { setSentGifts(new Set([...sentGifts, fid])); refreshData(); }
  };

  const handleReceiveGift = (fid) => {
    const g = pendingGifts.find(p => p.fromId === fid);
    if (!g) return;
    const r = receiveGift(g.id);
    if (r.success) { refreshData(); alert(`Claimed ${GIFT_TYPES[r.reward.type].emoji} ${r.reward.value}!`); }
  };

  return (
    <div style={{ padding: '8px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
        <button onClick={() => setActiveTab('friends')} style={{
          flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
          background: activeTab === 'friends' ? themeColor : 'transparent',
          color: activeTab === 'friends' ? '#000' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer'
        }}>👥 Friends</button>
        <button onClick={() => setActiveTab('global')} style={{
          flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
          background: activeTab === 'global' ? themeColor : 'transparent',
          color: activeTab === 'global' ? '#000' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer'
        }}>🌍 Global</button>
      </div>

      {/* Daily Limits */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '12px' }}>
        <span style={{ color: '#94a3b8' }}>Sent: <b style={{ color: themeColor }}>{dailyCount.sent}/5</b></span>
        <span style={{ color: '#94a3b8' }}>Received: <b style={{ color: '#10b981' }}>{dailyCount.received}/5</b></span>
      </div>

      {/* List */}
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {currentLeaderboard.map((e, i) => {
          const isP = e.id === player.id;
          const isM = e.isMock;
          const isF = !isP && !isM;
          const hasG = hasPendingGift(e.id);
          const sent = hasSentGift(e.id);

          return (
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              style={{ display: 'flex', alignItems: 'center', padding: '10px', marginBottom: '6px',
                background: isP ? `${themeColor}15` : 'rgba(255,255,255,0.03)',
                borderRadius: '10px', border: isP ? `1px solid ${themeColor}50` : '1px solid rgba(255,255,255,0.08)' }}>
              
              <div style={{ width: '28px', fontWeight: 'bold', color: i < 3 ? ['#fbbf24', '#c0c0c0', '#cd7f32'][i] : '#94a3b8', fontSize: '13px' }}>#{i + 1}</div>
              <div style={{ fontSize: '24px', margin: '0 10px' }}>{e.avatar}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: isP ? themeColor : '#fff', fontSize: '13px' }}>{e.name}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lvl {e.level} • ${e.netWorth.toLocaleString()}</div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {hasG && <button onClick={() => handleReceiveGift(e.id)} style={{
                  padding: '5px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
                }}>CLAIM 🎁</button>}
                
                {isF && !hasG && !sent && <button onClick={() => handleSendGift(e.id)} style={{
                  padding: '5px 10px', background: themeColor, color: '#000', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
                }}>SEND 🎲</button>}

                {isF && sent && <span style={{ fontSize: '11px', color: '#94a3b8', padding: '5px' }}>Sent ✓</span>}

                {onCompareCity && isF && <button onClick={() => onCompareCity(e)} style={{
                  padding: '5px 8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '10px', cursor: 'pointer'
                }}>👁️</button>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
