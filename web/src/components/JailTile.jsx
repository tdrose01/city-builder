import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JAIL_CONFIG } from '../config/tileTypes';
import audioManager from '../utils/audioManager';

/**
 * JailTile Component
 * 
 * Player is sent to jail and must choose how to escape:
 * - Pay bail (instant escape)
 * - Use "Get Out of Jail Free" card (if available)
 * - Stay in jail (skip turns, can attempt to roll doubles)
 * 
 * @param {number} cityLevel - Current city level for bail cost scaling
 * @param {number} currentFunds - Player's current funds
 * @param {boolean} hasJailFreeCard - Whether player has a Get Out of Jail Free card
 * @param {function} onResult - Callback with chosen action
 * @param {function} onClose - Callback to close the modal
 */
export default function JailTile({
  cityLevel,
  currentFunds,
  hasJailFreeCard = false,
  onResult,
  onClose
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const bailCost = JAIL_CONFIG.bailCost(cityLevel);
  const canAffordBail = currentFunds >= bailCost;
  
  /**
   * Handle escape choice
   */
  const handleChoice = (choice) => {
    setSelectedOption(choice);
    audioManager.playSFX('click');
    
    setTimeout(() => {
      let result = {};
      
      switch (choice) {
        case 'bail':
          result = {
            type: 'bail',
            fundsLost: bailCost,
            turnsSkipped: 0,
            message: 'Bail paid! You\'re free to go.',
          };
          audioManager.playSFX('success');
          break;
          
        case 'card':
          result = {
            type: 'card',
            fundsLost: 0,
            turnsSkipped: 0,
            cardUsed: true,
            message: 'Card used! You\'re free!',
          };
          audioManager.playSFX('success');
          break;
          
        case 'stay':
          result = {
            type: 'stay',
            fundsLost: 0,
            turnsSkipped: JAIL_CONFIG.turnsToSkip,
            rollsAllowed: JAIL_CONFIG.rollsAllowedInJail,
            message: `Stuck in jail for ${JAIL_CONFIG.turnsToSkip} turns. Roll doubles to escape!`,
          };
          audioManager.playSFX('error');
          break;
          
        default:
          break;
      }
      
      onResult(result);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 500);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-gray-500"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prison Bars Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0 w-1 bg-gray-600/30"
                style={{ left: `${(i + 1) * 11}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
          
          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <motion.div
              className="text-6xl mb-2"
              animate={!selectedOption ? { 
                x: [-5, 5, -5],
              } : {}}
              transition={{ duration: 0.5, repeat: !selectedOption ? Infinity : 0 }}
            >
              {JAIL_CONFIG.icon}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-300 mb-2">
              Caught!
            </h2>
            <p className="text-gray-400">{JAIL_CONFIG.description}</p>
          </div>
          
          {/* Options */}
          {!selectedOption && (
            <motion.div
              className="space-y-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Option 1: Pay Bail */}
              <button
                onClick={() => handleChoice('bail')}
                disabled={!canAffordBail}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all
                  ${canAffordBail 
                    ? 'border-green-500 bg-green-500/20 hover:bg-green-500/30 text-white' 
                    : 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-bold text-lg">💵 Pay Bail</div>
                    <div className="text-sm text-gray-400">Instant escape</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${canAffordBail ? 'text-green-400' : 'text-gray-600'}`}>
                      ${bailCost.toLocaleString()}
                    </div>
                    {!canAffordBail && (
                      <div className="text-xs text-red-400">Can't afford</div>
                    )}
                  </div>
                </div>
              </button>
              
              {/* Option 2: Use Card */}
              {hasJailFreeCard && (
                <button
                  onClick={() => handleChoice('card')}
                  className="w-full p-4 rounded-lg border-2 border-yellow-500 bg-yellow-500/20 hover:bg-yellow-500/30 text-white transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold text-lg">🎫 Use Card</div>
                      <div className="text-sm text-gray-400">Get Out of Jail Free</div>
                    </div>
                    <div className="text-3xl">🔑</div>
                  </div>
                </button>
              )}
              
              {/* Option 3: Stay in Jail */}
              <button
                onClick={() => handleChoice('stay')}
                className="w-full p-4 rounded-lg border-2 border-gray-600 bg-gray-700/20 hover:bg-gray-700/30 text-white transition-all"
              >
                <div className="text-left">
                  <div className="font-bold text-lg">⏳ Stay in Jail</div>
                  <div className="text-sm text-gray-400">
                    Skip {JAIL_CONFIG.turnsToSkip} turns (or roll doubles to escape)
                  </div>
                </div>
              </button>
              
              {/* Info Box */}
              <div className="bg-black/40 rounded-lg p-3 border border-gray-700 text-sm text-gray-400">
                <p>
                  💡 <strong>Tip:</strong> While in jail, you can attempt to roll doubles 
                  each turn to escape for free!
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Selected Option Feedback */}
          {selectedOption && (
            <motion.div
              className="text-center py-12 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                {selectedOption === 'bail' && '💵'}
                {selectedOption === 'card' && '🔑'}
                {selectedOption === 'stay' && '🔒'}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedOption === 'bail' && 'Bail Paid!'}
                {selectedOption === 'card' && 'Card Used!'}
                {selectedOption === 'stay' && 'Locked Up!'}
              </h3>
              <p className="text-gray-400">
                {selectedOption === 'bail' && 'You\'re free to go!'}
                {selectedOption === 'card' && 'You\'re free!'}
                {selectedOption === 'stay' && 'Doing time...'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
