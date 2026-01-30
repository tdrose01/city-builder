import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLOT_CONFIG, SLOT_SYMBOLS, getSlotResult } from '../config/miniGames';
import audioManager from '../utils/audioManager';

/**
 * SlotMachine Component
 *
 * 3-reel slot machine mini-game with tiered payouts.
 * Follows the LotteryTile 3-stage pattern: bet → spinning → result.
 *
 * @param {number} cityLevel - Current city level for cost scaling
 * @param {number} currentFunds - Player's current funds
 * @param {function} onResult - Callback with net gain/loss
 * @param {function} onClose - Callback to close modal
 */
export default function SlotMachine({ cityLevel, currentFunds, onResult, onClose }) {
  const [stage, setStage] = useState('bet');
  const [result, setResult] = useState(null);
  const [displayReels, setDisplayReels] = useState(['❓', '❓', '❓']);
  const [reelsStopped, setReelsStopped] = useState([false, false, false]);
  const [particles, setParticles] = useState([]);

  const spinCost = SLOT_CONFIG.spinCost(cityLevel);
  const canAfford = currentFunds >= spinCost;

  // Reel animation during spinning
  useEffect(() => {
    if (stage !== 'spinning') return;

    const interval = setInterval(() => {
      setDisplayReels(prev =>
        prev.map((_, i) =>
          reelsStopped[i]
            ? (result?.reels[i] || prev[i])
            : SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, [stage, reelsStopped, result]);

  const handleSpin = () => {
    if (!canAfford) {
      audioManager.playSFX('error');
      return;
    }

    audioManager.playSFX('click');
    setStage('spinning');

    const outcome = getSlotResult(cityLevel);
    setResult(outcome);

    // Stagger reel stops
    setTimeout(() => {
      setReelsStopped([true, false, false]);
      setDisplayReels(prev => [outcome.reels[0], prev[1], prev[2]]);
    }, SLOT_CONFIG.spinDuration - SLOT_CONFIG.reelStaggerMs * 2);

    setTimeout(() => {
      setReelsStopped([true, true, false]);
      setDisplayReels(prev => [outcome.reels[0], outcome.reels[1], prev[2]]);
    }, SLOT_CONFIG.spinDuration - SLOT_CONFIG.reelStaggerMs);

    setTimeout(() => {
      setReelsStopped([true, true, true]);
      setDisplayReels(outcome.reels);
      setStage('result');

      if (outcome.type === 'jackpot') {
        audioManager.playSFX('achievement');
        createParticles(50);
      } else if (outcome.type === 'match3' || outcome.type === 'match2') {
        audioManager.playSFX('success');
        createParticles(20);
      } else {
        audioManager.playSFX('error');
      }

      onResult(outcome.netGain);
    }, SLOT_CONFIG.spinDuration);
  };

  const createParticles = (count) => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
    );
  };

  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };

  const getResultMessage = () => {
    if (!result) return '';
    switch (result.type) {
      case 'jackpot': return '💎 JACKPOT! 💎';
      case 'match3': return '🎉 Triple Match! 🎉';
      case 'match2': return '✨ Double Match! ✨';
      default: return 'No Match';
    }
  };

  const getResultColor = () => {
    if (!result) return '#6b7280';
    switch (result.type) {
      case 'jackpot': return '#fbbf24';
      case 'match3': return '#10b981';
      case 'match2': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            border: '2px solid #fbbf2480',
            boxShadow: '0 0 40px #fbbf2422',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>{SLOT_CONFIG.icon}</div>
            <h2 style={{ color: SLOT_CONFIG.color, fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {SLOT_CONFIG.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>
              {SLOT_CONFIG.description}
            </p>
          </div>

          {/* Reels Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            {displayReels.map((symbol, i) => (
              <motion.div
                key={i}
                animate={stage === 'spinning' && !reelsStopped[i] ? { y: [0, -5, 5, 0] } : {}}
                transition={stage === 'spinning' ? { duration: 0.15, repeat: Infinity } : {}}
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#0f0f23',
                  borderRadius: '12px',
                  border: `2px solid ${reelsStopped[i] && stage === 'result' ? getResultColor() : '#fbbf2440'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  boxShadow: reelsStopped[i] && stage === 'result' ? `0 0 15px ${getResultColor()}44` : 'none',
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          {/* Bet Stage */}
          {stage === 'bet' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{
                background: '#0f0f2380',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #fbbf2430',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>Spin Cost:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px' }}>
                    ${spinCost.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Your Funds:</span>
                  <span style={{ color: canAfford ? '#10b981' : '#ef4444' }}>
                    ${currentFunds.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{
                background: '#0f0f2380',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                border: '1px solid #8b5cf630',
                fontSize: '13px',
              }}>
                <div style={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>Payouts:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: '#fbbf24' }}>💎💎💎 Jackpot:</span>
                  <span style={{ color: '#e2e8f0' }}>100x</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: '#10b981' }}>Triple Match:</span>
                  <span style={{ color: '#e2e8f0' }}>10x</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#3b82f6' }}>Double Match:</span>
                  <span style={{ color: '#e2e8f0' }}>2x</span>
                </div>
              </div>

              <button
                data-testid="slot-spin-btn"
                onClick={handleSpin}
                disabled={!canAfford}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  background: canAfford ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#374151',
                  color: canAfford ? '#000' : '#6b7280',
                  marginBottom: '8px',
                }}
              >
                {canAfford ? '🎰 Spin! 🎰' : '❌ Not Enough Funds'}
              </button>
              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#374151',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* Spinning Stage */}
          {stage === 'spinning' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
              <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px', margin: '0 0 12px' }}>
                Spinning...
              </p>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#374151',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: SLOT_CONFIG.spinDuration / 1000 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '3px' }}
                />
              </div>
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && result && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Particles */}
              {particles.length > 0 && result.type !== 'lose' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: '18px' }}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -80, rotate: Math.random() * 360 }}
                      transition={{ duration: 2, delay: p.delay }}
                    >
                      {result.type === 'jackpot' ? '💎' : '✨'}
                    </motion.div>
                  ))}
                </div>
              )}

              <div style={{
                textAlign: 'center',
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${getResultColor()}`,
                background: `${getResultColor()}15`,
                marginBottom: '16px',
              }}>
                <h3 style={{ color: getResultColor(), fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>
                  {getResultMessage()}
                </h3>
                {result.payout > 0 && (
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                    +${result.payout.toLocaleString()}
                  </div>
                )}
                <div style={{ color: result.netGain >= 0 ? '#10b981' : '#ef4444', fontSize: '16px' }}>
                  Net: {result.netGain >= 0 ? '+' : ''}${result.netGain.toLocaleString()}
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Continue
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
