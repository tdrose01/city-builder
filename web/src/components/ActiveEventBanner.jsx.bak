import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '../store/useEventStore';

const ActiveEventBanner = () => {
  const activeEvents = useEventStore(state => state.getActiveEvents());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through events if multiple are active
  useEffect(() => {
    if (activeEvents.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeEvents.length]);

  if (activeEvents.length === 0) return null;

  const event = activeEvents[currentIndex] || activeEvents[0];

  // Calculate remaining time string
  const getRemainingTime = (endDate) => {
    const remaining = new Date(endDate) - new Date();
    if (remaining <= 0) return 'Ending now';
    
    const mins = Math.floor(remaining / 60000);
    if (mins < 60) return `${mins}m left`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h left`;
    
    return `${Math.floor(hours / 24)}d left`;
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-full max-w-md px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center justify-between shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg shadow-inner">
              {event.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">
                {event.type === 'flash' ? 'Flash Event' : 'Special Event'}
              </span>
              <span className="text-xs font-bold text-white leading-none">
                {event.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-tight mb-1">
               {event.shortDescription}
             </span>
             <span className="text-[9px] font-medium text-white/60">
               {getRemainingTime(event.endDate)}
             </span>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeEvents.length > 1 && (
        <div className="flex justify-center gap-1 mt-1">
          {activeEvents.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-white w-3' : 'bg-white/20'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveEventBanner;
