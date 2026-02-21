import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStickerStore } from '../../store/useStickerStore';
import { STICKER_SETS } from '../../data/stickers/stickerData';

const StickerAlbumModal = ({ isOpen, onClose, cityThemeColor, onClaimReward, onOpenVaultPack }) => {
  const [activeSetId, setActiveSetId] = useState('vault'); // Default to Vault if helpful, or STICKER_SETS[0].id
  const owned = useStickerStore(state => state.owned);
  const completedSetIds = useStickerStore(state => state.completedSetIds);
  const getProgress = useStickerStore(state => state.getProgress);
  const isSetComplete = useStickerStore(state => state.isSetComplete);
  const claimSetReward = useStickerStore(state => state.claimSetReward);
  const starPower = useStickerStore(state => state.starPower);
  const convertDuplicates = useStickerStore(state => state.convertDuplicates);
  const purchaseVaultPack = useStickerStore(state => state.purchaseVaultPack);
  const getDuplicates = useStickerStore(state => state.getDuplicates);

  const duplicates = getDuplicates();
  const hasDuplicates = Object.keys(duplicates).length > 0;

  if (!isOpen) return null;

  const activeSet = STICKER_SETS.find(s => s.id === activeSetId);
  const progress = activeSetId !== 'vault' ? getProgress(activeSetId) : null;
  const isComplete = activeSetId !== 'vault' ? isSetComplete(activeSetId) : false;
  const isClaimed = activeSetId !== 'vault' ? completedSetIds.includes(activeSetId) : false;

  const handlePurchaseVault = (type) => {
    const success = purchaseVaultPack(type);
    if (success) {
      onOpenVaultPack(type);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-4xl h-[85vh] flex overflow-hidden shadow-2xl"
      >
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black/20 border-r border-white/5 flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Album</h2>
            <div className="mt-4 bg-white/5 rounded-xl p-3 border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase block">Star Power</span>
              <span className="text-lg font-black text-yellow-500">✨ {starPower.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
            {/* The Vault Tab */}
            <button
              onClick={() => setActiveSetId('vault')}
              className={`w-full p-4 rounded-2xl text-left transition-all relative group mb-4 ${
                activeSetId === 'vault' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/20 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  activeSetId === 'vault' ? 'text-yellow-500' : 'text-white/30'
                }`}>
                  ✨ The Vault
                </span>
                <span className="text-xs">🏆</span>
              </div>
            </button>

            {STICKER_SETS.map(set => {
              const setProgress = getProgress(set.id);
              const setComplete = setProgress.current === setProgress.total;
              
              return (
                <button
                  key={set.id}
                  onClick={() => setActiveSetId(set.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all relative group ${
                    activeSetId === set.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      activeSetId === set.id ? 'text-white' : 'text-white/30'
                    }`}>
                      {set.name}
                    </span>
                    {setComplete && <span className="text-xs">✅</span>}
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500" 
                      style={{ 
                        width: `${(setProgress.current / setProgress.total) * 100}%`,
                        backgroundColor: activeSetId === set.id ? cityThemeColor : 'rgba(255,255,255,0.2)'
                      }} 
                    />
                  </div>
                  <span className="text-[9px] font-bold text-white/20 mt-1 block">
                    {setProgress.current} / {setProgress.total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Duplicate Conversion */}
          {hasDuplicates && (
            <div className="p-6 pt-0">
              <button 
                onClick={convertDuplicates}
                className="w-full py-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase hover:bg-blue-600/20 hover:text-blue-300 transition-all flex flex-col items-center gap-1 shadow-lg shadow-blue-500/5"
              >
                <span>Convert Duplicates</span>
                <span className="text-[8px] opacity-60">Collect Star Power</span>
              </button>
            </div>
          )}

          <button 
            onClick={onClose}
            className="m-6 mt-0 py-3 rounded-xl bg-white/5 text-white/40 font-black text-[10px] uppercase hover:bg-white/10 hover:text-white transition-all"
          >
            Close Album
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-transparent to-black/30">
          <AnimatePresence mode="wait">
            {activeSetId === 'vault' ? (
              <motion.div
                key="vault-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col p-8"
              >
                <div className="mb-12">
                  <h3 className="text-4xl font-black text-yellow-500 uppercase tracking-tighter italic leading-none mb-4">
                    The Vault
                  </h3>
                  <p className="text-sm text-white/40 font-bold uppercase tracking-widest max-w-md">
                    Exchange your duplicate Star Power for guaranteed high-rarity stickers.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 flex-1 items-start">
                  {/* Rare Vault Pack */}
                  <div className="bg-gradient-to-b from-blue-600/20 to-transparent border border-blue-500/20 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-blue-600/30 transition-all">
                    <div className="text-7xl mb-6 group-hover:scale-110 transition-transform drop-shadow-2xl">💎</div>
                    <h4 className="text-xl font-black text-white uppercase italic mb-2">Rare Vault Pack</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-8">Guaranteed 3-star or higher</p>
                    
                    <button 
                      onClick={() => handlePurchaseVault('blue')}
                      disabled={starPower < 100}
                      className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                        starPower >= 100 
                          ? 'bg-white text-black hover:bg-blue-400 hover:scale-105' 
                          : 'bg-white/5 text-white/20'
                      }`}
                    >
                      {starPower >= 100 ? '✨ 100 POWER' : 'LOCKED'}
                    </button>
                  </div>

                  {/* Legendary Vault Pack */}
                  <div className="bg-gradient-to-b from-purple-600/20 to-transparent border border-purple-500/20 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-purple-600/30 transition-all">
                    <div className="text-7xl mb-6 group-hover:scale-110 transition-transform drop-shadow-2xl">👑</div>
                    <h4 className="text-xl font-black text-white uppercase italic mb-2">Legendary Pack</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-8">Guaranteed 4-star or higher</p>
                    
                    <button 
                      onClick={() => handlePurchaseVault('purple')}
                      disabled={starPower < 500}
                      className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                        starPower >= 500 
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105' 
                          : 'bg-white/5 text-white/20'
                      }`}
                    >
                      {starPower >= 500 ? '✨ 500 POWER' : 'LOCKED'}
                    </button>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Your Total Power</p>
                      <p className="text-xl font-black text-white">{starPower.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest max-w-[200px] text-right leading-tight">
                    Star power is earned by converting duplicate stickers.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="set-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="p-8 flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">
                      {activeSet.name}
                    </h3>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
                      {activeSet.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-white/30 uppercase block mb-2">Set Reward</span>
                    <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      isComplete ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-black/20 border-white/5 opacity-50'
                    }`}>
                      <div className="text-2xl">
                        {activeSet.reward.type === 'dice' ? '🎲' : activeSet.reward.type === 'funds' ? '💰' : '🏢'}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-white uppercase leading-none mb-1">
                          {activeSet.reward.amount?.toLocaleString() || 'Exclusive'} {activeSet.reward.type}
                        </p>
                        <button
                          disabled={!isComplete || isClaimed}
                          onClick={() => {
                            claimSetReward(activeSet.id);
                            onClaimReward(activeSet.reward);
                          }}
                          className={`text-[9px] font-black uppercase px-3 py-1 rounded-md transition-all ${
                            isClaimed 
                              ? 'bg-green-500 text-white cursor-default'
                              : isComplete 
                                ? 'bg-white text-black hover:scale-105' 
                                : 'text-white/20'
                          }`}
                        >
                          {isClaimed ? 'Claimed ✓' : isComplete ? 'Claim Now!' : 'Locked'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticker Grid */}
                <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-3 gap-6 custom-scrollbar">
                  {activeSet.stickers.map(sticker => {
                    const count = owned[sticker.id] || 0;
                    const isOwned = count > 0;
                    
                    return (
                      <motion.div
                        key={sticker.id}
                        whileHover={isOwned ? { scale: 1.02, y: -5 } : {}}
                        className={`aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative transition-all ${
                          isOwned 
                            ? 'bg-white/5 border-white/10 shadow-xl' 
                            : 'bg-black/40 border-white/5 border-dashed grayscale'
                        }`}
                        style={isOwned && sticker.rarity >= 4 ? { borderColor: '#fbbf24', boxShadow: '0 10px 30px rgba(251, 191, 36, 0.1)' } : {}}
                      >
                        {/* Duplicate Badge */}
                        {count > 1 && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-[#1a1a1a]">
                            +{count - 1}
                          </div>
                        )}

                        <div className={`text-6xl mb-4 transition-all ${isOwned ? 'opacity-100' : 'opacity-10'}`}>
                          {sticker.icon}
                        </div>

                        <div className="text-center w-full">
                          <div className="flex justify-center gap-0.5 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-[8px] ${i < sticker.rarity ? (isOwned ? 'text-yellow-400' : 'text-white/20') : 'text-transparent'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <h4 className={`text-xs font-black uppercase truncate ${isOwned ? 'text-white' : 'text-white/10'}`}>
                            {isOwned ? sticker.name : '???'}
                          </h4>
                        </div>

                        {/* Rarity Glow */}
                        {isOwned && sticker.rarity >= 4 && (
                          <div className="absolute inset-0 bg-yellow-400/5 rounded-2xl pointer-events-none" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default StickerAlbumModal;
