import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '../store/useEventStore';
import SeasonPassView from './SeasonPassView';

const EventCenterModal = ({ 
  isOpen, 
  onClose, 
  onClaimReward, 
  onUpgradePremium, 
  cityThemeColor,
  // Classic Props
  eventProgress,
  milestones,
  milestoneRewardsClaimed,
  onClaimClassicReward,
  onClaimAllClassic,
  eventPrestigeLevel,
  getScaledReward
}) => {
  const [activeTab, setActiveTab] = useState('season');
  const activeSeason = useEventStore(state => state.getActiveSeason());
  const activeEvents = useEventStore(state => state.getActiveEvents());
  const activeCommunityEvents = useEventStore(state => state.getActiveCommunityEvents());
  const currencies = useEventStore(state => state.calendar.currencies);
  const purchaseItem = useEventStore(state => state.purchaseEventShopItem);
  const claimGlobalReward = useEventStore(state => state.claimGlobalMilestoneReward);
  const claimContributionReward = useEventStore(state => state.claimCommunityContributionReward);

  if (!isOpen) return null;

  const currency = activeSeason ? currencies[activeSeason.currencyId] || 0 : 0;
  const currencyIcon = activeSeason ? '🔶' : '🎟️'; // Default icons

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-black/20 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">
              Event Center
            </h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {activeSeason?.name || 'Seasonal Journey'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeSeason && (
              <div className="bg-black/40 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                <span className="text-sm">{currencyIcon}</span>
                <span className="text-sm font-bold text-white">{currency.toLocaleString()}</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-white/5 gap-6">
          {['season', 'classic', 'events', 'shop'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/50'
              }`}
            >
              {tab === 'classic' ? 'Classic' : tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: cityThemeColor }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'classic' && (
              <motion.div
                key="classic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {eventPrestigeLevel > 0 && (
                  <div className="flex items-center gap-2 mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <span className="text-lg">⭐</span>
                    <div>
                      <p className="text-[10px] font-bold text-yellow-500 uppercase">Prestige Level {eventPrestigeLevel}</p>
                      <p className="text-[9px] text-yellow-500/60">Milestone rewards are increased for this run.</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-white/40 uppercase block mb-1">Classic Progress</span>
                    <span className="text-xl font-black text-white">{eventProgress} / {milestones[milestones.length - 1].threshold}</span>
                  </div>
                  {milestones.some((m, idx) => eventProgress >= m.threshold && !milestoneRewardsClaimed[idx]) && (
                    <button
                      onClick={onClaimAllClassic}
                      className="px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-lg active:scale-95"
                      style={{ backgroundColor: cityThemeColor, color: '#000' }}
                    >
                      Claim All Available
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {milestones.map((milestone, index) => {
                    const scaledAmount = getScaledReward(milestone.reward.amount, eventPrestigeLevel);
                    const rewardText = milestone.reward.type === 'funds'
                      ? `$${scaledAmount.toLocaleString()}`
                      : milestone.reward.type === 'sticker_pack'
                        ? `${scaledAmount} Pack${scaledAmount > 1 ? 's' : ''}`
                        : `${scaledAmount} ${milestone.reward.type}`;

                    const isReached = eventProgress >= milestone.threshold;
                    const isClaimed = milestoneRewardsClaimed[index];

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div>
                          <p className={`text-[10px] font-bold uppercase ${isReached ? 'text-white/60' : 'text-white/20'}`}>
                            {milestone.threshold} Points
                          </p>
                          <p className={`text-xs font-bold ${isReached ? 'text-white' : 'text-white/40'}`}>
                            {rewardText}
                          </p>
                        </div>
                        <button
                          disabled={!isReached || isClaimed}
                          onClick={() => onClaimClassicReward(index)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isClaimed 
                              ? 'bg-green-500/20 text-green-500' 
                              : isReached 
                                ? 'bg-white text-black hover:scale-110' 
                                : 'bg-white/5 text-white/10'
                          }`}
                        >
                          {isClaimed ? '✓' : isReached ? '🎁' : '🔒'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {activeTab === 'season' && (
              <motion.div
                key="season"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SeasonPassView onClaimReward={onClaimReward} onUpgradePremium={onUpgradePremium} />
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Community Events */}
                {activeCommunityEvents.map(ce => (
                  <div key={ce.id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ce.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase">{ce.name}</h3>
                          <p className="text-[10px] text-white/40">{ce.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-yellow-500 uppercase">Community Goal</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span className="text-white/40">Global Progress</span>
                          <span className="text-white">
                            {((ce.globalGoal.currentValue / ce.globalGoal.targetValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(ce.globalGoal.currentValue / ce.globalGoal.targetValue) * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: ce.progressBarColor }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-white/40">
                          <span>{ce.globalGoal.currentValue.toLocaleString()}</span>
                          <span>{ce.globalGoal.targetValue.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Global Milestones */}
                      <div className="pt-2">
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Global Rewards</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {ce.globalGoal.milestones.map((m, idx) => (
                            <button
                              key={idx}
                              disabled={!m.reached || m.reward.claimed}
                              onClick={() => {
                                claimGlobalReward(ce.id, idx);
                                onClaimReward(m.reward);
                              }}
                              className={`flex-shrink-0 w-24 p-2 rounded-lg border transition-all ${
                                m.reward.claimed 
                                  ? 'bg-green-500/10 border-green-500/20 opacity-60' 
                                  : m.reached 
                                    ? 'bg-yellow-500/20 border-yellow-500/40 hover:scale-105' 
                                    : 'bg-white/5 border-white/5 opacity-40'
                              }`}
                            >
                              <div className="text-lg mb-1">{m.reward.icon}</div>
                              <p className="text-[8px] font-bold text-white uppercase truncate">{m.reward.name}</p>
                              <p className="text-[7px] text-white/40">{m.reached ? (m.reward.claimed ? 'Claimed' : 'Claim!') : 'Locked'}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Individual Contribution */}
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Your Contribution</p>
                          <p className="text-[9px] font-bold text-white">{ce.playerContribution.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {ce.contributionRewards.map((tier, idx) => (
                            <button
                              key={idx}
                              disabled={ce.playerContribution < tier.minContribution || tier.claimed}
                              onClick={() => {
                                claimContributionReward(ce.id, idx);
                                onClaimReward(tier.reward);
                              }}
                              className={`flex-1 p-2 rounded-lg border transition-all flex items-center gap-3 ${
                                tier.claimed 
                                  ? 'bg-green-500/10 border-green-500/20 opacity-60' 
                                  : ce.playerContribution >= tier.minContribution 
                                    ? 'bg-blue-500/20 border-blue-500/40 hover:scale-105' 
                                    : 'bg-white/5 border-white/5 opacity-40'
                              }`}
                            >
                              <div className="text-xl">{tier.reward.icon}</div>
                              <div className="text-left">
                                <p className="text-[8px] font-bold text-white uppercase">{tier.reward.name}</p>
                                <p className="text-[7px] text-white/40">
                                  {tier.claimed ? 'Unlocked' : ce.playerContribution >= tier.minContribution ? 'Click to Claim' : `Reach ${tier.minContribution.toLocaleString()}`}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Active Game Events */}
                {activeEvents.map(event => (
                  <div key={event.id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{event.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase">{event.name}</h3>
                        <p className="text-[10px] text-white/40">{event.description}</p>
                      </div>
                    </div>

                    {event.mechanics.challenges && (
                      <div className="space-y-3">
                        {event.mechanics.challenges.tasks.map(task => (
                          <div key={task.id} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <p className="text-[11px] font-bold text-white mb-1">{task.description}</p>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500" 
                                  style={{ width: `${(task.progress / task.target) * 100}%` }} 
                                />
                              </div>
                            </div>
                            <button 
                              disabled={!task.completed || task.reward.claimed}
                              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                                task.reward.claimed 
                                  ? 'bg-white/5 text-white/20' 
                                  : task.completed 
                                    ? 'bg-blue-600 text-white hover:bg-blue-500' 
                                    : 'bg-white/5 text-white/40'
                              }`}
                            >
                              {task.reward.claimed ? 'Claimed' : task.completed ? 'Claim' : `${task.progress}/${task.target}`}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {activeEvents.length === 0 && activeCommunityEvents.length === 0 && (
                  <div className="text-center py-12 opacity-30">
                    <p className="text-sm font-bold uppercase">No active events</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4 pb-8"
              >
                {activeEvents.flatMap(event => 
                  event.shopItems.map(item => {
                    const canAfford = (currencies[item.cost.currencyId] || 0) >= item.cost.amount;
                    const isOutOfStock = item.stock !== null && item.purchased >= item.stock;
                    
                    return (
                      <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/5 group hover:bg-white/[0.08] transition-all flex flex-col">
                        <div className="w-full aspect-square bg-black/20 rounded-lg flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform relative overflow-hidden">
                          {item.reward.icon}
                          {item.stock !== null && (
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-bold text-white/60">
                              {item.purchased}/{item.stock}
                            </div>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-white mb-1 uppercase truncate">{item.reward.name}</h3>
                        <p className="text-[9px] text-white/40 mb-4 leading-tight flex-1">{item.reward.description}</p>
                        
                        <button 
                          disabled={!canAfford || isOutOfStock}
                          onClick={() => {
                            const success = purchaseItem(event.id, item.id);
                            if (success) {
                              onClaimReward(item.reward);
                            }
                          }}
                          className={`w-full py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                            isOutOfStock
                              ? 'bg-white/5 text-white/20'
                              : canAfford 
                                ? 'bg-white text-black hover:bg-yellow-400' 
                                : 'bg-white/10 text-white/30'
                          }`}
                        >
                          {isOutOfStock ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <span>{currencyIcon}</span>
                              <span>{item.cost.amount}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}

                {activeEvents.every(e => e.shopItems.length === 0) && (
                  <div className="col-span-2 text-center py-12 opacity-30">
                    <p className="text-sm font-bold uppercase">No shop items available</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCenterModal;
