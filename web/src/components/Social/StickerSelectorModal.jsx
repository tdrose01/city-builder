import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStickerStore } from '../../store/useStickerStore';
import { STICKER_SETS } from '../../data/stickers/stickerData';

const StickerSelectorModal = ({ isOpen, onClose, onSelect, friendName }) => {
  const owned = useStickerStore(state => state.owned);
  const getDuplicates = useStickerStore(state => state.getDuplicates);
  const duplicates = getDuplicates();

  if (!isOpen) return null;

  // Filter sets to only those that have duplicates
  const setsWithDuplicates = STICKER_SETS.map(set => ({
    ...set,
    duplicates: set.stickers.filter(s => duplicates[s.id] > 0)
  })).filter(set => set.duplicates.length > 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg h-[70vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Send Sticker
            </h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Gifting to {friendName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {setsWithDuplicates.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <span className="text-4xl mb-4">🃏</span>
              <p className="text-sm font-bold uppercase">No duplicates to send</p>
              <p className="text-[10px] max-w-[200px] mt-2">Open more packs to get extra stickers for trading!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {setsWithDuplicates.map(set => (
                <div key={set.id}>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">
                    {set.name}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {set.duplicates.map(sticker => (
                      <button
                        key={sticker.id}
                        onClick={() => onSelect(sticker)}
                        className="aspect-[3/4] bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:scale-105 transition-all group"
                      >
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600 rounded text-[8px] font-bold text-white">
                          +{duplicates[sticker.id]}
                        </div>
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                          {sticker.icon}
                        </div>
                        <span className="text-[9px] font-black text-white uppercase truncate w-full text-center">
                          {sticker.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/20 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
            Sending a sticker consumes 1 duplicate
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StickerSelectorModal;
