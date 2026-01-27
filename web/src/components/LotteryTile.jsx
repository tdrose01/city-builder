import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOTTERY_CONFIG } from '../config/tileTypes';
import audioManager from '../utils/audioManager';

/**
 * LotteryTile Component
 * 
 * Interactive lottery scratch-off experience.
 * Players purchase a ticket and reveal their prize with an animated scratch effect.
 * 
 * Win Probabilities:
 * - 75% chance: Lose (no prize)
 * - 20% chance: Small win (10x ticket cost)
 * - 5% chance: Jackpot (100x ticket cost)
 * 
 * @param {number} cityLevel - Current city level for ticket cost scaling
 * @param {number} currentFunds - Player's current funds
 * @param {function} onResult - Callback with net gain/loss
 * @param {function} onClose - Callback to close the modal
 */
export default function LotteryTile({ 
  cityLevel, 
  currentFunds,
  onResult, 
  onClose 
}) {
  const [stage, setStage] = useState('purchase'); // purchase, scratching, result
  const [result, setResult] = useState(null);
  const [particles, setParticles] = useState([]);
  
  const ticketCost = LOTTERY_CONFIG.ticketCost(cityLevel);
  const canAfford = currentFunds >= ticketCost;
  
  /**
   * Purchase ticket and determine outcome
   */
  const purchaseTicket = () => {
    if (!canAfford) {
      audioManager.playSFX('error');
      return;
    }
    
    audioManager.playSFX('click');
    setStage('scratching');
    
    // Determine outcome based on probabilities
    const roll = Math.random();
    let outcome = null;
    
    if (roll < LOTTERY_CONFIG.jackpotChance) {
      // Jackpot!
      outcome = {
        type: 'jackpot',
        winAmount: ticketCost * LOTTERY_CONFIG.jackpotMultiplier,
        netGain: (ticketCost * LOTTERY_CONFIG.jackpotMultiplier) - ticketCost,
        message: '🎉 JACKPOT! 🎉',
        color: '#fbbf24',
      };
    } else if (roll < LOTTERY_CONFIG.jackpotChance + LOTTERY_CONFIG.smallWinChance) {
      // Small win
      outcome = {
        type: 'win',
        winAmount: ticketCost * LOTTERY_CONFIG.smallWinMultiplier,
        netGain: (ticketCost * LOTTERY_CONFIG.smallWinMultiplier) - ticketCost,
        message: '🎊 Winner! 🎊',
        color: '#10b981',
      };
    } else {
      // Lose
      outcome = {
        type: 'lose',
        winAmount: 0,
        netGain: -ticketCost,
        message: 'Better luck next time!',
        color: '#6b7280',
      };
    }
    
    // Simulate scratching animation
    setTimeout(() => {
      setResult(outcome);
      setStage('result');
      
      // Play appropriate sound
      if (outcome.type === 'jackpot') {
        audioManager.playSFX('achievement');
        createParticles(50);
      } else if (outcome.type === 'win') {
        audioManager.playSFX('success');
        createParticles(20);
      } else {
        audioManager.playSFX('error');
      }
      
      // Report result
      onResult(outcome.netGain);
    }, LOTTERY_CONFIG.scratchDuration);
  };
  
  /**
   * Create celebration particles
   */
  const createParticles = (count) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  };
  
  /**
   * Close modal and clean up
   */
  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
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
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-yellow-500/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="text-6xl mb-2"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: stage === 'purchase' ? Infinity : 0 }}
            >
              {LOTTERY_CONFIG.icon}
            </motion.div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">
              Lottery Ticket
            </h2>
            <p className="text-gray-400">{LOTTERY_CONFIG.description}</p>
          </div>
          
          {/* Purchase Stage */}
          {stage === 'purchase' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Ticket Cost:</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    ${ticketCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Your Funds:</span>
                  <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                    ${currentFunds.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30 space-y-2 text-sm">
                <div className="text-gray-400 font-semibold mb-2">Odds:</div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">🏆 Jackpot (100x):</span>
                  <span className="text-gray-300">5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">💰 Win (10x):</span>
                  <span className="text-gray-300">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">❌ Lose:</span>
                  <span className="text-gray-300">75%</span>
                </div>
              </div>
              
              <button
                onClick={purchaseTicket}
                disabled={!canAfford}
                className={`
                  w-full py-4 px-6 rounded-lg font-bold text-lg
                  transition-all duration-200 transform
                  ${canAfford 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105 active:scale-95' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {canAfford ? '✨ Buy Ticket & Scratch! ✨' : '❌ Not Enough Funds'}
              </button>
              
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
          
          {/* Scratching Stage */}
          {stage === 'scratching' && (
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ 
                  rotate: [0, -15, 15, -15, 15, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.1
                }}
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                Scratching...
              </h3>
              <p className="text-gray-400">Revealing your prize...</p>
              
              <motion.div
                className="mt-6 w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: LOTTERY_CONFIG.scratchDuration / 1000 }}
                />
              </motion.div>
            </motion.div>
          )}
          
          {/* Result Stage */}
          {stage === 'result' && result && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Particles */}
              {particles.length > 0 && result.type !== 'lose' && (
                <div className="absolute inset-0 pointer-events-none">
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="absolute text-2xl"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                      }}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ 
                        opacity: 0, 
                        y: -100,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2,
                        delay: particle.delay,
                      }}
                    >
                      {result.type === 'jackpot' ? '💎' : '✨'}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Result Message */}
              <div 
                className="text-center p-6 rounded-lg border-2"
                style={{ 
                  borderColor: result.color,
                  backgroundColor: `${result.color}20`
                }}
              >
                <h2 
                  className="text-4xl font-bold mb-4"
                  style={{ color: result.color }}
                >
                  {result.message}
                </h2>
                
                {result.type !== 'lose' && (
                  <div className="text-3xl font-bold text-white mb-2">
                    +${result.winAmount.toLocaleString()}
                  </div>
                )}
                
                <div className={`text-xl ${result.netGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Net: {result.netGain >= 0 ? '+' : ''}${result.netGain.toLocaleString()}
                </div>
                
                {result.type === 'lose' && (
                  <p className="text-gray-400 mt-2">
                    You paid ${ticketCost.toLocaleString()} for the ticket
                  </p>
                )}
              </div>
              
              <button
                onClick={handleClose}
                className="w-full py-4 px-6 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg transition-colors"
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
