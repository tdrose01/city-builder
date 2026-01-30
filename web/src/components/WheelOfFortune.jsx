import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WHEEL_CONFIG, WHEEL_SEGMENTS, getWheelResult } from '../config/miniGames';
import audioManager from '../utils/audioManager';

/**
 * WheelOfFortune Component
 *
 * 12-segment prize wheel with free spin, once per city.
 * 2-stage flow: spin → result.
 *
 * @param {number} cityLevel - Current city level for prize scaling
 * @param {number} currentFunds - Player's current funds (for bankrupt calculation)
 * @param {function} onResult - Callback with { type, value } prize
 * @param {function} onClose - Callback to close modal
 */
export default function WheelOfFortune({ cityLevel, currentFunds, onResult, onClose }) {
  const [stage, setStage] = useState('spin');
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [particles, setParticles] = useState([]);

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  const handleSpin = () => {
    if (spinning) return;

    audioManager.playSFX('click');
    setSpinning(true);

    const outcome = getWheelResult();
    setResult(outcome);

    // Calculate rotation to land on the selected segment
    // Segments are arranged clockwise; pointer is at top (0 degrees)
    const targetAngle = outcome.index * segmentAngle + segmentAngle / 2;
    // Spin multiple full rotations plus land on target
    const totalRotation = 360 * 5 + (360 - targetAngle);
    setWheelRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setStage('result');

      const seg = outcome.segment;

      // Compute actual value
      let actualValue = null;
      let resultPayload = { type: seg.type };

      switch (seg.type) {
        case 'funds':
          actualValue = seg.getValue(cityLevel);
          resultPayload.value = actualValue;
          audioManager.playSFX('success');
          createParticles(25);
          break;
        case 'dice':
          actualValue = seg.value;
          resultPayload.value = actualValue;
          audioManager.playSFX('success');
          createParticles(15);
          break;
        case 'shields':
          actualValue = seg.value;
          resultPayload.value = actualValue;
          audioManager.playSFX('success');
          createParticles(15);
          break;
        case 'power_up':
          resultPayload.value = 1;
          audioManager.playSFX('achievement');
          createParticles(20);
          break;
        case 'sticker_pack':
          resultPayload.value = 1;
          audioManager.playSFX('achievement');
          createParticles(20);
          break;
        case 'bankrupt':
          actualValue = Math.floor(currentFunds * 0.5);
          resultPayload.value = actualValue;
          audioManager.playSFX('error');
          break;
        default:
          break;
      }

      onResult(resultPayload);
    }, WHEEL_CONFIG.spinDuration);
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

  const getResultText = () => {
    if (!result) return '';
    const seg = result.segment;
    switch (seg.type) {
      case 'funds': return `+$${seg.getValue(cityLevel).toLocaleString()}`;
      case 'dice': return `+${seg.value} Dice`;
      case 'shields': return `+${seg.value} Shields`;
      case 'power_up': return 'Random Power-Up!';
      case 'sticker_pack': return 'Sticker Pack!';
      case 'bankrupt': return `Lost $${Math.floor(currentFunds * 0.5).toLocaleString()}`;
      default: return '';
    }
  };

  const getResultColor = () => {
    if (!result) return '#6b7280';
    return result.segment.type === 'bankrupt' ? '#ef4444' : '#10b981';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={stage === 'result' ? handleClose : undefined}
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
            background: 'linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '420px',
            width: '90%',
            border: `2px solid ${WHEEL_CONFIG.color}80`,
            boxShadow: `0 0 40px ${WHEEL_CONFIG.color}22`,
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '4px' }}>{WHEEL_CONFIG.icon}</div>
            <h2 style={{ color: WHEEL_CONFIG.color, fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
              {WHEEL_CONFIG.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>
              {WHEEL_CONFIG.description}
            </p>
          </div>

          {/* Pointer */}
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>▼</div>

          {/* Wheel */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '0 auto 20px',
          }}>
            <motion.div
              animate={{ rotate: wheelRotation }}
              transition={spinning ? {
                duration: WHEEL_CONFIG.spinDuration / 1000,
                ease: [0.2, 0.8, 0.3, 1],
              } : { duration: 0 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                border: '4px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              {WHEEL_SEGMENTS.map((seg, i) => {
                const rotation = i * segmentAngle;
                const isWinner = stage === 'result' && result?.index === i;
                return (
                  <div
                    key={seg.id}
                    data-testid={`wheel-segment-${seg.id}`}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%',
                      height: '100%',
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.tan(Math.PI / WHEEL_SEGMENTS.length)}% 0%)`,
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: isWinner ? `${seg.color}` : `${seg.color}aa`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingTop: '12px',
                    }}>
                      <span style={{
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        transform: `rotate(${segmentAngle / 2}deg)`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                      }}>
                        {seg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Center circle */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40px', height: '40px',
                borderRadius: '50%',
                background: '#1a1a2e',
                border: '3px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                zIndex: 1,
              }}>
                🎡
              </div>
            </motion.div>
          </div>

          {/* Spin Stage */}
          {stage === 'spin' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                data-testid="wheel-spin-btn"
                onClick={handleSpin}
                disabled={spinning}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: spinning ? 'not-allowed' : 'pointer',
                  background: spinning
                    ? '#374151'
                    : `linear-gradient(135deg, ${WHEEL_CONFIG.color}, #7c3aed)`,
                  color: spinning ? '#6b7280' : '#fff',
                  marginBottom: '8px',
                }}
              >
                {spinning ? 'Spinning...' : '🎡 Spin the Wheel! 🎡'}
              </button>
              {!spinning && (
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
                  Skip
                </button>
              )}
            </motion.div>
          )}

          {/* Result Stage */}
          {stage === 'result' && result && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Particles */}
              {particles.length > 0 && result.segment.type !== 'bankrupt' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: '16px' }}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -60, rotate: Math.random() * 360 }}
                      transition={{ duration: 2, delay: p.delay }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}

              <div style={{
                padding: '16px',
                borderRadius: '8px',
                border: `2px solid ${getResultColor()}`,
                background: `${getResultColor()}15`,
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>
                  {result.segment.type === 'bankrupt' ? '💀' : '🎉'}
                </div>
                <h3 style={{ color: getResultColor(), fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>
                  {result.segment.label}
                </h3>
                <div style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 'bold' }}>
                  {getResultText()}
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${WHEEL_CONFIG.color}, #7c3aed)`,
                  color: '#fff',
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
