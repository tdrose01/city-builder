/**
 * Visit Manager
 * Handles city visits, visitor logging, and reactions
 * Offline-first: uses localStorage
 */

import { getFriends } from './friendManager';
import { addNotification, NOTIFICATION_TYPES } from './notificationManager';

/**
 * Simulate an incoming visit from a friend
 * @param {number} tileCount - Total tiles on board to pick a drop location
 * @returns {Object|null} Visit data if occurred
 */
export const simulateIncomingVisit = (tileCount = 20) => {
  const friends = getFriends();
  if (friends.length === 0) return null;

  // 15% chance of a visit occurring during a play session check
  if (Math.random() < 0.15) {
    const friend = friends[Math.floor(Math.random() * friends.length)];
    const targetTileIndex = Math.floor(Math.random() * tileCount);
    
    // Choose a bonus type
    const bonusType = Math.random() > 0.3 ? 'funds' : 'dice';
    const bonusValue = bonusType === 'funds' ? 500 : 3;

    const visitEntry = logVisit(friend.id, friend.name, 'visit_bonus', {
      tileIndex: targetTileIndex,
      bonusType,
      bonusValue,
      claimed: false
    });

    // Notify the player
    addNotification(NOTIFICATION_TYPES.VISITOR, {
      title: 'City Visitor!',
      message: `${friend.name} is visiting your city! They left a surprise on a tile.`,
      friendId: friend.id,
      friendName: friend.name,
      emoji: '🏙️'
    });

    return visitEntry;
  }
  return null;
};

const MAX_LOG_ENTRIES = 50;  // Keep last 50 visits
const MAX_HISTORY_ENTRIES = 100;  // Keep last 100 cities visited

/**
 * Log a visit to user's city
 * @param {string} friendId - Visitor's friend ID
 * @param {string} friendName - Visitor's name
 * @param {string} action - Type of visit
 * @param {Object} metadata - Extra data
 * @returns {Object} Log entry
 */
export const logVisit = (friendId, friendName, action = 'view', metadata = {}) => {
  const entry = {
    id: crypto.randomUUID(),
    friendId,
    friendName,
    action,  // 'view', 'gift', 'reaction'
    visitedAt: Date.now(),
    metadata: {
      ...metadata,
      userAgent: navigator.userAgent
    }
  };
  
  const log = getVisitorLog();
  log.unshift(entry);  // Newest first
  
  // Trim to max
  if (log.length > MAX_LOG_ENTRIES) {
    log.length = MAX_LOG_ENTRIES;
  }
  
  localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(log));
  return entry;
};

/**
 * Get visitor log
 * @param {number} limit - Max entries to return
 * @param {string} actionFilter - Filter by action type
 * @returns {Array} Visitor log
 */
export const getVisitorLog = (limit = null, actionFilter = null) => {
  const log = localStorage.getItem(VISITOR_LOG_KEY);
  let entries = log ? JSON.parse(log) : [];
  
  if (actionFilter) {
    entries = entries.filter(e => e.action === actionFilter);
  }
  
  if (limit) {
    entries = entries.slice(0, limit);
  }
  
  return entries;
};

/**
 * Get unread visit count
 * @returns {number}
 */
export const getUnreadVisitCount = () => {
  const log = getVisitorLog();
  return log.filter(e => !e.read).length;
};

/**
 * Mark visits as read
 * @param {Array} entryIds - IDs to mark read (or all if empty)
 */
export const markVisitsRead = (entryIds = null) => {
  const log = getVisitorLog();
  
  log.forEach(entry => {
    if (!entryIds || entryIds.includes(entry.id)) {
      entry.read = true;
    }
  });
  
  localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(log));
};

/**
 * Clear visitor log
 */
export const clearVisitorLog = () => {
  localStorage.removeItem(VISITOR_LOG_KEY);
};

/**
 * Record user's visit to a friend's city
 * @param {string} friendId - Visited friend's ID
 * @param {Object} friendData - Friend snapshot
 * @returns {Object} Visit record
 */
export const recordVisitToFriend = (friendId, friendData = {}) => {
  const record = {
    id: crypto.randomUUID(),
    friendId,
    friendName: friendData.name || 'Unknown',
    visitedAt: Date.now(),
    cityLevel: friendData.level || 1,
    netWorth: friendData.netWorth || 0
  };
  
  const history = getVisitHistory();
  
  // Remove duplicate (keep newest)
  const filtered = history.filter(h => h.friendId !== friendId);
  filtered.unshift(record);
  
  // Trim
  if (filtered.length > MAX_HISTORY_ENTRIES) {
    filtered.length = MAX_HISTORY_ENTRIES;
  }
  
  localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(filtered));
  return record;
};

/**
 * Get user's visit history
 * @param {number} limit - Max entries
 * @returns {Array}
 */
export const getVisitHistory = (limit = null) => {
  const history = localStorage.getItem(VISIT_HISTORY_KEY);
  const entries = history ? JSON.parse(history) : [];
  return limit ? entries.slice(0, limit) : entries;
};

/**
 * Check if user has visited a city recently
 * @param {string} friendId - Friend's ID
 * @param {number} withinMs - Time window (default 24h)
 * @returns {boolean}
 */
export const hasVisitedRecently = (friendId, withinMs = 24 * 60 * 60 * 1000) => {
  const history = getVisitHistory();
  const recent = history.find(h => h.friendId === friendId);
  if (!recent) return false;
  return Date.now() - recent.visitedAt < withinMs;
};

/**
 * Get visit stats
 * @returns {Object}
 */
export const getVisitStats = () => {
  const log = getVisitorLog();
  const history = getVisitHistory();
  
  const uniqueVisitors = new Set(log.map(e => e.friendId)).size;
  const uniqueVisited = new Set(history.map(h => h.friendId)).size;
  
  return {
    totalVisitors: log.length,
    uniqueVisitors,
    totalVisits: history.length,
    uniqueVisited,
    unread: getUnreadVisitCount()
  };
};

// Reaction types for visitor interactions
export const REACTION_TYPES = {
  THUMBS_UP: { emoji: '👍', name: 'Nice!' },
  FIRE: { emoji: '🔥', name: 'Fire!' },
  STAR: { emoji: '⭐', name: 'Stars!' },
          HEART: { emoji: '❤️', name: 'Love it!' },
  CROWN: { emoji: '👑', name: 'Kings!' }
};

/**
 * Log a reaction on friend's building
 * @param {string} friendId - Friend being visited
 * @param {string} buildingId - Building that was reacted to
 * @param {string} reactionType - Key from REACTION_TYPES
 * @param {Object} friendData - Current friend data for logging
 * @returns {Object}
 */
export const logReaction = (friendId, buildingId, reactionType, friendData = {}) => {
  const reaction = REACTION_TYPES[reactionType];
  if (!reaction) return null;
  
  const entry = {
    id: crypto.randomUUID(),
    friendId,
    friendName: friendData.name || 'Unknown',
    action: 'reaction',
    visitedAt: Date.now(),
    metadata: {
      buildingId,
      reactionType,
      reactionEmoji: reaction.emoji
    }
  };
  
  const log = getVisitorLog();
  log.unshift(entry);
  
  if (log.length > MAX_LOG_ENTRIES) {
    log.length = MAX_LOG_ENTRIES;
  }
  
  localStorage.setItem(VISITOR_LOG_KEY, JSON.stringify(log));
  return entry;
};
