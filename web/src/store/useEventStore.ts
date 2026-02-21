import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_SEASON } from '../data/events/seasonData';
import { Season, SeasonPass, PassTier } from '../data/events/seasonModel';
import { EventCalendarState } from '../data/events/calendarModel';
import { GameEvent, EventModifier, TileOverride } from '../data/events/eventModel';
import { CommunityEvent } from '../data/events/communityEventModel';

interface EventStoreState {
  calendar: EventCalendarState;
  
  // Season Actions
  initializeSeason: (seasonId: string) => void;
  advanceSeasonPass: (xpGained: number) => { leveledUp: boolean, newLevel: number } | null;
  claimSeasonPassReward: (level: number, tier: PassTier) => void;
  upgradeToPremiumPass: () => void;
  
  // Event Actions
  addEvent: (event: GameEvent) => void;
  getActiveEvents: () => GameEvent[];
  getActiveModifiers: () => EventModifier[];
  getActiveTileOverrides: () => TileOverride[];
  updateChallengeProgress: (type: string, amount: number) => void;
  collectEventItem: (eventId: string, itemId: string, amount: number) => void;
  claimEventReward: (eventId: string, rewardId: string) => void;
  tickEvents: () => { id: string, name: string, type: 'start' | 'end' }[];
  earnEventCurrency: (amount: number) => void;
  purchaseEventShopItem: (eventId: string, itemId: string) => boolean;
  
  // Community Event Actions
  addCommunityEvent: (event: CommunityEvent) => void;
  contributeToCommunityEvent: (eventId: string, amount: number) => void;
  claimCommunityContributionReward: (eventId: string, tierIndex: number) => void;
  claimGlobalMilestoneReward: (eventId: string, milestoneIndex: number) => void;
  simulateCommunityProgress: () => void;
  
  // Helpers
  getActiveSeason: () => Season | null;
  getActiveCommunityEvents: () => CommunityEvent[];
}

export const useEventStore = create<EventStoreState>()(
  persist(
    (set, get) => ({
      calendar: {
        activeSeasonId: INITIAL_SEASON.id,
        events: {},
        communityEvents: {},
        seasons: {
          [INITIAL_SEASON.id]: INITIAL_SEASON
        },
        currencies: {
          [INITIAL_SEASON.currencyId]: 0
        },
        completedEventIds: [],
        completedSeasonIds: [],
        lastViewedAt: null,
        dismissedNotifications: [],
        notificationsEnabled: true,
      },

      initializeSeason: (seasonId: string) => {
        if (seasonId === INITIAL_SEASON.id) {
          set((state) => ({
            calendar: {
              ...state.calendar,
              activeSeasonId: seasonId,
              seasons: {
                ...state.calendar.seasons,
                [seasonId]: INITIAL_SEASON
              }
            }
          }));
        }
      },

      getActiveSeason: () => {
        const { activeSeasonId, seasons } = get().calendar;
        if (!activeSeasonId) return null;
        return seasons[activeSeasonId] || null;
      },

      addEvent: (event: GameEvent) => {
        set((state) => ({
          calendar: {
            ...state.calendar,
            events: {
              ...state.calendar.events,
              [event.id]: event
            }
          }
        }));
      },

      getActiveEvents: () => {
        const now = new Date();
        return Object.values(get().calendar.events).filter(event => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          return now >= start && now <= end;
        });
      },

      getActiveModifiers: () => {
        const activeEvents = get().getActiveEvents();
        return activeEvents.flatMap(event => event.modifiers);
      },

      getActiveTileOverrides: () => {
        const activeEvents = get().getActiveEvents();
        return activeEvents.flatMap(event => event.tileOverrides);
      },

      updateChallengeProgress: (type: string, amount: number) => {
        const activeEvents = get().getActiveEvents();
        let changed = false;
        const updatedEvents = { ...get().calendar.events };

        activeEvents.forEach(event => {
          if (event.mechanics.challenges) {
            event.mechanics.challenges.tasks.forEach(task => {
              if (task.type === type && !task.completed) {
                task.progress += amount;
                if (task.progress >= task.target) {
                  task.progress = task.target;
                  task.completed = true;
                }
                changed = true;
              }
            });
          }
        });

        if (changed) {
          set((state) => ({
            calendar: {
              ...state.calendar,
              events: updatedEvents
            }
          }));
        }
      },

      collectEventItem: (eventId: string, itemId: string, amount: number) => {
        set((state) => {
          const event = state.calendar.events[eventId];
          if (!event || !event.mechanics.collectibles) return state;

          const updatedEvents = { ...state.calendar.events };
          const updatedEvent = { ...event };
          const updatedCollectibles = { ...updatedEvent.mechanics.collectibles };
          const updatedCollected = { ...updatedCollectibles.collected };

          updatedCollected[itemId] = (updatedCollected[itemId] || 0) + amount;
          updatedCollectibles.collected = updatedCollected;
          updatedEvent.mechanics.collectibles = updatedCollectibles;
          updatedEvents[eventId] = updatedEvent;

          return {
            calendar: {
              ...state.calendar,
              events: updatedEvents
            }
          };
        });
      },

      claimEventReward: (eventId: string, rewardId: string) => {
        set((state) => {
          const event = state.calendar.events[eventId];
          if (!event) return state;

          const updatedEvents = { ...state.calendar.events };
          const updatedEvent = { ...event };
          
          // Check challenges
          if (updatedEvent.mechanics.challenges) {
            const task = updatedEvent.mechanics.challenges.tasks.find(t => t.reward.id === rewardId);
            if (task && task.completed && !task.reward.claimed) {
              task.reward.claimed = true;
              task.reward.claimedAt = new Date().toISOString();
              console.log(`Claimed event reward: ${task.reward.name}`);
            }
          }

          // Check milestone rewards
          const milestone = updatedEvent.milestoneRewards.find(m => m.reward.id === rewardId);
          if (milestone && milestone.reached && !milestone.reward.claimed) {
            milestone.reward.claimed = true;
            milestone.reward.claimedAt = new Date().toISOString();
            console.log(`Claimed event milestone reward: ${milestone.reward.name}`);
          }

          updatedEvents[eventId] = updatedEvent;
          return {
            calendar: {
              ...state.calendar,
              events: updatedEvents
            }
          };
        });
      },

      tickEvents: () => {
        const now = new Date();
        const { events } = get().calendar;
        let changed = false;
        const updatedEvents = { ...events };
        const transitions: { id: string, name: string, type: 'start' | 'end' }[] = [];

        Object.values(events).forEach(event => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          let newLifecycle = event.lifecycle;

          if (now < start) {
            newLifecycle = 'upcoming';
          } else if (now >= start && now <= end) {
            newLifecycle = 'active';
            if (event.lifecycle === 'upcoming') {
              transitions.push({ id: event.id, name: event.name, type: 'start' });
            }
          } else if (now > end) {
            newLifecycle = 'completed';
            if (event.lifecycle === 'active') {
              transitions.push({ id: event.id, name: event.name, type: 'end' });
            }
          }

          if (newLifecycle !== event.lifecycle) {
            updatedEvents[event.id] = { ...event, lifecycle: newLifecycle };
            changed = true;
          }
        });

        if (changed) {
          set((state) => ({
            calendar: {
              ...state.calendar,
              events: updatedEvents
            }
          }));
        }

        return transitions;
      },

      earnEventCurrency: (amount: number) => {
        const activeSeason = get().getActiveSeason();
        if (!activeSeason) return;

        set((state) => {
          const currentBalance = state.calendar.currencies[activeSeason.currencyId] || 0;
          const updatedSeason = { ...activeSeason };
          updatedSeason.currencyEarned += amount;

          return {
            calendar: {
              ...state.calendar,
              currencies: {
                ...state.calendar.currencies,
                [activeSeason.currencyId]: currentBalance + amount
              },
              seasons: {
                ...state.calendar.seasons,
                [activeSeason.id]: updatedSeason
              }
            }
          };
        });
      },

      purchaseEventShopItem: (eventId: string, itemId: string) => {
        // ... (keep existing implementation)
        const event = get().calendar.events[eventId];
        if (!event) return false;

        const shopItem = event.shopItems.find(item => item.id === itemId);
        if (!shopItem) return false;

        const { currencies } = get().calendar;
        const currentBalance = currencies[shopItem.cost.currencyId] || 0;

        if (currentBalance >= shopItem.cost.amount && (shopItem.stock === null || shopItem.purchased < shopItem.stock)) {
          set((state) => {
            const updatedEvents = { ...state.calendar.events };
            const updatedEvent = { ...event };
            const itemToUpdate = updatedEvent.shopItems.find(item => item.id === itemId);
            if (itemToUpdate) itemToUpdate.purchased += 1;
            
            updatedEvents[eventId] = updatedEvent;

            return {
              calendar: {
                ...state.calendar,
                currencies: {
                  ...state.calendar.currencies,
                  [shopItem.cost.currencyId]: currentBalance - shopItem.cost.amount
                },
                events: updatedEvents
              }
            };
          });
          return true;
        }
        return false;
      },

      addCommunityEvent: (event: CommunityEvent) => {
        set((state) => ({
          calendar: {
            ...state.calendar,
            communityEvents: {
              ...state.calendar.communityEvents,
              [event.id]: event
            }
          }
        }));
      },

      getActiveCommunityEvents: () => {
        const now = new Date();
        return Object.values(get().calendar.communityEvents).filter(event => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          return now >= start && now <= end;
        });
      },

      contributeToCommunityEvent: (eventId: string, amount: number) => {
        set((state) => {
          const event = state.calendar.communityEvents[eventId];
          if (!event) return state;

          const updatedEvents = { ...state.calendar.communityEvents };
          const updatedEvent = { ...event };
          
          updatedEvent.playerContribution += amount;
          updatedEvent.globalGoal.currentValue += amount;

          // Check individual tiers
          updatedEvent.contributionRewards.forEach(tier => {
            if (!tier.claimed && updatedEvent.playerContribution >= tier.minContribution) {
              // Mark as ready to claim or auto-grant
              console.log(`Player reached contribution tier: ${tier.minContribution}`);
            }
          });

          updatedEvents[eventId] = updatedEvent;
          return {
            calendar: {
              ...state.calendar,
              communityEvents: updatedEvents
            }
          };
        });
      },

      claimCommunityContributionReward: (eventId: string, tierIndex: number) => {
        set((state) => {
          const event = state.calendar.communityEvents[eventId];
          if (!event) return state;

          const updatedEvents = { ...state.calendar.communityEvents };
          const updatedEvent = { ...event };
          const tier = updatedEvent.contributionRewards[tierIndex];

          if (tier && !tier.claimed && updatedEvent.playerContribution >= tier.minContribution) {
            tier.claimed = true;
            console.log(`Claimed community contribution reward: ${tier.reward.name}`);
          }

          updatedEvents[eventId] = updatedEvent;
          return {
            calendar: {
              ...state.calendar,
              communityEvents: updatedEvents
            }
          };
        });
      },

      claimGlobalMilestoneReward: (eventId: string, milestoneIndex: number) => {
        set((state) => {
          const event = state.calendar.communityEvents[eventId];
          if (!event) return state;

          const updatedEvents = { ...state.calendar.communityEvents };
          const updatedEvent = { ...event };
          const milestone = updatedEvent.globalGoal.milestones[milestoneIndex];

          if (milestone && milestone.reached && !milestone.reward.claimed) {
            milestone.reward.claimed = true;
            milestone.reward.claimedAt = new Date().toISOString();
            console.log(`Claimed global community reward: ${milestone.reward.name}`);
          }

          updatedEvents[eventId] = updatedEvent;
          return {
            calendar: {
              ...state.calendar,
              communityEvents: updatedEvents
            }
          };
        });
      },

      simulateCommunityProgress: () => {
        const activeEvents = get().getActiveCommunityEvents();
        if (activeEvents.length === 0) return;

        set((state) => {
          const updatedEvents = { ...state.calendar.communityEvents };
          let changed = false;

          activeEvents.forEach(event => {
            const updatedEvent = { ...event };
            
            // Simulate 500-2000 other "players" per tick based on goal magnitude
            const baseRate = updatedEvent.globalGoal.targetValue / 100000; 
            const jitter = 0.8 + Math.random() * 0.4; // 80% to 120% variation
            const simulationGain = Math.floor(baseRate * jitter);
            
            updatedEvent.globalGoal.currentValue += simulationGain;

            // Check global milestones
            updatedEvent.globalGoal.milestones.forEach(m => {
              if (!m.reached && updatedEvent.globalGoal.currentValue >= m.threshold) {
                m.reached = true;
                m.reachedAt = new Date().toISOString();
                
                // Phase 12: Auto-grant Global Buffs
                if (m.reward.type === 'multiplier') {
                   // This would be added to the game's active modifiers list
                   console.log(`GLOBAL BUFF ACTIVATED: ${m.reward.name}`);
                }
              }
            });

            updatedEvents[event.id] = updatedEvent;
            changed = true;
          });

          return changed ? {
            calendar: {
              ...state.calendar,
              communityEvents: updatedEvents
            }
          } : state;
        });
      },

      advanceSeasonPass: (xpGained: number) => {
        const activeSeason = get().getActiveSeason();
        if (!activeSeason) return null;

        const updatedSeason = { ...activeSeason };
        const pass = updatedSeason.pass;
        
        const oldLevel = Math.floor(pass.currentXP / 1000);
        pass.currentXP += xpGained;
        const newLevel = Math.floor(pass.currentXP / 1000);
        
        set((state) => ({
          calendar: {
            ...state.calendar,
            seasons: {
              ...state.calendar.seasons,
              [activeSeason.id]: updatedSeason
            }
          }
        }));

        return {
          leveledUp: newLevel > oldLevel,
          newLevel
        };
      },

      claimSeasonPassReward: (level: number, tier: PassTier) => {
        const activeSeason = get().getActiveSeason();
        if (!activeSeason) return;

        const updatedSeason = { ...activeSeason };
        const levelData = updatedSeason.pass.levels.find(l => l.level === level);
        
        if (!levelData) return;
        if (tier === 'free' && levelData.claimed.free) return;
        if (tier === 'premium' && levelData.claimed.premium) return;
        if (activeSeason.pass.currentXP < levelData.xpRequired) return;
        if (tier === 'premium' && activeSeason.pass.tier !== 'premium') return;

        if (tier === 'free') levelData.claimed.free = true;
        if (tier === 'premium') levelData.claimed.premium = true;

        const reward = tier === 'free' ? levelData.freeReward : levelData.premiumReward;
        if (reward) {
           console.log(`Claimed ${reward.name} from level ${level} (${tier})`);
        }

        set((state) => ({
          calendar: {
            ...state.calendar,
            seasons: {
              ...state.calendar.seasons,
              [activeSeason.id]: updatedSeason
            }
          }
        }));
      },

      upgradeToPremiumPass: () => {
        const activeSeason = get().getActiveSeason();
        if (!activeSeason) return;

        const updatedSeason = { ...activeSeason };
        updatedSeason.pass.tier = 'premium';

        set((state) => ({
          calendar: {
            ...state.calendar,
            seasons: {
              ...state.calendar.seasons,
              [activeSeason.id]: updatedSeason
            }
          }
        }));
      }
    }),
    {
      name: 'city-builder-events',
    }
  )
);
