import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, getNotificationDisplay } from '../../lib/notificationManager';

/**
 * NotificationBell - Badge with dropdown for notifications
 */
export default function NotificationBell({ themeColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Load notifications
  useEffect(() => {
    refreshNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const refreshNotifications = () => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  };

  const handleMarkRead = (id) => {
    markAsRead(id);
    refreshNotifications();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    refreshNotifications();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Get icon based on notification type
  const getTypeIcon = (type) => {
    const icons = {
      friend_milestone: '🎉',
      gift_received: '🎁',
      rank_change: '📈',
      streak_update: '🔥',
      visitor: '👁️'
    };
    return icons[type] || '🔔';
  };

  // Get background color based on type
  const getTypeColor = (type) => {
    const colors = {
      friend_milestone: 'rgba(251, 191, 36, 0.2)',
      gift_received: 'rgba(16, 185, 129, 0.2)',
      rank_change: 'rgba(59, 130, 246, 0.2)',
      streak_update: 'rgba(239, 68, 68, 0.2)',
      visitor: 'rgba(168, 85, 247, 0.2)'
    };
    return colors[type] || 'rgba(255, 255, 255, 0.1)';
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          padding: '10px',
          background: isOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🔔
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#fff',
              padding: '2px 4px'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '320px',
              maxHeight: '400px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              zIndex: 1000
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                📬 Notifications
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    fontSize: '11px',
                    color: themeColor,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                  <div style={{ fontSize: '13px' }}>No notifications yet</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                    Gift exchanges and friend milestones appear here
                  </div>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const display = getNotificationDisplay(notification);
                  const isUnread = !notification.read;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleMarkRead(notification.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        background: isUnread ? 'rgba(255,255,255,0.05)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: getTypeColor(notification.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
