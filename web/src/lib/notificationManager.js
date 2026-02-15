/**
 * Notification Manager
 * Handles in-app notifications for friend milestones, gifts, rank changes
 * Offline-first: uses localStorage
 */

import { getUserProfile } from './friendManager';

// Storage keys
const NOTIFICATIONS_KEY = 'cs_notifications_v1';
const NOTIFICATIONS_READ_KEY = 'cs_notifications_read_v1';

// Notification types
export const NOTIFICATION_TYPES = {
  FRIEND_MILESTONE: 'friend_milestone',
  GIFT_RECEIVED: 'gift_received',
  RANK_CHANGE: 'rank_change',
  STREAK_UPDATE: 'streak_update',
  VISITOR: 'visitor'
};

/**
 * Get all notifications
 * @returns {Array}
 */
export const getNotifications = () => {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

/**
 * Get unread notification count
 * @returns {number}
 */
export const getUnreadCount = () => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};

/**
 * Add a new notification
 * @param {string} type - NOTIFICATION_TYPES
 * @param {Object} data - Notification data
 * @returns {Object} Created notification
 */
export const addNotification = (type, data) => {
  const profile = getUserProfile();
  
  const notification = {
    id: crypto.randomUUID(),
    type,
    ...data,
    createdAt: Date.now(),
    read: false
  };
  
  const notifications = getNotifications();
  notifications.unshift(notification);
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return notification;
};

/**
 * Mark notification as read
 * @param {string} notificationId
 * @returns {boolean}
 */
export const markAsRead = (notificationId) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index === -1) return false;
  
  notifications[index].read = true;
  notifications[index].readAt = Date.now();
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return true;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () => {
  const notifications = getNotifications().map(n => ({
    ...n,
    read: true,
    readAt: n.readAt || Date.now()
  }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

/**
 * Clear all notifications
 */
export const clearNotifications = () => {
  localStorage.removeItem(NOTIFICATIONS_KEY);
};

/**
 * Create notification for gift received
 * @param {Object} gift
 */
export const notifyGiftReceived = (gift) => {
  return addNotification(NOTIFICATION_TYPES.GIFT_RECEIVED, {
    title: 'Gift Received!',
    message: `${gift.fromName} sent you ${GIFT_TYPES[gift.type]?.name || 'a gift'}!`,
    friendId: gift.fromId,
    friendName: gift.fromName,
    giftId: gift.id,
    giftType: gift.type,
    emoji: GIFT_TYPES[gift.type]?.emoji || '🎁'
  });
};

/**
 * Create notification for friend milestone
 * @param {Object} friend
 * @param {string} milestone
 * @param {string} detail
 */
export const notifyFriendMilestone = (friend, milestone, detail) => {
  const messages = {
    level_up: `${friend.name} reached Level ${friend.level}!`,
    landmark: `${friend.name} unlocked ${detail}!`,
    net_worth: `${friend.name} hit $${detail} net worth!`
  };
  
  return addNotification(NOTIFICATION_TYPES.FRIEND_MILESTONE, {
    title: 'Friend Milestone!',
    message: messages[milestone] || `${friend.name} achieved something amazing!`,
    friendId: friend.id,
    friendName: friend.name,
    milestone,
    detail,
    emoji: '🎉'
  });
};

/**
 * Create notification for rank change
 * @param {number} oldRank
 * @param {number} newRank
 * @param {string} friendName
 */
export const notifyRankChange = (oldRank, newRank, friendName = null) => {
  const improved = oldRank > newRank;
  
  return addNotification(NOTIFICATION_TYPES.RANK_CHANGE, {
    title: improved ? '📈 Rank Up!' : '📉 Rank Change',
    message: improved 
      ? `You moved from #${oldRank} to #${newRank}!`
      : `${friendName || 'Someone'} passed you! You're now #${newRank}`,
    oldRank,
    newRank,
    improved,
    emoji: improved ? '📈' : '📉'
  });
};

/**
 * Create notification for streak update
 * @param {string} friendId
 * @param {number} streakDays
 */
export const notifyStreakUpdate = (friendId, streakDays) => {
  const friend = getFriends().find(f => f.id === friendId);
  if (!friend) return null;
  
  return addNotification(NOTIFICATION_TYPES.STREAK_UPDATE, {
    title: 'Streak Update!',
    message: `You've exchanged gifts with ${friend.name} for ${streakDays} days in a row!`,
    friendId,
    friendName: friend.name,
    streakDays,
    emoji: '🔥'
  });
};

/**
 * Get notification display text
 * @param {Object} notification
 * @returns {Object} { title, message, emoji, timeAgo }
 */
export const getNotificationDisplay = (notification) => {
  const timeAgo = getTimeAgo(notification.createdAt);
  
  return {
    title: notification.title || 'Notification',
    message: notification.message || '',
    emoji: notification.emoji || '🔔',
    timeAgo
  };
};

/**
 * Format time ago
 * @param {number} timestamp
 * @returns {string}
 */
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Import needed for notifications
import { getFriends } from './friendManager';
import { GIFT_TYPES } from './giftManager';
