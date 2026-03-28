import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '../store/useEventStore';
import { PassTier } from '../data/events/eventTypes';

// Safe render helper - prevents "Objects are not valid as a React child" errors
const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    if (value.name && typeof value.name === 'string') return value.name;
    if (value.icon && typeof value.icon === 'string') return value.icon;
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export default function SeasonPassView({ onClaimReward, onUpgradePremium }) {
  const activeSeason = useEventStore(state => state.getActiveSeason());
  const claimReward = useEventStore(state => state.claimSeasonPassReward);
  const upgradeToPremium = useEventStore(state => state.upgradeToPremiumPass);

  if (!activeSeason) return <div className="p-4 text-center opacity-50">No active season found.</div>;

  const { pass, theme, name, endDate } = activeSeason;
  const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleClaim = (level, tier) => {
    const levelData = pass.levels.find(l => l.level === level);
    const reward = tier === 'free' ? levelData.freeReward : levelData.premiumReward;
    
    // Call store action
    claimReward(level, tier);
    
    // Notify parent for actual gameplay effect (funds/dice)
    if (onClaimReward && reward) {
      onClaimReward(reward);
    }
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    if (onUpgradePremium) onUpgradePremium();
  };

  return (
    <div className="season-pass-view flex flex-col h-full overflow-hidden text-white">
      {/* Header */}
      <div className="p-4 bg-black/40 rounded-xl mb-4 border border-white/10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">☀️</span> {safeRender(name, 'Season')}
            </h2>
            <p className="text-xs text-white/60">Season ends in {daysLeft} days</p>
          </div>
          {pass.tier === 'free' && (
            <button 
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              UPGRADE TO PREMIUM
            </button>
          )}
          {pass.tier === 'premium' && (
            <div className="bg-amber-400/20 border border-amber-400/50 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full">
              PREMIUM PASS ACTIVE
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span>XP: {pass.currentXP.toLocaleString()}</span>
            <span className="text-amber-400">Next Reward at {(Math.ceil(pass.currentXP / 1000) * 1000).toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (pass.currentXP % 1000) / 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {pass.levels.map((lvl) => {
          const isUnlocked = pass.currentXP >= lvl.xpRequired;
          
          return (
            <div key={lvl.level} className={`relative flex items-center gap-3 p-3 rounded-xl border ${isUnlocked ? 'bg-white/5 border-white/20' : 'bg-white/2 border-white/5 opacity-80'}`}>
              {/* Level Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isUnlocked ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>
                {lvl.level}
              </div>

              {/* Rewards */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {/* Free Reward */}
                <div className={`p-2 rounded-lg ${lvl.freeReward ? 'bg-black/30 border border-white/5' : 'bg-transparent border border-dashed border-white/10 flex items-center justify-center'}`}>
                  {lvl.freeReward ? (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{safeRender(lvl.freeReward.icon, '🎁')}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold truncate leading-tight">{safeRender(lvl.freeReward.name, 'Reward')}</p>
                          <p className="text-[8px] text-white/50 uppercase tracking-wider">Free</p>
                        </div>
                      </div>
                      <button 
                        disabled={!isUnlocked || lvl.claimed.free}
                        onClick={() => handleClaim(lvl.level, 'free')}
                        className={`mt-auto text-[9px] font-bold py-1 rounded transition-colors ${lvl.claimed.free ? 'bg-green-500/20 text-green-500' : isUnlocked ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/5 text-white/20'}`}
                      >
                        {lvl.claimed.free ? 'CLAIMED' : 'CLAIM'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[9px] text-white/20">NO REWARD</span>
                  )}
                </div>

                {/* Premium Reward */}
                <div className={`p-2 rounded-lg bg-amber-400/5 border border-amber-400/20`}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{safeRender(lvl.premiumReward?.icon, '⭐')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate leading-tight text-amber-200">{safeRender(lvl.premiumReward?.name, 'Premium Reward')}</p>
                        <p className="text-[8px] text-amber-400/70 uppercase tracking-wider">Premium</p>
                      </div>
                    </div>
                    <button 
                      disabled={!isUnlocked || lvl.claimed.premium || pass.tier !== 'premium'}
                      onClick={() => handleClaim(lvl.level, 'premium')}
                      className={`mt-auto text-[9px] font-bold py-1 rounded transition-colors ${lvl.claimed.premium ? 'bg-green-500/20 text-green-500' : (isUnlocked && pass.tier === 'premium') ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-white/5 text-white/20'}`}
                    >
                      {lvl.claimed.premium ? 'CLAIMED' : pass.tier !== 'premium' ? 'LOCKED' : 'CLAIM'}
                    </button>
                  </div>
                </div>
              </div>

              {!isUnlocked && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">
                  {lvl.xpRequired.toLocaleString()} XP
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
