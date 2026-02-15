import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addFriendByCode, getUserInviteCode, getInviteText } from '../../lib/friendManager';

export default function FriendModal({ isOpen, onClose, themeColor = '#00f3ff' }) {
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const userCode = getUserInviteCode();
  const inviteText = getInviteText();
  
  const handleAddFriend = () => {
    setError(null);
    setSuccess(null);
    
    if (!codeInput.trim()) {
      setError('Enter a code');
      return;
    }
    
    const result = addFriendByCode(codeInput);
    
    if (result.success) {
      setSuccess(`Added ${result.friend.name}!`);
      setCodeInput('');
      setTimeout(() => onClose(), 1000);
    } else {
      setError(result.error);
    }
  };
  
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            width: '90%',
            maxWidth: '400px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: `2px solid ${themeColor}`,
            padding: '24px'
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2 style={{
            margin: '0 0 20px 0',
            color: themeColor,
            fontSize: '20px',
            textAlign: 'center'
          }}>
            👥 Add Friend
          </h2>
          
          {/* Your Code Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              Your Invite Code
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '4px',
              fontFamily: 'monospace'
            }}>
              {userCode}
            </div>
            <button
              onClick={handleCopyCode}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: copied ? '#10b981' : themeColor,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          
          {/* Add Friend Section */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px'
            }}>
              Enter Friend's Code
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: `2px solid ${error ? '#ef4444' : themeColor}`,
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <div style={{
              color: '#ef4444',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              color: '#10b981',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {success}
            </div>
          )}
          
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddFriend}
              disabled={codeInput.length < 6}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: codeInput.length >= 6 ? themeColor : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: codeInput.length >= 6 ? '#000' : '#64748b',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: codeInput.length >= 6 ? 'pointer' : 'not-allowed'
              }}
            >
              Add Friend
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
