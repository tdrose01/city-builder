import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderboardItem from './LeaderboardItem';
import { SOCIAL_CONFIG } from '../../config/social';
import { getFriends, getSortedFriends, getUserProfile } from '../../lib/friendManager';
import { getPendingGifts, getSentGifts, getReceivedGifts, canSendGift, canReceiveGift, GIFT_TYPES, sendGift, receiveGift } from '../../lib/giftManager';

export default function SocialTab({ cityLevel, netWorth, themeColor, onCompareCity }) {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' | 'gifts' | 'sent'
  const [friends, setFriends] = useState([]);
  const [pendingGifts, setPendingGifts] = useState([]);
  const [sentGifts, setSentGiftsHistory] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [dailySent, setDailySent] = useState(0);
  const [dailyReceived, setDailyReceived] = useState(0);
  const [lastSent, setLastSent] = useState({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setFriends(getSortedFriends());
    setPendingGifts(getPendingGifts());
    setSentGiftsHistory(getSentGifts());
    setReceivedGifts(getReceivedGifts());
    
    const counts = { sent: 0, received: 0 }; // Would come from giftManager.getDailyGiftsCount()
    setDailySent(counts.sent);
    setDailyReceived(counts.received);
  };

  const player = { id: 'player', name: 'YOU', avatar: '😎', level: cityLevel, netWorth: netWorth || 0, isPlayer: true };
  const leaderboard = [...friends, player].sort((a, b) => b.netWorth - a.netWorth);

  const handleSendGift = (fid) => {
    if (!canSendGift()) { alert('Daily limit!'); return; }
    const r = sendGift(fid, 'dice', cityLevel);
    if (r.success) { setLastSent({ ...lastSent, [fid]: true }); refreshData(); }
  };

  const handleReceiveGift = (giftId) => {
    const r = receiveGift(giftId);
    if (r.success) { refreshData(); alert(`Claimed ${GIFT_TYPES[r.reward.type].emoji} ${r.reward.value}!`); }
  };

  const tabButton = (key, label, icon) => (
    <button key={key} onClick={() => setActiveTab(key)} style={{
      flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
      background: activeTab === key ? themeColor : 'transparent',
      color: activeTab === key ? '#000' : '#94a3b8', fontWeight: 'bold', cursor: 'pointer',
      fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
    }}>
      {icon} {label}
    </button>
  );

  return (
    <div style={{ padding: '8px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
        {tabButton('friends', 'Friends', '👥')}
        {tabButton('gifts', `Gifts ${pendingGifts.length > 0 ? `(${pendingGifts.length})` : ''}`, '🎁')}
        {tabButton('sent', 'Sent', '📤')}
      </div>

      {/* Daily Limit */}
      {activeTab !== 'sent' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Sent: <b style={{ color: themeColor }}>{dailySent}/5</b></span>
          <span style={{ color: '#94a3b8' }}>Received: <b style={{ color: '#10b981' }}>{dailyReceived}/5</b></span>
        </div>
      )}

      {/* Content */}
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {activeTab === 'friends' && (
          <div>
            {leaderboard.map((f, i) => (
              <LeaderboardItem key={f.id} rank={i + 1} friend={f} themeColor={themeColor}
                onSendGift={!f.isPlayer ? handleSendGift : null}
                onCompareCity={!f.isPlayer ? onCompareCity : null}
                canSend={canSendGift() && !lastSent[f.id]}
              />
            ))}
          </div>
        )}

        {activeTab === 'gifts' && (
          <div>
            {pendingGifts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎁</div>
                <div style={{ fontSize: '13px' }}>No gifts to claim</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>Friends can send you dice, funds & shields!</div>
              </div>
            ) : (
              pendingGifts.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ padding: '12px', marginBottom: '8px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid #10b98150' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '28px' }}>{g.fromAvatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{g.fromName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Sent {GIFT_TYPES[g.type].emoji} {GIFT_TYPES[g.type].name}
                      </div>
                    </div>
                    <button onClick={() => handleReceiveGift(g.id)} disabled={!canReceiveGift()} style={{
                      padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px',
                      fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: canReceiveGift() ? 1 : 0.5
                    }}>CLAIM</button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div>
            {sentGifts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
                <div>No gifts sent yet</div>
              </div>
            ) : (
              sentGifts.slice().reverse().map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ padding: '10px', marginBottom: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>{GIFT_TYPES[g.type].emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#fff' }}>To {g.toName}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{GIFT_TYPES[g.type].name} • {new Date(g.sentAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: g.claimed ? '#10b981' : '#fbbf24' }}>
                      {g.claimed ? 'Claimed ✓' : 'Pending'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
