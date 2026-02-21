export const STORAGE_KEYS = {
  FRIENDS: 'cs_friends_v1',
  INVITE_CODE: 'cs_player_code_v1',
  USER_PROFILE: 'cs_user_profile_v1',
  GIFTS: 'cs_gifts_v1',
  FRIEND_STREAKS: 'cs_friend_streaks_v1',
  GIFTS_LAST_RESET: 'cs_gifts_last_reset_v1',
  GIFTS_DAILY_SENT: 'cs_gifts_daily_sent_v1',
  GIFTS_DAILY_RECEIVED: 'cs_gifts_daily_received_v1',
  NOTIFICATIONS: 'cs_notifications_v1',
  NOTIFICATIONS_READ: 'cs_notifications_read_v1',
  VISITOR_LOG: 'cs_visitor_log_v1',
  VISIT_HISTORY: 'cs_visit_history_v1'
};

class LocalStorageAdapter {
  getItem(key, defaultValue = null) {
    try {
      if (typeof localStorage === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }

  getString(key, defaultValue = null) {
    try {
      if (typeof localStorage === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  setString(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  removeItem(key) {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }

  // --- Domain Specific Helpers (Optional, but nice for Manager clarity) ---

  // Profile & Friends
  getFriends() { return this.getItem(STORAGE_KEYS.FRIENDS, []); }
  setFriends(friends) { this.setItem(STORAGE_KEYS.FRIENDS, friends); }
  
  getUserProfile() { return this.getItem(STORAGE_KEYS.USER_PROFILE, null); }
  setUserProfile(profile) { this.setItem(STORAGE_KEYS.USER_PROFILE, profile); }
  
  getInviteCode() { return this.getString(STORAGE_KEYS.INVITE_CODE, null); }
  setInviteCode(code) { this.setString(STORAGE_KEYS.INVITE_CODE, code); }

  // Gifts
  getGifts() { return this.getItem(STORAGE_KEYS.GIFTS, []); }
  setGifts(gifts) { this.setItem(STORAGE_KEYS.GIFTS, gifts); }
  
  getFriendStreaks() { return this.getItem(STORAGE_KEYS.FRIEND_STREAKS, {}); }
  setFriendStreaks(streaks) { this.setItem(STORAGE_KEYS.FRIEND_STREAKS, streaks); }

  // Notifications
  getNotifications() { return this.getItem(STORAGE_KEYS.NOTIFICATIONS, []); }
  setNotifications(notifications) { this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications); }

  // Visits
  getVisitorLog() { return this.getItem(STORAGE_KEYS.VISITOR_LOG, []); }
  setVisitorLog(log) { this.setItem(STORAGE_KEYS.VISITOR_LOG, log); }
  
  getVisitHistory() { return this.getItem(STORAGE_KEYS.VISIT_HISTORY, []); }
  setVisitHistory(history) { this.setItem(STORAGE_KEYS.VISIT_HISTORY, history); }
}

export const storageAdapter = new LocalStorageAdapter();
export default storageAdapter;