import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getSortedFriends, 
  getUserProfile,
  removeFriend 
} from '../../lib/friendManager';
import { 
  getPendingGifts, 
  getSentGifts, 
  getReceivedGifts,
  sendGift, 
  receiveGift, 
  canSendGift,
  getDailyGiftsCount, 
  GIFT_TYPES,
  GIFT_CONSTANTS
} from '../../lib/giftManager';

/**
 * EnhancedSocialTab - Social hub with Friends/Gifts/Sent tabs
 * Supports: Friend list, gift inbox/outbox, gift sending with daily caps
 */
export default function EnhancedSocialTab({
  cityLevel,
  netWorth,
  themeColor = '#00f3ff',
  onAddFriend,
  onCompareCity,
  onVisitCity
}) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [player, setPlayer] = useState(null);
  const [dailyCount, setDailyCount] = useState({ sent: 0, received: 0 });
  const [pendingGifts, setPendingGifts] = useState([]);
  const [sentGifts, setSentGifts] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [giftSentTo, setGiftSentTo] = useState(new Set());

  // Refresh all data
  const refreshData = () => {
    setFriends(getSortedFriends());
    setPlayer(getUserProfile());
    setDailyCount(getDailyGiftsCount());
    setPendingGifts(getPendingGifts());
    setSentGifts(getSentGifts().slice(0, 20));
    setReceivedGifts(getReceivedGifts().slice(0, 20));
    
    // Track sent gifts to friends today
    const sent = getSentGifts();
    const sentIds = new Set(sent.filter(g => {
      const sentDate = new Date(g.sentAt).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return sentDate === today;
    }).map(g => g.toId));
    setGiftSentTo(sentIds);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const playerStats = {
    id: player?.id || 'player',
    name: 'YOU',
    avatar: player?.avatar || '😎',
    level: cityLevel || player?.level || 1,
    netWorth: netWorth || player?.netWorth || 0,
    isPlayer: true
  };

  const leaderboard = [...friends, playerStats].sort((a, b) => b.netWorth - a.netWorth);

  const giftOptions = [
    { id: 'dice', ...GIFT_TYPES.dice },
    { id: 'funds', ...GIFT_TYPES.funds },
    { id: 'shield', ...GIFT_TYPES.shield }
  ];

  const handleSendGift = (friendId, giftType = 'dice') => {
    if (!canSendGift()) {
      alert('Daily limit reached (5/5)');
      return;
    }
    const result = sendGift(friendId, giftType, cityLevel);
    if (result.success) {
      setGiftSentTo(new Set([...giftSentTo, friendId]));
      refreshData();
      const config = GIFT_TYPES[giftType];
      alert(`Sent ${config.emoji} ${config.name}!`);
    }
  };

  const handleReceiveGift = (giftId) => {
    const result = receiveGift(giftId);
    if (result.success) {
      refreshData();
      const config = GIFT_TYPES[result.reward.type];
      let msg = `Claimed ${config.emoji} ${result.reward.name || result.reward.type}!`;
      if (result.streak?.current > 1) {
        msg += `\n🔥 ${result.streak.current}-day streak!`;
      }
      alert(msg);
    }
  };

  const handleRemoveFriend = (friendId) => {
    if (confirm('Remove this friend?')) {
      removeFriend(friendId);
      refreshData();
    }
  };

  const hasPendingGift = (friendId) => pendingGifts.some(g => g.fromId === friendId);
  const canSendToFriend = (friendId) => canSendGift() && !giftSentTo.has(friendId);

  const tabs = [
    { id: 'friends', label: '👥 Friends', count: friends.length },
    { id: 'gifts', label: '🎁 Inbox', count: pendingGifts.length },
    { id: 'sent', label: '📤 Sent', count: sentGifts.filter(g => new Date(g.sentAt).toDateString() === new Date().toDateString()).length }
  ];

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 12px', marginBottom: '12px',
        background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '12px'
      }}>
        <span style={{ color: '#94a3b8' }}>
          <b style={{ color: themeColor }}>{friends.length}</b> friends
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ color: '#94a3b8' }}>
            Sent: <b style={{ color: dailyCount.sent >= 5 ? '#ef4444' : '#3b82f6' }}>
              {dailyCount.sent}/{GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_SENT}
            </b>
          </span>
          <span style={{ color: '#94a3b8' }}>
            Received: <b style={{ color: dailyCount.received >= 5 ? '#10b981' : '#22c55e' }}>
              {dailyCount.received}/{GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_RECEIVED}
            </b>
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '12px', padding: '4px',
        background: 'rgba(0,0,0,0.2)', borderRadius: '12px'
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '10px 8px', borderRadius: '8px', border: 'none',
            background: activeTab === tab.id ? themeColor : 'transparent',
            color: activeTab === tab.id ? '#000' : '#94a3b8',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                padding: '2px 6px', borderRadius: '10px',
                background: activeTab === tab.id ? 'rgba(0,0,0,0.2)' : themeColor,
                color: activeTab === tab.id ? '#000' : '#fff',
                fontSize: '10px'
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Add Friend Button */}
              <button onClick={onAddFriend} style={{
                width: '100%', padding: '12px', marginBottom: '12px',
                background: themeColor, color: '#000', border: 'none', borderRadius: '10px',
                fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
              }}>
                ➕ Add Friend
              </button>

              {/* Leaderboard List */}
              {leaderboard.map((entry, index) => {
                const isPlayer = entry.isPlayer;
                const hasGift = hasPendingGift(entry.id);
                const canSend = !isPlayer && canSendToFriend(entry.id);
                const sent = giftSentTo.has(entry.id);

                return (
                  <div key={entry.id} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '12px', marginBottom: '8px',
                    background: isPlayer ? `${themeColor}15` : 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    border: isPlayer ? `1px solid ${themeColor}50` : '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{
                      width: '32px', fontWeight: 'bold',
                      color: index < 3 ? ['#fbbf24', '#c0c0c0', '#cd7f32'][index] : '#94a3b8',
                      fontSize: '14px'
                    }}>