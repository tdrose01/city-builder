import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FORTUNE_CONFIG, selectFortuneEvent } from '../config/tileTypes';
import audioManager from '../utils/audioManager';

/**
 * FortuneTile Component
 * 
 * Triggers a random event from a weighted pool of positive, neutral, and negative outcomes.
 * Events include bonus funds, teleportation, free items, and penalties.
 * 
 * @param {number} cityLevel - Current city level for value scaling
 * @param {function} onResult - Callback with event result
 * @param {function} onClose - Callback to close the modal
 */
export default function FortuneTile({
  cityLevel,
  onResult,
  onClose
}) {
  const [stage, setStage] = useState('reveal'); // reveal, result
  const [event, setEvent] = useState(null);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Select random event after a dramatic pause
    setTimeout(() => {
      const selectedEvent = selectFortuneEvent();
      setEvent(selectedEvent);
      setStage('result');
      
      // Play sound
      if (selectedEvent.sound) {
        audioManager.playSFX(selectedEvent.sound);
      }
      
      // Create particles for positive events
      if (selectedEvent.type === 'positive') {
        createParticles(30);
      }
      
      // Calculate actual value if needed
      let effectValue = null;
      if (selectedEvent.effect.getValue) {
        effectValue = selectedEvent.effect.getValue(cityLevel);
      } else if (selectedEvent.effect.value !== undefined) {
        effectValue = selectedEvent.effect.value;
      }
      
      // Report result
      onResult({
        event: selectedEvent,
        effectValue,
      });
    }, FORTUNE_CONFIG.revealDuration);
  }, [cityLevel, onResult]);
  
  /**
   * Create celebration particles
   */
  const createParticles = (count) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      emoji: ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
  };
  
  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };
  
  const getEventColor = (type) => {
    switch (type) {
      case 'positive': return '#10b981'; // Green
      case 'neutral': return '#8b5cf6'; // Purple
      case 'negative': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'positive': return '✨';
      case 'neutral': return '🔄';
      case 'negative': return '⚠️';
      default: return '❓';
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-purple-500/50 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mystical Background Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent" />
          </motion.div>
          
          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <motion.div
              className="text-6xl mb-2"
              animate={stage === 'reveal' ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 1, repeat: stage === 'reveal' ? Infinity : 0 }}
            >
              {FORTUNE_CONFIG.icon}
            </motion.div>
            <h2 className="text-3xl font-bold text-purple-400 mb-2">
              Fortune Teller
            </h2>
            <p className="text-gray-400">{FORTUNE_CONFIG.description}</p>
          </div>
          
          {/* Reveal Stage */}
          {stage === 'reveal' && (
            <motion.div
              className="flex flex-col items-center justify-center py-12 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="relative"
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <div className="text-8xl">🔮</div>
                
                {/* Floating mystical symbols */}
                {['✨', '⭐', '🌟', '💫'].map((symbol, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * Math.PI / 2) * 60],
                      y: [0, Math.sin(i * Math.PI / 2) * 60],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    {symbol}
                  </motion.div>
                ))}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-purple-300 mt-8 mb-2">
                Reading your fortune...
              </h3>
              <p className="text-gray-500">The crystal ball reveals...</p>
            </motion.div>
          )}
          
          {/* Result Stage */}
          {stage === 'result' && event && (
            <motion.div
              className="space-y-6 relative z-10"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {/* Particles */}
              {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="absolute text-2xl"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                      }}
                      initial={{ opacity: 1, scale: 0 }}
                      animate={{ 
                        opacity: 0, 
                        y: -100,
                        scale: 1,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2,
                        delay: particle.delay,
                      }}
                    >
                      {particle.emoji}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Event Card */}
              <motion.div
                className="p-6 rounded-lg border-2 relative overflow-hidden"
                style={{
                  borderColor: getEventColor(event.type),
                  backgroundColor: `${getEventColor(event.type)}20`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${getEventColor(event.type)}40`,
                    `0 0 40px ${getEventColor(event.type)}60`,
                    `0 0 20px ${getEventColor(event.type)}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Event Type Badge */}
                <div 
                  className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: getEventColor(event.type),
                    color: 'white',
                  }}
                >
                  {getEventIcon(event.type)} {event.type.toUpperCase()}
                </div>
                
                {/* Event Name */}
                <h2 
                  className="text-3xl font-bold mb-4 pr-20"
                  style={{ color: getEventColor(event.type) }}
                >
                  {event.name}
                </h2>
                
                {/* Event Description */}
                <p className="text-lg text-gray-300 mb-4">
                  {event.description}
                </p>
                
                {/* Event Effect */}
                {event.effect.type !== 'NONE' && (
                  <div className="bg-black/30 rounded-lg p-4 mt-4">
                    <div className="text-sm text-gray-400 mb-1">Effect:</div>
                    <div className="text-xl font-bold text-white">
                      {event.effect.type === 'ADD_FUNDS' && `+$${event.effect.getValue(cityLevel).toLocaleString()}`}
                      {event.effect.type === 'LOSE_FUNDS' && `-$${event.effect.getValue(cityLevel).toLocaleString()}`}
                      {event.effect.type === 'ADD_DICE' && `+${event.effect.value} Dice`}
                      {event.effect.type === 'ADD_SHIELDS' && `+${event.effect.value} Shields`}
                      {event.effect.type === 'TELEPORT' && `Move ${event.effect.value > 0 ? 'forward' : 'backward'} ${Math.abs(event.effect.value)} spaces`}
                      {event.effect.type === 'RANDOM_TELEPORT' && 'Teleport to random tile'}
                      {event.effect.type === 'SKIP_TURNS' && `Skip ${event.effect.value} turn${event.effect.value > 1 ? 's' : ''}`}
                    </div>
                  </div>
                )}
              </motion.div>
              
              <button
                onClick={handleClose}
                className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors"
                style={{
                  backgroundColor: getEventColor(event.type),
                  color: 'white',
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
