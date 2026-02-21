import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionStore, STREAK_MILESTONES } from '../../store/useMissionStore';

const MissionBoard = ({ cityThemeColor, onClaimReward }) => {
  const activeMissions = useMissionStore(state => state.activeMissions);
  const currentStreak = useMissionStore(state => state.currentStreak);
  const bonusChestClaimed = useMissionStore(state => state.bonusChestClaimed);
  const claimedStreakMilestones = useMissionStore(state => state.claimedStreakMilestones);
  const claimMissionReward = useMissionStore(state => state.claimMissionReward);
  const claimBonusChest = useMissionStore(state => state.claimBonusChest);
  const claimStreakReward = useMissionStore(state => state.claimStreakReward);

  const allCompleted = activeMissions.length > 0 && activeMissions.every(m => m.completed);

  const handleClaim = (missionId) => {
    const mission = claimMissionReward(missionId);
    if (mission) {
      onClaimReward(mission.reward);
    }
  };

  const handleClaimStreak = (milestone) => {
    const reward = claimStreakReward(milestone);
    if (reward) {
      onClaimReward(reward);
      alert(`Streak Milestone Reached! +${reward.amount} ${reward.type}!`);
    }
  };

  const handleClaimBonus = () => {
    const success = claimBonusChest();
    if (success) {
      onClaimReward({ type: 'dice', amount: 50 }); // Bonus Chest reward
      alert("Bonus Chest Claimed! +50 Dice and Streak Increased!");
    }
  };

  if (activeMissions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-6">
        <span className="text-4xl mb-4">💤</span>
        <p className="text-xs font-bold uppercase">No missions active</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-xl shadow-inner">
            🔥
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Current Streak</p>
            <p className="text-xl font-black text-white">{currentStreak} Days</p>
          </div>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="mb-8 overflow-x-auto pb-2 flex gap-3 custom-scrollbar">
        {STREAK_MILESTONES.map((ms) => {
          const isReached = currentStreak >= ms.day;
          const isClaimed = claimedStreakMilestones.includes(ms.day);
          
          return (
            <div 
              key={ms.day}
              onClick={() => isReached && !isClaimed && handleClaimStreak(ms.day)}
              className={`flex-shrink-0 w-24 p-3 rounded-xl border transition-all cursor-pointer ${
                isClaimed 
                  ? 'bg-green-500/10 border-green-500/30 opacity-60' 
                  : isReached 
                    ? 'bg-yellow-500/20 border-yellow-500/50 animate-pulse' 
                    : 'bg-black/30 border-white/5 opacity-40'
              }`}
            >
              <div className="text-[9px] font-black text-white/40 uppercase mb-2 text-center">
                Day {ms.day}
              </div>
              <div className="text-xl text-center mb-1">
                {ms.reward.type === 'dice' ? '🎲' : ms.reward.type === 'xp' ? '⭐' : '💰'}
              </div>
              <div className="text-[10px] font-bold text-white text-center">
                {ms.reward.amount ? `+${ms.reward.amount}` : '1 Pack'}
              </div>
              {isReached && !isClaimed && (
                <div className="mt-2 text-[8px] font-black text-yellow-400 text-center uppercase tracking-tighter">
                  Claim!
                </div>
              )}
              {isClaimed && (
                <div className="mt-2 text-[8px] font-black text-green-400 text-center uppercase">
                  Done
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Missions List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-6">
        {activeMissions.map((mission) => {
          const progressPercent = (mission.progress / mission.target) * 100;
          
          return (
            <div 
              key={mission.id} 
              className={`bg-white/5 border rounded-2xl p-4 transition-all ${
                mission.completed && !mission.claimed ? 'border-green-500/40' : 'border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-4">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em] mb-1">
                    {mission.type.replace('_', ' ')}
                  </p>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {mission.description}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-white/60">
                    {mission.progress.toLocaleString()} / {mission.target.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-blue-500"
                  style={{ backgroundColor: mission.completed ? '#22c55e' : cityThemeColor }}
                />
              </div>

              {/* Reward & Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs">
                    {mission.reward.type === 'dice' ? '🎲' : mission.reward.type === 'xp' ? '⭐' : '💰'}
                  </span>
                  <span className="text-[10px] font-black text-white/80">
                    +{mission.reward.amount || (mission.reward.packType ? '1 Pack' : '')}
                  </span>
                </div>
                
                <button
                  disabled={!mission.completed || mission.claimed}
                  onClick={() => handleClaim(mission.id)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                    mission.claimed 
                      ? 'bg-white/5 text-white/20' 
                      : mission.completed 
                        ? 'bg-green-600 text-white hover:bg-green-500' 
                        : 'bg-white/5 text-white/30'
                  }`}
                >
                  {mission.claimed ? 'Claimed' : mission.completed ? 'Claim' : 'In Progress'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Bonus Chest */}
      <div className={`mt-auto p-5 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between ${
        allCompleted && !bonusChestClaimed 
          ? 'bg-yellow-500/10 border-yellow-500/40' 
          : 'bg-black/20 border-white/5 grayscale opacity-50'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`text-3xl ${allCompleted && !bonusChestClaimed ? 'animate-bounce' : ''}`}>🎁</div>
          <div>
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Bonus Chest</h5>
            <p className="text-[8px] text-white/40 font-bold uppercase">Complete all 3 missions</p>
          </div>
        </div>
        
        <button
          disabled={!allCompleted || bonusChestClaimed}
          onClick={handleClaimBonus}
          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl ${
            allCompleted && !bonusChestClaimed
              ? 'bg-yellow-400 text-black hover:scale-105'
              : 'bg-white/5 text-white/20'
          }`}
        >
          {bonusChestClaimed ? 'Claimed' : 'Unlock'}
        </button>
      </div>
    </div>
  );
};

export default MissionBoard;
