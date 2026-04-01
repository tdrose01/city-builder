import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStickerStore } from '../store/useStickerStore';
import { generatePack } from '../utils/stickerPackEngine';

const StickerPackOpener = ({ type, count = 3, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [stickers, setStickers] = useState([]);
  const addStickers = useStickerStore(state => state.addStickers);

  useEffect(() => {
    // Generate pack content on mount
    const newStickers = generatePack(type, count);
    setStickers(newStickers);
  }, [type, count]);

  const handleOpenPack = () => {
    setIsOpen(true);
    setRevealedIndex(0);
  };

  const handleNextSticker = () => {
    if (revealedIndex < stickers.length - 1) {
      setRevealedIndex(prev => prev + 1);
    } else {
      // Finished opening
      addStickers(stickers.map(s => s.id));
      onComplete();
    }
  };

  const packColors = {
    green: 'from-green-500 to-green-700',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed-pack"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className={`w-64 h-96 rounded-2xl bg-gradient-to-br ${packColors[type]} p-1 shadow-2xl cursor-pointer group`}
            onClick={handleOpenPack}
          >
            <div className="w-full h-full bg-black/20 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-6">
              <div className="text-6xl group-hover:scale-110 transition-transform">🎁</div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                  {type} Pack
                </h2>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">
                  Tap to Open
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealing"
            className="w-full h-full flex flex-col items-center justify-center p-4"
            onClick={handleNextSticker}
          >
            <AnimatePresence mode="wait">
              {stickers[revealedIndex] && (
                <motion.div
                  key={stickers[revealedIndex].id}
                  initial={{ y: 50, opacity: 0, rotateY: 90 }}
                  animate={{ y: 0, opacity: 1, rotateY: 0 }}
                  exit={{ y: -50, opacity: 0, rotateY: -90 }}
                  className="w-72 h-96 bg-[#1a1a1a] border-2 border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                  style={{ 
                    borderColor: stickers[revealedIndex].rarity >= 4 ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    boxShadow: stickers[revealedIndex].rarity >= 4 ? '0 0 50px rgba(251, 191, 36, 0.2)' : 'none'
                  }}
                >
                  <div className="text-right w-full">
                    <span className="text-xs font-black text-white/20 uppercase tracking-widest">
                      {stickers[revealedIndex].setId.split('-')[1]}
                    </span>
                  </div>

                  <div className="text-7xl mb-4">{stickers[revealedIndex].icon}</div>

                  <div className="text-center w-full">
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < stickers[revealedIndex].rarity ? 'text-yellow-400' : 'text-white/10'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                      {stickers[revealedIndex].name}
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold mt-1">
                      {stickers[revealedIndex].description}
                    </p>
                  </div>

                  <div className="w-full text-center text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4">
                    {revealedIndex + 1} / {stickers.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-xs font-bold text-white/40 uppercase tracking-widest"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StickerPackOpener;
