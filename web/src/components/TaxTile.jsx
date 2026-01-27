import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TAX_CONFIG } from '../config/tileTypes';
import audioManager from '../utils/audioManager';

/**
 * TaxTile Component
 * 
 * Deducts a percentage of player's current funds as tax.
 * Has min/max bounds to keep the penalty fair at all game stages.
 * 
 * @param {number} cityLevel - Current city level for max tax scaling
 * @param {number} currentFunds - Player's current funds
 * @param {boolean} hasTaxHavenPowerUp - Whether player has Tax Haven power-up active
 * @param {function} onResult - Callback with tax amount (negative)
 * @param {function} onClose - Callback to close the modal
 */
export default function TaxTile({ 
  cityLevel, 
  currentFunds,
  hasTaxHavenPowerUp = false,
  onResult, 
  onClose 
}) {
  const [stage, setStage] = useState('calculating'); // calculating, result
  const [taxAmount, setTaxAmount] = useState(0);
  
  useEffect(() => {
    // Calculate tax amount
    const calculateTax = () => {
      if (hasTaxHavenPowerUp) {
        return 0; // Power-up blocks tax
      }
      
      const calculatedTax = Math.floor(currentFunds * TAX_CONFIG.taxRate);
      const maxTax = TAX_CONFIG.maxTax(cityLevel);
      
      // Apply min/max bounds
      const boundedTax = Math.max(
        TAX_CONFIG.minTax,
        Math.min(calculatedTax, maxTax)
      );
      
      return boundedTax;
    };
    
    setTimeout(() => {
      const tax = calculateTax();
      setTaxAmount(tax);
      setStage('result');
      
      // Play sound
      if (tax > 0) {
        audioManager.playSFX('error');
      } else {
        audioManager.playSFX('success');
      }
      
      // Report result (negative value)
      onResult(-tax);
    }, 1500);
  }, [cityLevel, currentFunds, hasTaxHavenPowerUp, onResult]);
  
  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };
  
  const maxTax = TAX_CONFIG.maxTax(cityLevel);
  
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
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-red-500/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="text-6xl mb-2"
              animate={stage === 'calculating' ? { 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 1, repeat: stage === 'calculating' ? Infinity : 0 }}
            >
              {TAX_CONFIG.icon}
            </motion.div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">
              Tax Collection
            </h2>
            <p className="text-gray-400">{TAX_CONFIG.description}</p>
          </div>
          
          {/* Calculating Stage */}
          {stage === 'calculating' && (
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                📋
              </motion.div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Calculating your taxes...
              </h3>
              <p className="text-gray-500">Please wait</p>
            </motion.div>
          )}
          
          {/* Result Stage */}
          {stage === 'result' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {hasTaxHavenPowerUp ? (
                // Tax Haven Power-Up Active
                <div className="text-center p-6 rounded-lg border-2 border-green-500 bg-green-500/20">
                  <div className="text-5xl mb-4">🛡️</div>
                  <h2 className="text-3xl font-bold text-green-400 mb-4">
                    Tax Avoided!
                  </h2>
                  <p className="text-gray-300 mb-2">
                    Your Tax Haven power-up protected you!
                  </p>
                  <div className="text-xl text-green-400">
                    Saved: ${taxAmount.toLocaleString()}
                  </div>
                </div>
              ) : (
                // Tax Collected
                <>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/30 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Funds:</span>
                      <span className="text-white">${currentFunds.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax Rate:</span>
                      <span className="text-red-400">{(TAX_CONFIG.taxRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Min Tax:</span>
                      <span className="text-gray-500">${TAX_CONFIG.minTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Tax:</span>
                      <span className="text-gray-500">${maxTax.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 rounded-lg border-2 border-red-500 bg-red-500/20">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">
                      Tax Collected
                    </h2>
                    <div className="text-5xl font-bold text-red-400">
                      -${taxAmount.toLocaleString()}
                    </div>
                    <p className="text-gray-400 mt-4">
                      Remaining: ${(currentFunds - taxAmount).toLocaleString()}
                    </p>
                  </div>
                  
                  {taxAmount >= maxTax && (
                    <div className="text-center text-sm text-yellow-400">
                      ⚠️ Maximum tax cap reached
                    </div>
                  )}
                </>
              )}
              
              <button
                onClick={handleClose}
                className="w-full py-4 px-6 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-lg transition-colors"
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
