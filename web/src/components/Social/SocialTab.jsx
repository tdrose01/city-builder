import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderboardItem from './LeaderboardItem';
import { SOCIAL_CONFIG } from '../../config/social';
import { getFriends, getSortedFriends, getUserProfile } from '../../lib/friendManager';
import { getPendingGifts, getSentGifts, getReceivedGifts, canSendGift, canReceiveGift, GIFT_TYPES, sendGift, receiveGift, getDailyGiftsCount } from '../../lib/giftManager';
import { getVisitorLog } from '../../lib/visitManager';
import { getNotifications } from '../../lib/notificationManager';
import { useSocialStore } from '../../social/core/SocialStore';
import { useStickerStore } from '../../store/useStickerStore';
import { useMissionStore } from '../../store/useMissionStore';
import { getStickerById } from '../../data/stickers/stickerData';
import StickerSelectorModal from './StickerSelectorModal';

export default function SocialTab({ cityLevel, netWorth, themeColor, onCompareCity, onClaimStickerPack }) {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' | 'gifts' | 'sent'
  const [friends, setFriends] = useState([]);
  const [pendingGifts, setPendingGifts] = useState([]);
  const [sentGifts, setSentGiftsHistory] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [dailySent, setDailySent] = useState(0);
  const [dailyReceived, setDailyReceived] = useState(0);
  const [lastSent, setLastSent] = useState({});
  const [activityFeed, setActivityFeed] = useState([]);

  // Reactive store subscriptions (Phase C migration)
  const _friendsVersion = useSocialStore(state => state.friends);
  const _giftsVersion = useSocialStore(state => state.gifts);
  const _notificationsVersion = useSocialStore(state => state.notifications);
  const _visitorLogVersion = useSocialStore(state => state.visitorLog);

  // Phase 13: Trading & Requests State
  const [isStickerSelectorOpen, setIsStickerSelectorOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  const owned = useStickerStore(state => state.owned);
  const activeRequests = useStickerStore(state => state.requests);
  const sendStickerAction = useStickerStore(state => state.sendSticker);
  const fulfillRequestAction = useStickerStore(state => state.fulfillRequest);

  // Phase 14: Mission Store
  const updateMissionProgress = useMissionStore(state => state.updateMissionProgress);

  const handleOpenStickerSelector = (friend) => {
    setSelectedFriend(friend);
    setIsStickerSelectorOpen(true);
  };

  const handleStickerSelect = (sticker) => {
    if (!selectedFriend) return;
    
    const success = sendStickerAction(sticker.id, selectedFriend.id);
    if (success) {
      setIsStickerSelectorOpen(false);
      
      // Phase 14: Track Social Mission
      updateMissionProgress('sticker_send', 1);
      
      alert(`Sent ${sticker.name} to ${selectedFriend.name}!`);
      refreshData();
    } else {
      alert("Failed to send sticker. Do you have a duplicate?");
    }
  };

  const handleFulfillRequest = (request) => {
    const success = fulfillRequestAction(request.id);
    if (success) {
      alert(`Request fulfilled! You earned ${request.reward} bonus dice!`);
      // In a full integration, we'd dispatch a dice grant to the main store here
      refreshData();
    } else {
      alert("You don't have a duplicate of this sticker!");
    }
  };

  useEffect(() => {
    refreshData();
  }, [_friendsVersion, _giftsVersion, _notificationsVersion, _visitorLogVersion]);

  const refreshData = () => {
    setFriends(getSortedFriends());
    setPendingGifts(getPendingGifts());
    setSentGiftsHistory(getSentGifts());
    setReceivedGifts(getReceivedGifts());
    
    const counts = getDailyGiftsCount();
    setDailySent(counts.sent);
    setDailyReceived(counts.received);

    // Phase 15: Merge notifications and visitor logs for Activity Feed
    const notifications = getNotifications();
    const visitorLogs = getVisitorLog();
    
    const merged = [
      ...notifications.map(n => ({ ...n, feedType: 'notification' })),
      ...visitorLogs.map(v => ({ ...v, feedType: 'visit', createdAt: v.visitedAt }))
    ].sort((a, b) => b.createdAt - a.createdAt);
    
    setActivityFeed(merged.slice(0, 30)); // Keep top 30
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
    if (r.success) { 
      refreshData(); 
      if (r.reward.type === 'sticker_pack') {
        if (onClaimStickerPack) onClaimStickerPack(r.reward.value);
      } else {
        alert(`Claimed ${GIFT_TYPES[r.reward.type].emoji} ${r.reward.value}!`); 
      }
    }
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
        {tabButton('activity', 'Activity', '🔔')}
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
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activityFeed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <div>No recent activity</div>
              </div>
            ) : (
              activityFeed.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.03 }}
                  style={{ 
                    padding: '10px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    borderLeft: `3px solid ${item.feedType === 'visit' ? '#f59e0b' : themeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ fontSize: '20px' }}>{item.emoji || '🔔'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#fff', lineHeight: '1.4' }}>{item.message}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div>
            {/* Sticker Requests Simulation */}
            {activeRequests.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '10px', fontWeight: 'black', color: '#60a5fa', uppercase: 'true', letterSpacing: '0.1em', marginBottom: '8px', marginTop: 0 }}>
                  SOCIAL REQUESTS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeRequests.map(req => {
                    const friend = friends.find(f => f.id === req.friendId);
                    const sticker = getStickerById(req.stickerId);
                    const hasDuplicate = (owned[req.stickerId] || 0) > 1;

                    return (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '20px' }}>{friend?.avatar || '👤'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>{friend?.name} needs</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{sticker?.icon} {sticker?.name}</div>
                        </div>
                        <button 
                          onClick={() => handleFulfillRequest(req)}
                          disabled={!hasDuplicate}
                          style={{
                            padding: '6px 12px',
                            background: hasDuplicate ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            color: hasDuplicate ? '#fff' : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: hasDuplicate ? 'pointer' : 'default'
                          }}
                        >
                          {hasDuplicate ? 'HELP' : 'LOCKED'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {leaderboard.map((f, i) => (
              <LeaderboardItem key={f.id} rank={i + 1} friend={f} themeColor={themeColor}
                onSendGift={!f.isPlayer ? handleSendGift : null}
                onSendSticker={!f.isPlayer ? () => handleOpenStickerSelector(f) : null}
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
