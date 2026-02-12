import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGame, loadGame, clearSave, isStorageAvailable } from '../utils/saveSystem';
import { INITIAL_STATE, PACING as BALANCE_PACING, ECONOMY, PRESTIGE, getScaledReward as calculateScaledReward, getGlobalPrestigeMultiplier } from '../config/gameBalance';
import { SessionMetrics, saveSession } from '../utils/sessionAnalytics';
import MissionTracker from './MissionTracker';
import ParticleEffect from './ParticleEffect';
import TextPop from './TextPop';
import AudioControls from './AudioControls';
import audioManager from '../utils/audioManager';
// import ThreeDice from './ThreeDice'; // Deprecated in Phase 10
import { DiceGroup } from './ThreeDice';
import GameScene from './Scene3D/GameScene';
import InstancedParticles from './Scene3D/VFX/InstancedParticles';
import Board3D from './Scene3D/Board3D';
import VFXManager from './Scene3D/VFXManager';
import Notification from './Notification';
import ConfirmDialog from './ConfirmDialog';
import AnalyticsViewer from './AnalyticsViewer';
import CityTransition from './CityTransition';
import LotteryTile from './LotteryTile';
import TaxTile from './TaxTile';
import JailTile from './JailTile';
import FortuneTile from './FortuneTile';
import PowerUpShop from './PowerUpShop';
import PowerUpIndicator from './PowerUpIndicator';
import SpecialEventModal from './SpecialEventModal';
import SlotMachine from './SlotMachine';
import WheelOfFortune from './WheelOfFortune';
import ComboTracker from './ComboTracker';
import SocialTab from './Social/SocialTab';
import { POWER_UPS, getPowerUpCost } from '../config/powerUps';
import { generateMockFriends, SOCIAL_CONFIG } from '../config/social';
import {
  CITY_WIDE_EVENTS,
  EVENT_TRIGGER,
  selectCityWideEvent,
  selectRandomEvent,
  checkMilestoneEvents,
} from '../config/specialEvents';


const CITIES = {
  1: {
    name: 'Neon Harbor',
    themeColor: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.05)',
    backdropClass: 'theme-neon-harbor',
    tiles: [
      { id: 0, type: 'Start', name: 'START', payout: 2000 },
      { id: 1, type: 'Funds', name: 'Funds', payout: 1200 },
      { id: 2, type: 'Lottery', name: 'Lottery' },
      { id: 3, type: 'Tax', name: 'Tax' },
      { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 5, type: 'Corner', name: 'BONUS' },
      { id: 6, type: 'Funds', name: 'Funds', payout: 1500 },
      { id: 7, type: 'Heist', name: 'Heist' },
      { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [1000, 2000, 4000, 8000, 16000], maxLevel: 5 },
      { id: 9, type: 'Card', name: 'Card' },
      { id: 10, type: 'Jail', name: 'Jail' },
      { id: 11, type: 'Sticker', name: 'Sticker' },
      { id: 12, type: 'Funds', name: 'Funds', payout: 2000 },
      { id: 13, type: 'Shutdown', name: 'Shutdown' },
      { id: 14, type: 'Bonus', name: 'Bonus' },
      { id: 15, type: 'Fortune', name: 'Fortune' },
      { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 17, type: 'Dice', name: 'Free Dice', payout: 4 },
      { id: 18, type: 'Funds', name: 'Funds', payout: 2500 },
      { id: 19, type: 'Rent', name: 'Rent' },
    ]
  },
  2: {
    name: 'Deco Heights',
    themeColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.05)',
    backdropClass: 'theme-deco-heights',
    tiles: [
      { id: 0, type: 'Start', name: 'START', payout: 2800 },
      { id: 1, type: 'Funds', name: 'Funds', payout: 1680 },
      { id: 2, type: 'Lottery', name: 'Lottery' },
      { id: 3, type: 'Tax', name: 'Tax' },
      { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 5, type: 'Corner', name: 'BONUS' },
      { id: 6, type: 'Funds', name: 'Funds', payout: 2100 },
      { id: 7, type: 'Heist', name: 'Heist' },
      { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [1400, 2800, 5600, 11200, 22400], maxLevel: 5 },
      { id: 9, type: 'Card', name: 'Card' },
      { id: 10, type: 'Jail', name: 'Jail' },
      { id: 11, type: 'Sticker', name: 'Sticker' },
      { id: 12, type: 'Funds', name: 'Funds', payout: 2800 },
      { id: 13, type: 'Shutdown', name: 'Shutdown' },
      { id: 14, type: 'Bonus', name: 'Bonus' },
      { id: 15, type: 'Fortune', name: 'Fortune' },
      { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 17, type: 'Dice', name: 'Free Dice', payout: 5 },
      { id: 18, type: 'Funds', name: 'Funds', payout: 3500 },
      { id: 19, type: 'Rent', name: 'Rent' },
    ]
  },
  3: {
    name: 'Crystal Plaza',
    themeColor: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.05)',
    backdropClass: 'theme-crystal-plaza',
    tiles: [
      { id: 0, type: 'Start', name: 'START', payout: 3920 },      // 2000 * 1.96
      { id: 1, type: 'Funds', name: 'Funds', payout: 2352 },      // 1200 * 1.96
      { id: 2, type: 'Lottery', name: 'Lottery' },
      { id: 3, type: 'Tax', name: 'Tax' },
      { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 5, type: 'Corner', name: 'BONUS' },
      { id: 6, type: 'Funds', name: 'Funds', payout: 2940 },      // 1500 * 1.96
      { id: 7, type: 'Heist', name: 'Heist' },
      { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [1960, 3920, 7840, 15680, 31360], maxLevel: 5 },
      { id: 9, type: 'Card', name: 'Card' },
      { id: 10, type: 'Jail', name: 'Jail' },
      { id: 11, type: 'Sticker', name: 'Sticker' },
      { id: 12, type: 'Funds', name: 'Funds', payout: 3920 },     // 2000 * 1.96
      { id: 13, type: 'Shutdown', name: 'Shutdown' },
      { id: 14, type: 'Bonus', name: 'Bonus' },
      { id: 15, type: 'Fortune', name: 'Fortune' },
      { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 17, type: 'Dice', name: 'Free Dice', payout: 7 },     // 4 * 1.75 (rounded)
      { id: 18, type: 'Funds', name: 'Funds', payout: 4900 },     // 2500 * 1.96
      { id: 19, type: 'Rent', name: 'Rent' },
    ]
  },
  4: {
    name: 'Starlight District',
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.05)',
    backdropClass: 'theme-starlight-district',
    tiles: [
      { id: 0, type: 'Start', name: 'START', payout: 5488 },      // 2000 * 2.744
      { id: 1, type: 'Funds', name: 'Funds', payout: 3293 },      // 1200 * 2.744
      { id: 2, type: 'Lottery', name: 'Lottery' },
      { id: 3, type: 'Tax', name: 'Tax' },
      { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 5, type: 'Corner', name: 'BONUS' },
      { id: 6, type: 'Funds', name: 'Funds', payout: 4116 },      // 1500 * 2.744
      { id: 7, type: 'Heist', name: 'Heist' },
      { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [2744, 5488, 10976, 21952, 43904], maxLevel: 5 },
      { id: 9, type: 'Card', name: 'Card' },
      { id: 10, type: 'Jail', name: 'Jail' },
      { id: 11, type: 'Sticker', name: 'Sticker' },
      { id: 12, type: 'Funds', name: 'Funds', payout: 5488 },     // 2000 * 2.744
      { id: 13, type: 'Shutdown', name: 'Shutdown' },
      { id: 14, type: 'Bonus', name: 'Bonus' },
      { id: 15, type: 'Fortune', name: 'Fortune' },
      { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 17, type: 'Dice', name: 'Free Dice', payout: 10 },    // 4 * 2.5 (rounded)
      { id: 18, type: 'Funds', name: 'Funds', payout: 6860 },     // 2500 * 2.744
      { id: 19, type: 'Rent', name: 'Rent' },
    ]
  },
  5: {
    name: 'Neon Skyline',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.05)',
    backdropClass: 'theme-neon-skyline',
    tiles: [
      { id: 0, type: 'Start', name: 'START', payout: 7683 },      // 2000 * 3.8416
      { id: 1, type: 'Funds', name: 'Funds', payout: 4610 },      // 1200 * 3.8416
      { id: 2, type: 'Lottery', name: 'Lottery' },
      { id: 3, type: 'Tax', name: 'Tax' },
      { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 5, type: 'Corner', name: 'BONUS' },
      { id: 6, type: 'Funds', name: 'Funds', payout: 5762 },      // 1500 * 3.8416
      { id: 7, type: 'Heist', name: 'Heist' },
      { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [3842, 7683, 15366, 30733, 61466], maxLevel: 5 },
      { id: 9, type: 'Card', name: 'Card' },
      { id: 10, type: 'Jail', name: 'Jail' },
      { id: 11, type: 'Sticker', name: 'Sticker' },
      { id: 12, type: 'Funds', name: 'Funds', payout: 7683 },     // 2000 * 3.8416
      { id: 13, type: 'Shutdown', name: 'Shutdown' },
      { id: 14, type: 'Bonus', name: 'Bonus' },
      { id: 15, type: 'Fortune', name: 'Fortune' },
      { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
      { id: 17, type: 'Dice', name: 'Free Dice', payout: 14 },    // 4 * 3.5 (rounded)
      { id: 18, type: 'Funds', name: 'Funds', payout: 9604 },     // 2500 * 3.8416
      { id: 19, type: 'Rent', name: 'Rent' },
    ]
  }
};

const TILE_COUNT = 20;

const MILESTONES = ECONOMY.MILESTONE_THRESHOLDS.map(threshold => {
  if (threshold === 10) return { threshold, reward: { type: 'dice', amount: 20 }, description: `Reach ${threshold} event points: 20 Dice` };
  if (threshold === 20) return { threshold, reward: { type: 'funds', amount: 8000 }, description: `Reach ${threshold} event points: 8,000 Funds` };
  if (threshold === 40) return { threshold, reward: { type: 'sticker_pack', amount: 1 }, description: `Reach ${threshold} event points: 1 Sticker Pack` };
  if (threshold === 80) return { threshold, reward: { type: 'dice', amount: 35 }, description: `Reach ${threshold} event points: 35 Dice` };
  if (threshold === 120) return { threshold, reward: { type: 'funds', amount: 15000 }, description: `Reach ${threshold} event points: 15,000 Funds` };
  return { threshold, reward: { type: 'funds', amount: 5000 }, description: `Reach ${threshold} event points: 5,000 Funds` };
});

const PACING = {
  pointsPerRoll: BALANCE_PACING.POINTS_PER_ROLL,
  doublesBonusMultiplier: BALANCE_PACING.DOUBLES_BONUS_MULTIPLIER
};

const STICKER_RARITIES = {
  COMMON: { name: 'Common', dropChance: 0.6 },
  RARE: { name: 'Rare', dropChance: 0.3 },
  EPIC: { name: 'Epic', dropChance: 0.1 },
};

const STICKER_PACK_CONTENTS = {
  BASIC: {
    stickersPerPack: 3,
    rarityDistribution: [
      { rarity: STICKER_RARITIES.COMMON, weight: 60 },
      { rarity: STICKER_RARITIES.RARE, weight: 30 },
      { rarity: STICKER_RARITIES.EPIC, weight: 10 },
    ],
  },
};

const CRAFTING_COSTS = {
  'Common': 40,
  'Rare': 100,
  'Epic': 250
};

const STICKER_COLLECTION = {
  'City Life': [
    { id: 1, name: 'Bus', rarity: 'Common', dustCost: 100 },
    { id: 2, name: 'Taxi', rarity: 'Common', dustCost: 100 },
    { id: 3, name: 'Subway', rarity: 'Rare', dustCost: 200 },
  ],
  'Famous Monuments': [
    { id: 4, name: 'Eiffel Tower', rarity: 'Rare', dustCost: 200 },
    { id: 5, name: 'Statue of Liberty', rarity: 'Epic', dustCost: 500 },
    { id: 6, name: 'Big Ben', rarity: 'Rare', dustCost: 200 },
  ],
  'Sweet Treats': [
    { id: 7, name: 'Ice Cream', rarity: 'Common', dustCost: 100 },
    { id: 8, name: 'Donut', rarity: 'Rare', dustCost: 200 },
    { id: 9, name: 'Chocolate Bar', rarity: 'Epic', dustCost: 500 },
  ]
};

const ALL_STICKERS = Object.values(STICKER_COLLECTION).flat();

export default function BoardLoop({ cityLevel, funds, setFunds, shields, setShields, dice, setDice, setCityLevel }) {

  const cityData = CITIES[cityLevel] || CITIES[1];

  const [tiles, setTiles] = useState(CITIES[cityLevel]?.tiles || CITIES[1].tiles);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [eventProgress, setEventProgress] = useState(0);
  const [milestoneRewardsClaimed, setMilestoneRewardsClaimed] = useState(
    Array(MILESTONES.length).fill(false)
  );
  const [comboTarget, setComboTarget] = useState(() => Math.floor(Math.random() * 6) + 1);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [totalRolls, setTotalRolls] = useState(0);
  const [totalUpgrades, setTotalUpgrades] = useState(0);
  const [totalShieldsCollected, setTotalShieldsCollected] = useState(0);
  const [comboRewardClaimed, setComboRewardClaimed] = useState(false);
  const [playerStickers, setPlayerStickers] = useState([
    // { id: 1, name: 'Bus', rarity: 'Common' } // Example for testing
  ]);
  const [stickerPacksAvailable, setStickerPacksAvailable] = useState(1);
  const [dust, setDust] = useState(0);
  const [setTokens, setSetTokens] = useState(0);
  const [craftRarity, setCraftRarity] = useState('Common');
  const [craftIndex, _setCraftIndex] = useState(0);
  const [setCompletionRewardsClaimed, setSetCompletionRewardsClaimed] = useState({});
  const [rolling, setRolling] = useState(false);
  const [rollValue, setRollValue] = useState(7);
  const [die1Value, setDie1Value] = useState(1);
  const [die2Value, setDie2Value] = useState(6);
  const [dicePulse, setDicePulse] = useState(false);
  const [stoppedOnName, setStoppedOnName] = useState('GO');
  const [_diceRollerRoll, setDiceRollerRoll] = useState(false);
  const [upgradePulse, setUpgradePulse] = useState(false);
  const [tileGlow, setTileGlow] = useState(null);
  const [tileEffect, setTileEffect] = useState(null);
  const [hudMessage, setHudMessage] = useState(null);
  const [upgradeParticles, setUpgradeParticles] = useState(null);
  const [activeParticles, setActiveParticles] = useState([]); // Array of {id, type, x, y, ...props}
  const [textPop, setTextPop] = useState(null);
  const [diceStreak, setDiceStreak] = useState(0);
  const [fundsTilesLanded, setFundsTilesLanded] = useState(0);
  const [showStickerCollection] = useState(false);
  const [hasNewSticker, setHasNewSticker] = useState(false);
  const [activeTileModal, setActiveTileModal] = useState(null);
  const [pendingFortuneEffect, setPendingFortuneEffect] = useState(null);
  const [skipTurnsRemaining, setSkipTurnsRemaining] = useState(0);
  const [jailTurnsRemaining, setJailTurnsRemaining] = useState(0);
  const [hasJailFreeCard, setHasJailFreeCard] = useState(false);
  const [hasTaxHavenPowerUp, setHasTaxHavenPowerUp] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [powerUpCooldowns, setPowerUpCooldowns] = useState({});
  const [purchasedPowerUps, setPurchasedPowerUps] = useState({});
  const [positiveStreak, setPositiveStreak] = useState(0);
  const [comboChain, setComboChain] = useState({ type: null, count: 0 });
  const [diceCostRemainder, setDiceCostRemainder] = useState(0);

  // Social state
  const [friends, setFriends] = useState([]);
  const [dailyGiftCount, setDailyGiftCount] = useState(0);
  const [lastGiftReset, setLastGiftReset] = useState(Date.now());

  // Combo multiplier helper
  const getComboMultiplier = (count) => {
    if (count <= 1) return 1.0;
    if (count === 2) return 1.1;
    if (count === 3) return 1.25;
    if (count === 4) return 1.5;
    return 2.0;
  };

  // Special events state
  const [activeSpecialEvent, setActiveSpecialEvent] = useState(null);
  const [specialEventDisplay, setSpecialEventDisplay] = useState(null);
  const [rollsSinceLastCityEvent, setRollsSinceLastCityEvent] = useState(0);
  const [lastMilestoneRolls, setLastMilestoneRolls] = useState(0);
  const [lastMilestoneUpgrades, setLastMilestoneUpgrades] = useState(0);
  const [upgradeBlocked, setUpgradeBlocked] = useState(false);
  const [wheelSpunThisCity, setWheelSpunThisCity] = useState(false);
  const [globalPrestigeLevel, setGlobalPrestigeLevel] = useState(0);

  // Mission state (Daily, Weekly, Monthly persistence)
  const [missionState, setMissionState] = useState({
    daily: { startRolls: 0, startUpgrades: 0, startShields: 0, startFundsTiles: 0, completed: [], resetCount: 0 },
    weekly: { startRolls: 0, startUpgrades: 0, startDailyCycles: 0, completed: [] },
    monthly: { startRolls: 0, startUpgrades: 0, startDailyCycles: 0, completed: [] }
  });

  // City transition state
  const [cityTransitionActive, setCityTransitionActive] = useState(false);
  const [targetCity, setTargetCity] = useState(null);
  const [activeTab, setActiveTab] = useState('event');
  const [isMoving, setIsMoving] = useState(false);
  const [use3DBoard, setUse3DBoard] = useState(true); // Phase 10: 3D board enabled
  const [autoRollEnabled, setAutoRollEnabled] = useState(false);
  const [missionResetAvailable, setMissionResetAvailable] = useState(false);
  const [missionResetHandler, setMissionResetHandler] = useState(null);
  const [eventPrestigeLevel, setEventPrestigeLevel] = useState(0);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [_showTiles, setShowTiles] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const notificationTimeoutRef = useRef(null);
  const resumeAutoRollAfterPrestigeRef = useRef(false);
  const diceRef = useRef(dice);
  const autoPrestigeTriggeredRef = useRef(false);

  // Analytics: Session tracking
  const currentSession = useRef(new SessionMetrics());
  const skipCityResetRef = useRef(false);

  // Phase 10: 3D Particle System Ref
  const particleSystemRef = useRef(null);
  const board3DRef = useRef(null);
  const vfxRef = useRef(null);


  useEffect(() => {
    if (!isStorageAvailable()) {
      showNotification("Storage unavailable! Progress will not be saved.", 'warning', 5000);
      return;
    }

    const savedState = loadGame();
    if (savedState) {
      skipCityResetRef.current = true;
      if (savedState.funds !== undefined) setFunds(savedState.funds);
      if (savedState.dice !== undefined) setDice(savedState.dice);
      if (savedState.shields !== undefined) setShields(savedState.shields);
      if (savedState.cityLevel !== undefined) setCityLevel(savedState.cityLevel);
      if (savedState.tiles !== undefined) setTiles(savedState.tiles); // Load persisted tiles
      if (savedState.playerPosition !== undefined) setPlayerPosition(savedState.playerPosition);
      if (savedState.eventProgress !== undefined) setEventProgress(savedState.eventProgress);
      if (savedState.eventPrestigeLevel !== undefined) setEventPrestigeLevel(savedState.eventPrestigeLevel);
      if (savedState.playerStickers !== undefined) setPlayerStickers(savedState.playerStickers);
      if (savedState.stickerPacksAvailable !== undefined) setStickerPacksAvailable(savedState.stickerPacksAvailable);
      if (savedState.dust !== undefined) setDust(savedState.dust);
      if (savedState.setTokens !== undefined) setSetTokens(savedState.setTokens);
      if (savedState.milestoneRewardsClaimed !== undefined) setMilestoneRewardsClaimed(savedState.milestoneRewardsClaimed);
      if (savedState.setCompletionRewardsClaimed !== undefined) setSetCompletionRewardsClaimed(savedState.setCompletionRewardsClaimed);
      if (savedState.totalRolls !== undefined) setTotalRolls(savedState.totalRolls);
      if (savedState.totalUpgrades !== undefined) setTotalUpgrades(savedState.totalUpgrades);
      if (savedState.totalShieldsCollected !== undefined) setTotalShieldsCollected(savedState.totalShieldsCollected);
      if (savedState.fundsTilesLanded !== undefined) setFundsTilesLanded(savedState.fundsTilesLanded);
      if (savedState.skipTurnsRemaining !== undefined) setSkipTurnsRemaining(savedState.skipTurnsRemaining);
      if (savedState.jailTurnsRemaining !== undefined) setJailTurnsRemaining(savedState.jailTurnsRemaining);
      if (savedState.hasJailFreeCard !== undefined) setHasJailFreeCard(savedState.hasJailFreeCard);
      if (savedState.hasTaxHavenPowerUp !== undefined) setHasTaxHavenPowerUp(savedState.hasTaxHavenPowerUp);
      if (savedState.activePowerUps !== undefined) setActivePowerUps(savedState.activePowerUps);
      if (savedState.powerUpCooldowns !== undefined) setPowerUpCooldowns(savedState.powerUpCooldowns);
      if (savedState.purchasedPowerUps !== undefined) setPurchasedPowerUps(savedState.purchasedPowerUps);
      if (savedState.positiveStreak !== undefined) setPositiveStreak(savedState.positiveStreak);
      if (savedState.diceCostRemainder !== undefined) setDiceCostRemainder(savedState.diceCostRemainder);
      if (savedState.activeSpecialEvent !== undefined) setActiveSpecialEvent(savedState.activeSpecialEvent);
      if (savedState.rollsSinceLastCityEvent !== undefined) setRollsSinceLastCityEvent(savedState.rollsSinceLastCityEvent);
      if (savedState.lastMilestoneRolls !== undefined) setLastMilestoneRolls(savedState.lastMilestoneRolls);
      if (savedState.lastMilestoneUpgrades !== undefined) setLastMilestoneUpgrades(savedState.lastMilestoneUpgrades);
      if (savedState.wheelSpunThisCity !== undefined) setWheelSpunThisCity(savedState.wheelSpunThisCity);
      if (savedState.globalPrestigeLevel !== undefined) setGlobalPrestigeLevel(savedState.globalPrestigeLevel);
      if (savedState.missionState !== undefined) setMissionState(savedState.missionState);

      // Social state load
      if (savedState.friends && savedState.friends.length > 0) {
        setFriends(savedState.friends);
      } else {
        setFriends(generateMockFriends(savedState.cityLevel || 1, SOCIAL_CONFIG.FRIEND_COUNT));
      }
      if (savedState.dailyGiftCount !== undefined) setDailyGiftCount(savedState.dailyGiftCount);
      if (savedState.lastGiftReset !== undefined) setLastGiftReset(savedState.lastGiftReset);

      showNotification("Game Loaded!", 'success', 2000);
    } else {
      // New game initialization for friends
      setFriends(generateMockFriends(1, SOCIAL_CONFIG.FRIEND_COUNT));
    }
  }, []); // Only once on mount

  useEffect(() => {
    const checkDailyReset = () => {
      const lastResetDate = new Date(lastGiftReset);
      const now = new Date();

      // Check if it's a different day
      if (lastResetDate.getDate() !== now.getDate() ||
        lastResetDate.getMonth() !== now.getMonth() ||
        lastResetDate.getFullYear() !== now.getFullYear()) {

        setDailyGiftCount(0);
        setFriends(prev => prev.map(f => ({
          ...f,
          giftSent: false,
          giftReceived: Math.random() > 0.5 // Random chance to receive new gifts
        })));
        setLastGiftReset(Date.now());
        showNotification("Daily social limits reset!", 'info');
      }
    };

    checkDailyReset();
  }, [lastGiftReset]);

  // Persistence: Auto-save on state change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const stateToSave = {
        funds,
        dice,
        shields,
        cityLevel,
        eventProgress,
        eventPrestigeLevel,
        playerStickers,
        stickerPacksAvailable,
        dust,
        setTokens,
        milestoneRewardsClaimed,
        setCompletionRewardsClaimed,
        totalRolls,
        totalUpgrades,
        totalShieldsCollected,
        fundsTilesLanded,
        skipTurnsRemaining,
        jailTurnsRemaining,
        hasJailFreeCard,
        hasTaxHavenPowerUp,
        activePowerUps,
        powerUpCooldowns,
        purchasedPowerUps,
        positiveStreak,
        diceCostRemainder,
        activeSpecialEvent,
        rollsSinceLastCityEvent,
        lastMilestoneRolls,
        lastMilestoneUpgrades,
        wheelSpunThisCity,
        playerPosition,
        tiles, // Persist tile state (including upgrades)
        friends,
        dailyGiftCount,
        lastGiftReset,
        globalPrestigeLevel,
        missionState
      };
      const success = saveGame(stateToSave);
      if (success) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [
    funds, dice, shields, cityLevel, eventProgress, eventPrestigeLevel,
    playerStickers, stickerPacksAvailable, dust, setTokens,
    milestoneRewardsClaimed, setCompletionRewardsClaimed,
    totalRolls, totalUpgrades, totalShieldsCollected, fundsTilesLanded,
    skipTurnsRemaining, jailTurnsRemaining, hasJailFreeCard, hasTaxHavenPowerUp,
    activePowerUps, powerUpCooldowns, purchasedPowerUps, positiveStreak, diceCostRemainder,
    activeSpecialEvent, rollsSinceLastCityEvent, lastMilestoneRolls, lastMilestoneUpgrades,
    wheelSpunThisCity, playerPosition, tiles, friends, dailyGiftCount, lastGiftReset, globalPrestigeLevel,
    missionState
  ]);

  // Prestige helper functions
  const getRewardMultiplier = (prestigeLevel) => {
    return Math.min(PRESTIGE.MAX_MULTIPLIER, 1.0 + (prestigeLevel * PRESTIGE.MULTIPLIER_PER_LEVEL));
  };

  // Notification helpers - defined early for use in useEffects
  const showNotification = (message, type = 'info', duration = 3000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, type, duration });
    if (duration !== Infinity) {
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
        notificationTimeoutRef.current = null;
      }, duration);
    }
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const showConfirm = (title, message, onConfirm, options = {}) => {
    setConfirmDialog({
      title,
      message,
      onConfirm,
      ...options
    });
  };

  const powerUpConfigById = useMemo(() => {
    return new Map(Object.values(POWER_UPS).map((powerUp) => [powerUp.id, powerUp]));
  }, []);

  const activePowerUpMap = useMemo(() => {
    return new Map(activePowerUps.map((powerUp) => [powerUp.id, powerUp]));
  }, [activePowerUps]);

  const activePowerUpEffects = useMemo(() => {
    const result = activePowerUps.reduce((accumulator, powerUp) => {
      const config = powerUpConfigById.get(powerUp.id);
      if (!config?.effect) return accumulator;
      const { effect } = config;

      if (effect.rewardMultiplier) {
        accumulator.rewardMultiplier *= effect.rewardMultiplier;
      }
      if (effect.fundsMultiplier) {
        accumulator.fundsMultiplier *= effect.fundsMultiplier;
      }
      if (effect.fundsFromFundsTiles) {
        accumulator.fundsFromFundsTiles *= effect.fundsFromFundsTiles;
      }
      if (effect.diceCostMultiplier) {
        accumulator.diceCostMultiplier *= effect.diceCostMultiplier;
      }
      if (effect.guaranteeDoubles) {
        accumulator.guaranteeDoubles = true;
      }
      return accumulator;
    }, {
      rewardMultiplier: 1,
      fundsMultiplier: 1,
      fundsFromFundsTiles: 1,
      diceCostMultiplier: 1,
      guaranteeDoubles: false,
    });

    // Apply city-wide special event multipliers
    if (activeSpecialEvent?.effects?.rewardMultiplier) {
      result.rewardMultiplier *= activeSpecialEvent.effects.rewardMultiplier;
    }
    if (activeSpecialEvent?.effects?.guaranteeLotteryWin) {
      result.guaranteeLotteryWin = true;
    }
    if (activeSpecialEvent?.effects?.blockTax) {
      result.blockTax = true;
    }
    if (activeSpecialEvent?.effects?.blockRent) {
      result.blockRent = true;
    }
    if (activeSpecialEvent?.effects?.stickerMultiplier) {
      result.stickerMultiplier = activeSpecialEvent.effects.stickerMultiplier;
    }

    return result;
  }, [activePowerUps, powerUpConfigById, activeSpecialEvent]);

  const activatePowerUp = useCallback((powerUpId, options = {}) => {
    const config = powerUpConfigById.get(powerUpId);
    if (!config) return;

    setActivePowerUps((prev) => {
      const existing = prev.find((powerUp) => powerUp.id === powerUpId);
      const remainingRolls = config.duration === Infinity ? null : config.duration ?? null;
      if (existing) {
        if (remainingRolls !== null) {
          return prev.map((powerUp) =>
            powerUp.id === powerUpId ? { ...powerUp, remainingRolls } : powerUp
          );
        }
        return prev;
      }
      return [...prev, { id: powerUpId, remainingRolls }];
    });

    if (!options.silent) {
      showNotification(`${config.name} activated!`, 'success', 2500);
    }
  }, [powerUpConfigById]);

  const registerPositiveOutcome = useCallback((isPositive) => {
    if (isPositive) {
      setPositiveStreak((prev) => {
        const next = prev + 1;
        if (next >= (POWER_UPS.HOT_STREAK.trigger?.consecutivePositiveTiles ?? 3)) {
          activatePowerUp(POWER_UPS.HOT_STREAK.id);
          return 0;
        }
        return next;
      });
    } else {
      setPositiveStreak(0);
    }
  }, [activatePowerUp]);

  const applyRewardMultiplier = useCallback((value) => {
    if (value <= 0) return value;
    let total = value * activePowerUpEffects.rewardMultiplier;

    // Apply global prestige
    if (globalPrestigeLevel > 0) {
      total *= getGlobalPrestigeMultiplier(globalPrestigeLevel);
    }

    return Math.round(total);
  }, [activePowerUpEffects.rewardMultiplier, globalPrestigeLevel]);

  const applyFundsMultiplier = useCallback((value, options = {}) => {
    if (value <= 0) return value;
    let total = value * activePowerUpEffects.fundsMultiplier;
    if (options.isFundsTile) {
      total *= activePowerUpEffects.fundsFromFundsTiles;
    }

    // Apply global prestige to funds too (it's multiplicative)
    // Note: applyRewardMultiplier is often called with applyFundsMultiplier result,
    // but some logic might call them independently.
    // If we apply it here AND in applyRewardMultiplier, we double dip.
    // Let's check usages. Usually it's applyRewardMultiplier(applyFundsMultiplier(base)).
    // So we should ONLY apply it in applyRewardMultiplier to be safe and consistent.
    // BUT, some funds calculations might not use applyRewardMultiplier?
    // Let's stick to applying it in applyRewardMultiplier for now as the single source of truth for "output scaling".

    return Math.round(total);
  }, [activePowerUpEffects.fundsMultiplier, activePowerUpEffects.fundsFromFundsTiles]);

  const advancePowerUpRolls = useCallback(() => {
    setActivePowerUps((prev) => {
      const updated = prev
        .map((powerUp) => {
          if (powerUp.remainingRolls === null || powerUp.remainingRolls === undefined) {
            return powerUp;
          }
          return { ...powerUp, remainingRolls: powerUp.remainingRolls - 1 };
        })
        .filter((powerUp) => powerUp.remainingRolls === null || powerUp.remainingRolls > 0);
      return updated;
    });
  }, []);

  // Special events: advance city-wide event duration and check for new events
  const advanceSpecialEvent = useCallback(() => {
    if (activeSpecialEvent) {
      const remaining = activeSpecialEvent.remainingRolls - 1;
      if (remaining <= 0) {
        setActiveSpecialEvent(null);
        showNotification(`${activeSpecialEvent.name} has ended.`, 'info', 2500);
      } else {
        setActiveSpecialEvent(prev => ({ ...prev, remainingRolls: remaining }));
      }
    }
    setRollsSinceLastCityEvent(prev => prev + 1);
    setUpgradeBlocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpecialEvent]);

  const checkSpecialEvents = useCallback((currentTotalRolls, currentTotalUpgrades) => {
    // 1. Try to trigger a city-wide event
    if (!activeSpecialEvent && rollsSinceLastCityEvent >= EVENT_TRIGGER.CITY_WIDE_COOLDOWN) {
      if (Math.random() < EVENT_TRIGGER.CITY_WIDE_CHANCE) {
        const event = selectCityWideEvent();
        const newEvent = {
          ...event,
          remainingRolls: event.duration,
          category: 'city_wide',
        };
        setActiveSpecialEvent(newEvent);
        setSpecialEventDisplay({ ...newEvent, category: 'city_wide' });
        setRollsSinceLastCityEvent(0);
        setAutoRollEnabled(false);
        return; // Only one event per roll
      }
    }

    // 2. Try to trigger a random event
    if (Math.random() < EVENT_TRIGGER.RANDOM_EVENT_CHANCE) {
      const event = selectRandomEvent();
      const displayEvent = { ...event, category: 'random' };

      // Apply random event effects immediately
      switch (event.effect.type) {
        case 'ADD_FUNDS': {
          const value = event.effect.getValue(cityLevel);
          setFunds(prev => prev + value);
          currentSession.current.recordFundsChange(value);
          displayEvent.effectText = `+$${value.toLocaleString()}`;
          break;
        }
        case 'SKIP_AND_GAIN': {
          const skipTurns = event.effect.getSkipTurns();
          const fundsValue = event.effect.getFundsValue(cityLevel);
          setSkipTurnsRemaining(prev => prev + skipTurns);
          setFunds(prev => prev + fundsValue);
          currentSession.current.recordFundsChange(fundsValue);
          displayEvent.effectText = `Skip ${skipTurns} turn, +$${fundsValue.toLocaleString()}`;
          break;
        }
        case 'TELEPORT': {
          // Teleport will be handled after tile landing
          displayEvent.effectText = `Move forward ${event.effect.value} spaces`;
          const newPos = (playerPosition + event.effect.value + 20) % 20;
          setPlayerPosition(newPos);
          break;
        }
        case 'BLOCK_UPGRADE': {
          setUpgradeBlocked(true);
          displayEvent.effectText = 'Upgrades blocked this turn';
          break;
        }
        case 'GRANT_POWER_UP': {
          const powerUpKeys = Object.keys(POWER_UPS);
          const randomKey = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
          const powerUp = POWER_UPS[randomKey];
          activatePowerUp(powerUp.id, { silent: true });
          displayEvent.effectText = `Gained ${powerUp.name}!`;
          break;
        }
        case 'LOSE_PERCENT_FUNDS': {
          const maxLoss = event.effect.getMaxLoss(cityLevel);
          const loss = Math.min(maxLoss, Math.floor(funds * event.effect.percent));
          setFunds(prev => Math.max(0, prev - loss));
          currentSession.current.recordFundsChange(-loss);
          displayEvent.effectText = `-$${loss.toLocaleString()}`;
          break;
        }
        default:
          break;
      }

      setSpecialEventDisplay(displayEvent);
      return;
    }

    // 3. Check milestone events
    const milestones = checkMilestoneEvents(
      currentTotalRolls, currentTotalUpgrades,
      lastMilestoneRolls, lastMilestoneUpgrades
    );

    if (milestones.length > 0) {
      for (const milestone of milestones) {
        if (milestone.reward.type === 'CHEST') {
          const bonusFunds = milestone.reward.getFunds(cityLevel);
          setFunds(prev => prev + bonusFunds);
          setDice(prev => prev + milestone.reward.dice);
          setShields(prev => Math.min(ECONOMY.MAX_SHIELDS, prev + milestone.reward.shields));
          currentSession.current.recordFundsChange(bonusFunds);
          currentSession.current.recordDiceChange(milestone.reward.dice);
          setSpecialEventDisplay({
            ...milestone,
            category: 'milestone',
            color: '#fbbf24',
            effectText: `+$${bonusFunds.toLocaleString()}, +${milestone.reward.dice} Dice, +${milestone.reward.shields} Shield`,
          });
        } else if (milestone.reward.type === 'STICKER_PACK') {
          setStickerPacksAvailable(prev => prev + milestone.reward.packs);
          setHasNewSticker(true);
          setSpecialEventDisplay({
            ...milestone,
            category: 'milestone',
            color: '#ec4899',
            effectText: `+${milestone.reward.packs} Sticker Pack!`,
          });
        }
      }
      setLastMilestoneRolls(currentTotalRolls);
      setLastMilestoneUpgrades(currentTotalUpgrades);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpecialEvent, rollsSinceLastCityEvent, cityLevel, funds, playerPosition, lastMilestoneRolls, lastMilestoneUpgrades, activatePowerUp]);

  const getScaledReward = (baseAmount, prestigeLevel) => {
    return calculateScaledReward(baseAmount, prestigeLevel);
  };

  const currentMultiplier = getRewardMultiplier(eventPrestigeLevel);

  // Define resolveTileLanding early with useCallback to avoid hoisting issues
  const resolveTileLanding = useCallback((position) => {
    const tile = tiles.find(t => t.id === position);
    if (!tile) return;

    // Update combo chain
    const isSameType = comboChain.type === tile.type;
    const nextCount = isSameType ? comboChain.count + 1 : 1;
    setComboChain({ type: tile.type, count: nextCount });

    if (nextCount >= 5 && isSameType) {
      const powerUpKeys = Object.keys(POWER_UPS).filter(k => POWER_UPS[k].id !== 'hot_streak');
      const randomKey = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
      activatePowerUp(POWER_UPS[randomKey].id);
      showNotification(`Chain x${nextCount}! Bonus Power-Up!`, 'success', 3000);
    }

    const comboMultiplier = getComboMultiplier(nextCount);

    setStoppedOnName(tile.name);
    setTileGlow(position);
    setTimeout(() => setTileGlow(null), 1500);

    switch (tile.type) {
      case 'Start': {
        const startPayout = tile.payout || ECONOMY.START_TILE_PAYOUT_BASE;
        const adjustedStart = Math.round(applyRewardMultiplier(applyFundsMultiplier(startPayout)) * comboMultiplier);
        setFunds(prev => prev + adjustedStart);
        setTileEffect({ type: 'funds', x: 400, y: 300 });
        setTimeout(() => setTileEffect(null), 1000);
        currentSession.current.recordFundsChange(adjustedStart);
        if (comboMultiplier > 1) {
          showNotification(`Combo x${nextCount}! +${Math.round((comboMultiplier - 1) * 100)}% Bonus`, 'success', 2000);
        }
        registerPositiveOutcome(true);
        break;
      }
      case 'Funds': {
        const fundsPayout = tile.payout || 1000;
        const adjustedFunds = Math.round(applyRewardMultiplier(applyFundsMultiplier(fundsPayout, { isFundsTile: true })) * comboMultiplier);
        setFunds(prev => prev + adjustedFunds);
        setFundsTilesLanded(prev => prev + 1);
        setTileEffect({ type: 'funds', x: 400, y: 300 });
        setTimeout(() => setTileEffect(null), 2000);
        currentSession.current.recordFundsChange(adjustedFunds);

        // Add coin particles for large funds gains (>= 5000)
        if (adjustedFunds >= 5000) {
          const tileElement = document.querySelector(`.tile-id-${tile.id}`);
          if (tileElement) {
            const rect = tileElement.getBoundingClientRect();
            addParticleEffect('coins', rect.left + rect.width / 2, rect.top + rect.height / 2, {
              count: Math.min(10, Math.floor(adjustedFunds / 800)),
              distance: 80,
              duration: 1.0,
              size: 10,
              customColors: ['#fbbf24', '#f59e0b', '#d97706']
            });
          }

          // Play funds sound
          audioManager.playSFX('funds');
        }

        if (comboMultiplier > 1) {
          showNotification(`Combo x${nextCount}! +${Math.round((comboMultiplier - 1) * 100)}% Bonus`, 'success', 2000);
        }
        registerPositiveOutcome(true);
        break;
      }
      case 'Heist': {
        const heistAmount = Math.floor(funds * 0.1);
        const adjustedHeist = Math.round(applyRewardMultiplier(applyFundsMultiplier(heistAmount)) * comboMultiplier);
        setFunds(prev => prev + adjustedHeist);
        setHudMessage(`Heist! +${adjustedHeist} Funds${comboMultiplier > 1 ? ` (x${comboMultiplier})` : ''}`);
        setTimeout(() => setHudMessage(null), 2000);
        currentSession.current.recordFundsChange(adjustedHeist);
        registerPositiveOutcome(true);
        break;
      }
      case 'Shield':
        if (shields < ECONOMY.MAX_SHIELDS) {
          const baseGain = 2;
          const adjustedGain = Math.round(applyRewardMultiplier(baseGain) * comboMultiplier);
          const actualGain = Math.max(1, adjustedGain);
          const remaining = Math.max(0, ECONOMY.MAX_SHIELDS - shields);
          const effectiveGain = Math.min(actualGain, remaining);

          if (effectiveGain <= 0) {
            setHudMessage("Max Shields!");
            setTimeout(() => setHudMessage(null), 1500);
            registerPositiveOutcome(false);
            break;
          }

          setShields(prev => Math.min(ECONOMY.MAX_SHIELDS, prev + effectiveGain));
          setTotalShieldsCollected(prev => prev + effectiveGain);
          currentSession.current.recordShieldGained(effectiveGain);
          setTileEffect({ type: 'shield', x: 400, y: 300 });
          setTimeout(() => setTileEffect(null), 2000);
          if (comboMultiplier > 1) {
            showNotification(`Combo x${nextCount}! +${effectiveGain} Shields`, 'success', 2000);
          }
          registerPositiveOutcome(true);
        } else {
          setHudMessage("Max Shields!");
          setTimeout(() => setHudMessage(null), 1500);
          registerPositiveOutcome(false);
        }
        break;
      case 'Rent': {
        if (activePowerUpEffects.blockRent) {
          setHudMessage("Rent waived! (Tax Holiday)");
          setTimeout(() => setHudMessage(null), 2000);
          registerPositiveOutcome(true);
          break;
        }
        const rentCost = 500;
        setFunds(prev => Math.max(0, prev - rentCost));
        setHudMessage(`Rent! -${rentCost} Funds`);
        setTimeout(() => setHudMessage(null), 2000);
        currentSession.current.recordFundsChange(-rentCost);
        registerPositiveOutcome(false);
        break;
      }
      case 'Bonus': {
        const bonusPayout = 1500;
        const adjustedBonus = Math.round(applyRewardMultiplier(applyFundsMultiplier(bonusPayout)) * comboMultiplier);
        setFunds(prev => prev + adjustedBonus);
        setHudMessage(`Bonus! +${adjustedBonus} Funds${comboMultiplier > 1 ? ` (x${comboMultiplier})` : ''}`);
        setTimeout(() => setHudMessage(null), 2000);
        currentSession.current.recordFundsChange(adjustedBonus);
        registerPositiveOutcome(true);
        break;
      }
      case 'Shutdown':
        if (shields > 0) {
          setShields(prev => prev - 1);
          setHudMessage("Shutdown blocked by Shield!");
          setTimeout(() => setHudMessage(null), 2000);
          currentSession.current.recordShieldUsed();
          registerPositiveOutcome(false);
        } else {
          setHudMessage("Shutdown! No shield.");
          setTimeout(() => setHudMessage(null), 2000);
          registerPositiveOutcome(false);
        }
        break;
      case 'Sticker': {
        const stickerPacks = activePowerUpEffects.stickerMultiplier || 1;
        setStickerPacksAvailable(prev => prev + stickerPacks);
        setHasNewSticker(true);
        setHudMessage(stickerPacks > 1 ? `${stickerPacks} Sticker Packs earned!` : "Sticker Pack earned!");
        setTimeout(() => setHudMessage(null), 2000);
        currentSession.current.recordStickerPackEarned();
        registerPositiveOutcome(true);
        break;
      }
      case 'Card':
        if (!wheelSpunThisCity && Math.random() < 0.5) {
          setActiveTileModal('wheel');
        } else {
          setActiveTileModal('slot_machine');
        }
        setAutoRollEnabled(false);
        break;
      case 'Dice': {
        const dicePayout = tile.payout || ECONOMY.DICE_TILE_PAYOUT_BASE;
        const adjustedDice = Math.round(applyRewardMultiplier(dicePayout) * comboMultiplier);
        setDice(prev => prev + adjustedDice);
        setHudMessage(`Free Dice! +${adjustedDice}${comboMultiplier > 1 ? ` (x${comboMultiplier})` : ''}`);
        setTimeout(() => setHudMessage(null), 2000);
        currentSession.current.recordDiceChange(adjustedDice);
        registerPositiveOutcome(true);
        break;
      }
      case 'Lottery':
        setActiveTileModal('lottery');
        setAutoRollEnabled(false);
        break;
      case 'Tax':
        setActiveTileModal('tax');
        setAutoRollEnabled(false);
        break;
      case 'Jail':
        setActiveTileModal('jail');
        setAutoRollEnabled(false);
        break;
      case 'Fortune':
        setActiveTileModal('fortune');
        setAutoRollEnabled(false);
        break;
      default:
        break;
    }
  }, [tiles, funds, shields, currentSession, applyRewardMultiplier, applyFundsMultiplier, registerPositiveOutcome, activePowerUpEffects]);

  // Define handleRollDice with useCallback before useEffects that call it
  const handleRollDice = useCallback(async () => {
    if (activeTileModal || cityTransitionActive) {
      return;
    }

    if (skipTurnsRemaining > 0) {
      const nextTurns = Math.max(0, skipTurnsRemaining - 1);
      setSkipTurnsRemaining(nextTurns);
      showNotification(`Turn skipped. ${nextTurns} remaining.`, 'warning', 2000);
      return;
    }

    if (dice <= 0 || isMoving) {
      if (dice <= 0) showNotification("No dice left! Wait for daily refresh or buy more.", 'warning');
      return;
    }

    setDiceRollerRoll(true);
    setTimeout(() => setDiceRollerRoll(false), 750);

    setRolling(true);

    // Roll the dice
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = activePowerUpEffects.guaranteeDoubles ? die1 : Math.floor(Math.random() * 6) + 1;
    const totalRoll = die1 + die2;

    setDie1Value(die1);
    setDie2Value(die2);
    setRollValue(totalRoll);

    // Update streak
    if (rollValue === totalRoll && rollValue !== null) {
      setDiceStreak(prev => (prev === 0 ? 2 : prev + 1));
    } else {
      setDiceStreak(0);
    }

    // Doubles bonus
    const isInJail = jailTurnsRemaining > 0;
    const rolledDoubles = die1 === die2;

    let doublesBonus = 0;
    if (rolledDoubles && !isInJail) {
      const baseDoublesBonus = Math.max(1, Math.round(totalRoll * BALANCE_PACING.DOUBLES_BONUS_MULTIPLIER));
      doublesBonus = applyRewardMultiplier(baseDoublesBonus);
      showNotification(`Doubles! You get ${doublesBonus} extra dice!`, 'success', 2000);

      // Add sparkle effect for doubles
      const diceElement = document.querySelector('.dice-roller');
      if (diceElement) {
        const rect = diceElement.getBoundingClientRect();
        addParticleEffect('sparkles', rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 8,
          distance: 50,
          duration: 0.6,
          size: 8
        });
      }

      // Play doubles sound
      audioManager.playSFX('doubles');
    }

    // Play dice roll sound
    audioManager.playSFX('diceRoll');

    // Wait for dice tumble animation to almost finish before starting move
    await new Promise(r => setTimeout(r, 800));
    setRolling(false);

    const rollCost = activePowerUpEffects.diceCostMultiplier;
    const totalCost = rollCost + diceCostRemainder;
    const diceToDeduct = Math.floor(totalCost);
    const nextRemainder = Number((totalCost - diceToDeduct).toFixed(2));
    setDiceCostRemainder(nextRemainder);

    setDice(prev => prev - diceToDeduct + doublesBonus);
    setEventProgress(prev => prev + PACING.pointsPerRoll);
    setTotalRolls(prev => prev + 1);

    // Analytics: Record roll
    currentSession.current.recordRoll(totalRoll, rolledDoubles);
    if (diceToDeduct > 0) {
      currentSession.current.recordDiceChange(-diceToDeduct);
    }
    if (doublesBonus > 0) {
      currentSession.current.recordDiceChange(doublesBonus);
    }

    if (isInJail) {
      if (rolledDoubles) {
        setJailTurnsRemaining(0);
        showNotification("Doubles! You escaped jail.", 'success', 2000);
      } else {
        const nextTurns = Math.max(0, jailTurnsRemaining - 1);
        setJailTurnsRemaining(nextTurns);
        showNotification(`Still in jail... ${nextTurns} turn${nextTurns === 1 ? '' : 's'} remaining.`, 'warning', 2000);
        return;
      }
    }

    // Walk the player piece
    setIsMoving(true);
    let currentPos = playerPosition;
    for (let i = 0; i < totalRoll; i++) {
      currentPos = (currentPos + 1) % TILE_COUNT;
      setPlayerPosition(currentPos);
      const delay = totalRoll > 8 ? BALANCE_PACING.MOVE_DELAY_FAST : BALANCE_PACING.MOVE_DELAY_NORMAL;
      await new Promise(r => setTimeout(r, delay));
    }
    setIsMoving(false);

    // Resolve landing
    resolveTileLanding(currentPos);

    // Advance power-ups and special events AFTER resolution so 1-roll durations cover the landing
    advancePowerUpRolls();
    advanceSpecialEvent();
    checkSpecialEvents(totalRolls + 1, totalUpgrades);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTileModal,
    cityTransitionActive,
    skipTurnsRemaining,
    dice,
    isMoving,
    rollValue,
    playerPosition,
    cityLevel,
    comboTarget,
    currentCombo,
    comboRewardClaimed,
    jailTurnsRemaining,
    activePowerUpEffects,
    applyRewardMultiplier,
    applyFundsMultiplier,
    diceCostRemainder,
    advancePowerUpRolls,
    advanceSpecialEvent,
    checkSpecialEvents,
    totalRolls,
    totalUpgrades
  ]);

  useEffect(() => {
    if (showStickerCollection || activeTab === 'stickers') {
      setHasNewSticker(false);
    }
  }, [showStickerCollection, activeTab]);

  useEffect(() => {
    if ((activeTileModal || cityTransitionActive) && autoRollEnabled) {
      setAutoRollEnabled(false);
      setHudMessage("Autoroll paused - event in progress");
      setTimeout(() => setHudMessage(null), 2000);
    }
  }, [activeTileModal, cityTransitionActive, autoRollEnabled]);

  useEffect(() => {
    if (CITIES[cityLevel]) {
      if (skipCityResetRef.current) {
        skipCityResetRef.current = false;
        return;
      }
      // Create a deep copy of tiles to ensure fresh state for new city
      setTiles(CITIES[cityLevel].tiles.map(tile => ({ ...tile })));
      setPlayerPosition(0); // Reset position for new city
      setActivePowerUps([]);
      setPowerUpCooldowns({});
      setPurchasedPowerUps({});
      setPositiveStreak(0);
      setDiceCostRemainder(0);
    }
  }, [cityLevel]);

  useEffect(() => {
    if (rollValue === null) return
    setDicePulse(true)
    const timer = setTimeout(() => setDicePulse(false), 1200)
    return () => clearTimeout(timer)
  }, [rollValue])

  useEffect(() => {
    if (activePowerUpEffects.diceCostMultiplier === 1 && diceCostRemainder !== 0) {
      setDiceCostRemainder(0);
    }
  }, [activePowerUpEffects.diceCostMultiplier, diceCostRemainder]);

  // Autoroll logic
  useEffect(() => {
    let timeoutId;

    // Auto-stop when out of dice
    if (autoRollEnabled && dice === 0) {
      setAutoRollEnabled(false);
      setHudMessage("Autoroll stopped - No dice left");
      setTimeout(() => setHudMessage(null), 2000);
      return;
    }

    // Only check for upgradeable landmark when we've stopped moving
    if (autoRollEnabled && !rolling && !isMoving) {
      const currentTile = tiles.find(t => t.id === playerPosition);
      const canUpgrade = currentTile && currentTile.type === 'Landmark' && currentTile.level < currentTile.maxLevel;
      const upgradeCost = canUpgrade ? currentTile.upgradeCost[currentTile.level] : 0;
      const canAffordUpgrade = canUpgrade && funds >= upgradeCost;

      // Pause autoroll only if on upgradeable landmark AND can afford it
      if (canAffordUpgrade) {
        setAutoRollEnabled(false);
        setHudMessage("Autoroll paused - Upgrade available!");
        setTimeout(() => setHudMessage(null), 2000);
        return;
      }

      // Trigger next roll when conditions are met
      if (dice > 0) {
        timeoutId = setTimeout(() => {
          handleRollDice();
        }, BALANCE_PACING.ROLL_DELAY);
      }
    }

    // Cleanup timeout on unmount or when autoroll disabled
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRollEnabled, rolling, isMoving, dice, playerPosition]);

  // Stop autoroll when city changes
  useEffect(() => {
    if (autoRollEnabled) {
      setAutoRollEnabled(false);
    }
  }, [cityLevel]);

  // Parallax mouse tracking removed for static board

  // Staggered tile reveal on city change
  useEffect(() => {
    setShowTiles(false);
    const timer = setTimeout(() => setShowTiles(true), 100);
    return () => clearTimeout(timer);
  }, [cityLevel]);

  const handleNewGame = () => {
    showConfirm(
      "RESET ALL PROGRESS?",
      "This will permanently delete your save data, stickers, and city progress. Are you sure?",
      () => {
        // Analytics: End current session before reset
        currentSession.current.endSession(funds, dice, eventPrestigeLevel, cityLevel);
        saveSession(currentSession.current);

        // Start new session
        currentSession.current = new SessionMetrics();

        clearSave();
        // Reset all state to defaults
        setFunds(INITIAL_STATE.FUNDS);
        setDice(INITIAL_STATE.DICE);
        setShields(INITIAL_STATE.SHIELDS);
        setCityLevel(INITIAL_STATE.CITY_LEVEL);
        setEventProgress(0);
        setEventPrestigeLevel(INITIAL_STATE.PRESTIGE_LEVEL);
        setPlayerPosition(0);
        setPlayerStickers([]);
        setStickerPacksAvailable(1);
        setDust(0);
        setSetTokens(0);
        setMilestoneRewardsClaimed(Array(MILESTONES.length).fill(false));
        setSetCompletionRewardsClaimed({});
        setTotalRolls(0);
        setTotalUpgrades(0);
        setTotalShieldsCollected(0);
        setFundsTilesLanded(0);
        setLastSaved(null);
        setActiveTileModal(null);
        setPendingFortuneEffect(null);
        setSkipTurnsRemaining(0);
        setJailTurnsRemaining(0);
        setHasJailFreeCard(false);
        setHasTaxHavenPowerUp(false);
        setActivePowerUps([]);
        setPowerUpCooldowns({});
        setPurchasedPowerUps({});
        setPositiveStreak(0);
        setDiceCostRemainder(0);
        setActiveSpecialEvent(null);
        setSpecialEventDisplay(null);
        setRollsSinceLastCityEvent(0);
        setLastMilestoneRolls(0);
        setLastMilestoneUpgrades(0);
        setUpgradeBlocked(false);
        setWheelSpunThisCity(false);

        showNotification("New Game Started!", 'success', 3000);
        setAutoRollEnabled(false);
        setConfirmDialog(null);
      },
      {
        confirmText: 'RESET EVERYTHING',
        confirmColor: '#ef4444',
        confirmBorder: '#ef4444'
      }
    );
  };

  const handleClaimSetReward = (setName) => {
    const setStickers = STICKER_COLLECTION[setName];
    const ownedStickersInSet = setStickers.filter(s => playerStickers.some(ps => ps.id === s.id));
    const isSetComplete = ownedStickersInSet.length === setStickers.length;

    if (isSetComplete && !setCompletionRewardsClaimed[setName]) {
      const reward = { dice: 50, funds: 10000 };
      setDice(prev => prev + reward.dice);
      setFunds(prev => prev + reward.funds);
      setSetCompletionRewardsClaimed(prev => ({ ...prev, [setName]: true }));
      showNotification(`Set '${setName}' complete! You received ${reward.dice} dice and ${reward.funds} funds!`, 'success');
    } else if (setCompletionRewardsClaimed[setName]) {
      showNotification("You have already claimed the reward for this set.", 'warning');
    } else {
      showNotification("You have not completed this set yet.", 'info');
    }
  };

  // resolveTileLanding and handleRollDice now defined earlier with useCallback

  const claimReward = (milestoneIndex) => {
    const milestone = MILESTONES[milestoneIndex];
    if (eventProgress >= milestone.threshold && !milestoneRewardsClaimed[milestoneIndex]) {
      const scaledAmount = getScaledReward(milestone.reward.amount, eventPrestigeLevel);

      // Analytics: Record milestone
      currentSession.current.recordMilestone();

      if (milestone.reward.type === 'funds') {
        setFunds(prev => prev + scaledAmount);
        currentSession.current.recordFundsChange(scaledAmount);
      } else if (milestone.reward.type === 'dice') {
        setDice(prev => prev + scaledAmount);
        currentSession.current.recordDiceChange(scaledAmount);
      } else if (milestone.reward.type === 'shields') {
        setShields(prev => prev + scaledAmount);
      } else if (milestone.reward.type === 'sticker_pack') {
        setStickerPacksAvailable(prev => prev + scaledAmount);
        currentSession.current.recordStickerEarned(scaledAmount * 3); // Assume 3 stickers per pack
      }
      const newMilestoneRewardsClaimed = [...milestoneRewardsClaimed];
      newMilestoneRewardsClaimed[milestoneIndex] = true;
      setMilestoneRewardsClaimed(newMilestoneRewardsClaimed);

      const rewardText = milestone.reward.type === 'funds'
        ? `$${scaledAmount.toLocaleString()} Funds`
        : milestone.reward.type === 'sticker_pack'
          ? `${scaledAmount} Sticker Pack${scaledAmount > 1 ? 's' : ''}`
          : `${scaledAmount} ${milestone.reward.type}`;
      showNotification(`Claimed ${rewardText}!`, 'success');
    } else if (milestoneRewardsClaimed[milestoneIndex]) {
      showNotification('You have already claimed this reward.', 'warning');
    }
  };

  const handleClaimAllRewards = () => {
    let totalFunds = 0;
    let totalDice = 0;
    let totalPacks = 0;
    const newClaimed = [...milestoneRewardsClaimed];

    MILESTONES.forEach((milestone, index) => {
      if (eventProgress >= milestone.threshold && !milestoneRewardsClaimed[index]) {
        const scaledAmount = getScaledReward(milestone.reward.amount, eventPrestigeLevel);
        if (milestone.reward.type === 'funds') totalFunds += scaledAmount;
        if (milestone.reward.type === 'dice') totalDice += scaledAmount;
        if (milestone.reward.type === 'sticker_pack') totalPacks += scaledAmount;
        newClaimed[index] = true;
      }
    });

    if (totalFunds > 0 || totalDice > 0 || totalPacks > 0) {
      setFunds(prev => prev + totalFunds);
      setDice(prev => prev + totalDice);
      setStickerPacksAvailable(prev => prev + totalPacks);
      setMilestoneRewardsClaimed(newClaimed);

      let claimSummary = "Claimed: ";
      if (totalFunds > 0) claimSummary += `$${totalFunds.toLocaleString()} Funds `;
      if (totalDice > 0) claimSummary += `${totalDice} Dice `;
      if (totalPacks > 0) claimSummary += `${totalPacks} Packs `;

      setHudMessage(claimSummary);
      setTimeout(() => setHudMessage(null), 3000);
      setTextPop({ x: window.innerWidth / 2, y: window.innerHeight / 2, text: "ALL CLAIMED!", color: "#fbbf24" });
      setTimeout(() => setTextPop(null), 2000);
    }
  };

  const handleAllMissionsComplete = () => {
    // Analytics: Record mission completion
    currentSession.current.recordMissionComplete();

    // Give completion bonus rewards
    const bonusFunds = 10000;
    const bonusDice = 25;
    const bonusPacks = 2;

    setFunds(prev => prev + bonusFunds);
    setDice(prev => prev + bonusDice);
    setStickerPacksAvailable(prev => prev + bonusPacks);

    // Analytics: Record rewards
    currentSession.current.recordFundsChange(bonusFunds);
    currentSession.current.recordDiceChange(bonusDice);
    currentSession.current.recordStickerEarned(bonusPacks * 3);

    setHudMessage("ALL MISSIONS COMPLETE! Bonus: $10k, 25 Dice, 2 Packs!");
    setTextPop({ x: window.innerWidth / 2, y: window.innerHeight / 2, text: "MISSIONS MASTER!", color: "#d946ef" });

    // Create confetti celebration
    addParticleEffect('confetti', window.innerWidth / 2, window.innerHeight / 3, {
      count: 25,
      distance: 150,
      duration: 1.5,
      customColors: ['#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ef4444']
    });

    // Play milestone sound
    audioManager.playSFX('milestone');

    setTimeout(() => {
      setHudMessage(null);
      setTextPop(null);
    }, 3000);
  };

  // Prestige eligibility and function
  const allMilestonesClaimed = MILESTONES.every((m, idx) =>
    eventProgress >= m.threshold && milestoneRewardsClaimed[idx]
  );
  const canPrestige = allMilestonesClaimed && eventProgress >= 120;

  const handlePrestige = () => {
    const nextPrestigeLevel = eventPrestigeLevel + 1;
    const nextMultiplier = getRewardMultiplier(nextPrestigeLevel);

    const exampleRewards = [
      `• 10 pts: ${getScaledReward(20, eventPrestigeLevel)} → ${getScaledReward(20, nextPrestigeLevel)} Dice`,
      `• 20 pts: $${getScaledReward(8000, eventPrestigeLevel).toLocaleString()} → $${getScaledReward(8000, nextPrestigeLevel).toLocaleString()} Funds`,
      `• 120 pts: $${getScaledReward(15000, eventPrestigeLevel).toLocaleString()} → $${getScaledReward(15000, nextPrestigeLevel).toLocaleString()} Funds`
    ].join('\n');

    showConfirm(
      `⭐ PRESTIGE TO LEVEL ${nextPrestigeLevel}?`,
      `Current: Prestige ${eventPrestigeLevel} (${currentMultiplier.toFixed(1)}x)\n` +
      `Next: Prestige ${nextPrestigeLevel} (${nextMultiplier.toFixed(1)}x)\n\n` +
      `Example Rewards:\n${exampleRewards}\n\n` +
      `Your event progress will reset to 0, but all future milestone rewards will be ${nextMultiplier.toFixed(1)}x better!`,
      () => {
        performPrestige(nextPrestigeLevel);
        setConfirmDialog(null);
      },
      {
        confirmText: 'PRESTIGE!',
        confirmColor: 'linear-gradient(135deg, #d946ef 0%, #9333ea 100%)',
        confirmBorder: '#d946ef',
        color: '#d946ef'
      }
    );
  };

  const performPrestige = (nextPrestigeLevel) => {

    // Stop autoroll if active
    if (autoRollEnabled) {
      resumeAutoRollAfterPrestigeRef.current = true;
      setAutoRollEnabled(false);
    }

    // Perform prestige
    setEventPrestigeLevel(nextPrestigeLevel);
    setEventProgress(0);
    setMilestoneRewardsClaimed(Array(MILESTONES.length).fill(false));

    // Celebration effects
    setHudMessage(`PRESTIGE ${nextPrestigeLevel} ACHIEVED!`);
    setTextPop({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      text: `⭐ PRESTIGE ${nextPrestigeLevel}! ⭐`,
      color: '#d946ef'
    });

    // Create fireworks celebration
    addParticleEffect('fireworks', window.innerWidth / 2, window.innerHeight / 2, {
      count: 30,
      distance: 120,
      duration: 1.2,
      customColors: ['#fbbf24', '#a855f7', '#3b82f6']
    });

    // Play city unlock sound (prestige is like unlocking a new level)
    audioManager.playSFX('cityUnlock');

    setTimeout(() => {
      setHudMessage(null);
      setTextPop(null);
    }, 3000);

    if (resumeAutoRollAfterPrestigeRef.current) {
      setTimeout(() => {
        if (diceRef.current > 0) {
          setAutoRollEnabled(true);
        }
        resumeAutoRollAfterPrestigeRef.current = false;
      }, 300);
    }
  };

  useEffect(() => {
    if (canPrestige && !autoPrestigeTriggeredRef.current) {
      autoPrestigeTriggeredRef.current = true;
      performPrestige(eventPrestigeLevel + 1);
    }

    if (!canPrestige) {
      autoPrestigeTriggeredRef.current = false;
    }
  }, [canPrestige, eventPrestigeLevel]);

  const handleCityTransition = (targetCityLevel) => {
    // 1. Close confirmation dialog
    setConfirmDialog(null);

    // 2. Start transition animation
    setTargetCity(targetCityLevel);
    setCityTransitionActive(true);
  };

  const handleCityTransitionComplete = () => {
    // Called after animation completes
    // 1. Update city level
    setCityLevel(targetCity);
    setPlayerPosition(0);

    // 2. Reset ephemeral state
    setStickerPacksAvailable(prev => prev + 1); // Bonus pack for new city
    setWheelSpunThisCity(false);

    // 3. Show welcome notification
    showNotification(`Welcome to ${CITIES[targetCity].name}! +1 Sticker Pack!`, 'success', 5000);

    // 4. Deactivate transition
    setCityTransitionActive(false);
    setTargetCity(null);
  };

  // Helper function to add particle effects
  const addParticleEffect = (type, x, y, props = {}) => {
    const id = Date.now() + Math.random();
    const particleEffect = {
      id,
      type,
      x,
      y,
      cityLevel,
      ...props
    };

    setActiveParticles(prev => [...prev, particleEffect]);

    // Auto-remove after duration
    const duration = (props.duration || 1) * 1000 + 500; // Add buffer
    setTimeout(() => {
      setActiveParticles(prev => prev.filter(p => p.id !== id));
    }, duration);
  };

  const handlePurchasePowerUp = (powerUpId) => {
    const powerUp = powerUpConfigById.get(powerUpId);
    if (!powerUp) return;

    if (powerUp.cost === 0 && powerUp.trigger) {
      showNotification(`${powerUp.name} triggers automatically.`, 'info', 2000);
      return;
    }

    if (activePowerUpMap.has(powerUpId)) {
      showNotification(`${powerUp.name} is already active.`, 'warning', 2000);
      return;
    }

    if (powerUp.maxPerCity && purchasedPowerUps[powerUpId]) {
      showNotification(`${powerUp.name} already owned in this city.`, 'warning', 2000);
      return;
    }

    const cooldownUntil = powerUpCooldowns[powerUpId];
    if (cooldownUntil && cooldownUntil > Date.now()) {
      showNotification(`${powerUp.name} is cooling down.`, 'warning', 2000);
      return;
    }

    const cost = getPowerUpCost(powerUp, cityLevel);
    if (funds < cost) {
      showNotification('Not enough funds for this power-up.', 'warning', 2000);
      return;
    }

    if (cost > 0) {
      setFunds(prev => Math.max(0, prev - cost));
      currentSession.current.recordFundsChange(-cost);
    }

    if (powerUp.effect?.shields) {
      const shieldGain = Math.max(1, powerUp.effect.shields);
      setShields(prev => {
        const maxShields = ECONOMY.MAX_SHIELDS;
        const next = Math.min(maxShields, prev + shieldGain);
        const gained = next - prev;
        if (gained > 0) currentSession.current.recordShieldGained(gained);
        return next;
      });
      showNotification(`${powerUp.name}: +${shieldGain} Shields`, 'success', 2500);
    }

    if (powerUp.duration !== undefined) {
      activatePowerUp(powerUpId);
    }

    if (powerUp.maxPerCity) {
      setPurchasedPowerUps(prev => ({ ...prev, [powerUpId]: true }));
    }

    if (powerUp.cooldown) {
      setPowerUpCooldowns(prev => ({ ...prev, [powerUpId]: Date.now() + powerUp.cooldown * 1000 }));
    }
  };

  const handleLotteryResult = (netGain) => {
    if (netGain === 0) return;
    const comboMultiplier = getComboMultiplier(comboChain.count);
    const adjustedGain = Math.round(applyRewardMultiplier(applyFundsMultiplier(netGain)) * (netGain > 0 ? comboMultiplier : 1));
    setFunds(prev => Math.max(0, prev + adjustedGain));
    currentSession.current.recordFundsChange(adjustedGain);
    if (adjustedGain > 0) {
      showNotification(`Lottery win! +$${adjustedGain.toLocaleString()}${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
      registerPositiveOutcome(true);
    } else {
      showNotification(`Lottery loss: -$${Math.abs(adjustedGain).toLocaleString()}`, 'warning', 3000);
      registerPositiveOutcome(false);
    }
  };

  const handleTaxResult = (taxDelta) => {
    if (taxDelta === 0) {
      if (hasTaxHavenPowerUp) {
        setHasTaxHavenPowerUp(false);
      }
      showNotification('Tax avoided!', 'success', 2500);
      registerPositiveOutcome(true);
      return;
    }
    setFunds(prev => Math.max(0, prev + taxDelta));
    currentSession.current.recordFundsChange(taxDelta);
    showNotification(`Tax paid: -$${Math.abs(taxDelta).toLocaleString()}`, 'warning', 3000);
    registerPositiveOutcome(false);
  };

  const handleJailResult = (result) => {
    if (!result) return;

    if (result.type === 'bail') {
      setFunds(prev => Math.max(0, prev - result.fundsLost));
      currentSession.current.recordFundsChange(-result.fundsLost);
      setJailTurnsRemaining(0);
      showNotification(`Bail paid: -$${result.fundsLost.toLocaleString()}`, 'warning', 3000);
      registerPositiveOutcome(false);
    }

    if (result.type === 'card') {
      setHasJailFreeCard(false);
      setJailTurnsRemaining(0);
      showNotification('Used Get Out of Jail Free card!', 'success', 3000);
      registerPositiveOutcome(false);
    }

    if (result.type === 'stay') {
      setJailTurnsRemaining(result.turnsSkipped || 0);
      showNotification(`Jail time: ${result.turnsSkipped} turns`, 'warning', 3000);
      registerPositiveOutcome(false);
    }
  };

  const applyTeleport = (offset) => {
    const newPosition = (playerPosition + offset + TILE_COUNT) % TILE_COUNT;
    setPlayerPosition(newPosition);
    resolveTileLanding(newPosition);

    const tileElement = document.querySelector(`.tile-id-${newPosition}`);
    if (tileElement) {
      const rect = tileElement.getBoundingClientRect();
      addParticleEffect('sparkles', rect.left + rect.width / 2, rect.top + rect.height / 2, {
        count: 12,
        distance: 60,
        duration: 0.8
      });
    }
  };

  const applyFortuneEffect = (fortune) => {
    if (!fortune?.event?.effect) return;

    const { event, effectValue } = fortune;
    const { effect } = event;
    const value = effectValue ?? effect.value ?? 0;
    const comboMultiplier = getComboMultiplier(comboChain.count);

    switch (effect.type) {
      case 'ADD_FUNDS': {
        const adjustedFunds = Math.round(applyRewardMultiplier(applyFundsMultiplier(value)) * comboMultiplier);
        setFunds(prev => prev + adjustedFunds);
        currentSession.current.recordFundsChange(adjustedFunds);
        showNotification(`${event.name}: +$${adjustedFunds.toLocaleString()}${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
        break;
      }
      case 'LOSE_FUNDS': {
        setFunds(prev => Math.max(0, prev - value));
        currentSession.current.recordFundsChange(-value);
        showNotification(`${event.name}: -$${value.toLocaleString()}`, 'warning', 3000);
        break;
      }
      case 'ADD_DICE': {
        const adjustedDice = Math.round(applyRewardMultiplier(value) * comboMultiplier);
        setDice(prev => prev + adjustedDice);
        currentSession.current.recordDiceChange(adjustedDice);
        showNotification(`${event.name}: +${adjustedDice} Dice${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
        break;
      }
      case 'ADD_SHIELDS': {
        const adjustedShields = Math.max(1, applyRewardMultiplier(value));
        setShields(prev => {
          const maxShields = ECONOMY.MAX_SHIELDS;
          const next = Math.min(maxShields, prev + adjustedShields);
          const gained = next - prev;
          if (gained > 0) currentSession.current.recordShieldGained(gained);
          return next;
        });
        showNotification(`${event.name}: +${adjustedShields} Shields`, 'success', 3000);
        break;
      }
      case 'TELEPORT': {
        applyTeleport(value);
        showNotification(event.name, 'info', 2500);
        break;
      }
      case 'RANDOM_TELEPORT': {
        const candidates = tiles.filter(t => t.id !== playerPosition);
        const randomTile = candidates[Math.floor(Math.random() * candidates.length)];
        if (randomTile) {
          const offset = randomTile.id - playerPosition;
          applyTeleport(offset);
        }
        showNotification(event.name, 'info', 2500);
        break;
      }
      case 'SKIP_TURNS': {
        setSkipTurnsRemaining(prev => prev + value);
        showNotification(`${event.name}: Skip ${value} turn${value === 1 ? '' : 's'}`, 'warning', 3000);
        break;
      }
      case 'ACTIVATE_TAX_HAVEN': {
        setHasTaxHavenPowerUp(true);
        showNotification('Tax Haven activated (next tax waived)', 'success', 3000);
        break;
      }
      case 'ADD_JAIL_FREE_CARD': {
        setHasJailFreeCard(true);
        showNotification('Get Out of Jail Free card added', 'success', 3000);
        break;
      }
      case 'NONE':
      default:
        showNotification(event.name, 'info', 2000);
        break;
    }

    if (event.type === 'positive') {
      registerPositiveOutcome(true);
    } else {
      registerPositiveOutcome(false);
    }
  };

  const handleFortuneResult = (result) => {
    if (!result) return;
    const payload = {
      event: result.event,
      effectValue: result.effectValue
    };

    if (activeTileModal !== 'fortune') {
      applyFortuneEffect(payload);
    } else {
      setPendingFortuneEffect(payload);
    }
  };

  const handleFortuneClose = () => {
    setActiveTileModal(null);
  };

  const handleSlotResult = (netGain) => {
    const comboMultiplier = getComboMultiplier(comboChain.count);
    const adjustedGain = Math.round(applyRewardMultiplier(applyFundsMultiplier(netGain)) * (netGain > 0 ? comboMultiplier : 1));
    setFunds(prev => Math.max(0, prev + adjustedGain));
    currentSession.current.recordFundsChange(adjustedGain);
    if (adjustedGain > 0) {
      showNotification(`Slot Machine win! +$${adjustedGain.toLocaleString()}${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
      registerPositiveOutcome(true);
    } else {
      showNotification(`Slot Machine: -$${Math.abs(adjustedGain).toLocaleString()}`, 'warning', 3000);
      registerPositiveOutcome(false);
    }
  };

  const handleWheelResult = (result) => {
    if (!result) return;
    setWheelSpunThisCity(true);
    const comboMultiplier = getComboMultiplier(comboChain.count);

    switch (result.type) {
      case 'funds': {
        const adjustedValue = Math.round(result.value * comboMultiplier);
        setFunds(prev => prev + adjustedValue);
        currentSession.current.recordFundsChange(adjustedValue);
        showNotification(`Wheel: +$${adjustedValue.toLocaleString()}${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
        registerPositiveOutcome(true);
        break;
      }
      case 'dice': {
        const adjustedValue = Math.round(result.value * comboMultiplier);
        setDice(prev => prev + adjustedValue);
        currentSession.current.recordDiceChange(adjustedValue);
        showNotification(`Wheel: +${adjustedValue} Dice${comboMultiplier > 1 ? ` (Combo x${comboMultiplier})` : ''}`, 'success', 3000);
        registerPositiveOutcome(true);
        break;
      }
      case 'shields':
        setShields(prev => Math.min(ECONOMY.MAX_SHIELDS, prev + result.value));
        showNotification(`Wheel: +${result.value} Shields`, 'success', 3000);
        registerPositiveOutcome(true);
        break;
      case 'power_up': {
        const powerUpKeys = Object.keys(POWER_UPS);
        const randomKey = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
        activatePowerUp(POWER_UPS[randomKey].id);
        registerPositiveOutcome(true);
        break;
      }
      case 'sticker_pack':
        setStickerPacksAvailable(prev => prev + 1);
        setHasNewSticker(true);
        showNotification('Wheel: Sticker Pack!', 'success', 3000);
        registerPositiveOutcome(true);
        break;
      case 'bankrupt': {
        const loss = result.value;
        setFunds(prev => Math.max(0, prev - loss));
        currentSession.current.recordFundsChange(-loss);
        showNotification(`BANKRUPT! Lost $${loss.toLocaleString()}`, 'warning', 3000);
        registerPositiveOutcome(false);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (pendingFortuneEffect && activeTileModal !== 'fortune') {
      applyFortuneEffect(pendingFortuneEffect);
      setPendingFortuneEffect(null);
    }
  }, [pendingFortuneEffect, activeTileModal, applyFortuneEffect]);

  const handleSendGift = (friendId) => {
    setFriends(prev => prev.map(f =>
      f.id === friendId ? { ...f, giftSent: true } : f
    ));
    showNotification("Gift sent! +1 Karma", 'success');
  };

  const handleReceiveGift = (friendId) => {
    if (dailyGiftCount >= SOCIAL_CONFIG.MAX_DAILY_GIFTS_RECEIVED) {
      showNotification("Daily gift limit reached!", 'warning');
      return;
    }

    setFriends(prev => prev.map(f =>
      f.id === friendId ? { ...f, giftReceived: false } : f
    ));
    setDailyGiftCount(prev => prev + 1);
    setDice(prev => prev + SOCIAL_CONFIG.GIFT_DICE_AMOUNT);
    currentSession.current.recordDiceChange(SOCIAL_CONFIG.GIFT_DICE_AMOUNT);
    showNotification(`Received ${SOCIAL_CONFIG.GIFT_DICE_AMOUNT} Dice!`, 'success');
  };

  const performGlobalPrestige = () => {
    // 1. Calculate new prestige level
    const nextLevel = globalPrestigeLevel + 1;
    const multiplier = getGlobalPrestigeMultiplier(nextLevel);

    // 2. Reset game state (but keep meta-progression)
    setCityLevel(1);
    setFunds(INITIAL_STATE.FUNDS);
    setDice(INITIAL_STATE.DICE);
    setShields(INITIAL_STATE.SHIELDS);
    setEventProgress(0);
    setPlayerPosition(0);

    // Reset ephemeral state
    setTotalRolls(0);
    setTotalUpgrades(0);
    setTotalShieldsCollected(0);
    setFundsTilesLanded(0);
    setActivePowerUps([]);
    setPowerUpCooldowns({});
    setPurchasedPowerUps({});

    // 3. Set new prestige level
    setGlobalPrestigeLevel(nextLevel);

    // 4. Celebration
    setHudMessage(`GLOBAL PRESTIGE ${nextLevel}!`);
    addParticleEffect('fireworks', window.innerWidth / 2, window.innerHeight / 2, {
      count: 50,
      distance: 200,
      duration: 2.0,
      customColors: ['#fbbf24', '#d946ef', '#3b82f6', '#10b981']
    });
    audioManager.playSFX('cityUnlock');

    showNotification(`Welcome to Prestige Tier ${nextLevel}! Earnings x${multiplier.toFixed(1)}`, 'success', 5000);
  };

  const handleGlobalPrestigeConfirmation = () => {
    const nextLevel = globalPrestigeLevel + 1;
    const multiplier = getGlobalPrestigeMultiplier(nextLevel);

    showConfirm(
      "🌍 GLOBAL PRESTIGE AVAILABLE!",
      `You have conquered all cities! Are you ready to ascend?\n\n` +
      `Stats for Prestige Tier ${nextLevel}:\n` +
      `• Global Income: x${multiplier.toFixed(1)}\n` +
      `• Dice Cap: Unchanged\n` +
      `• Stickers: KEPT\n` +
      `• Friends: KEPT\n\n` +
      `WARNING: City progress and funds will be RESET.`,
      () => {
        performGlobalPrestige();
        setConfirmDialog(null);
      },
      {
        confirmText: `ASCEND TO TIER ${nextLevel}`,
        confirmColor: '#fbbf24', // Gold
        confirmBorder: '#fbbf24'
      }
    );
  };

  const handleUpgradeLandmark = () => {
    if (upgradeBlocked) {
      showNotification('Construction blocks upgrades this turn!', 'warning', 2500);
      return;
    }
    const currentTile = tiles.find(t => t.id === playerPosition);
    if (!currentTile || currentTile.type !== 'Landmark' || currentTile.level >= currentTile.maxLevel) {
      return;
    }

    const cost = currentTile.upgradeCost[currentTile.level];
    if (funds >= cost) {
      setUpgradePulse(true);
      setTimeout(() => setUpgradePulse(false), 500);

      const landmarkElement = document.querySelector(`.tile-id-${currentTile.id}`);
      const rect = landmarkElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Use new particle effect system with stars
      addParticleEffect('stars', centerX, centerY, { count: 15, distance: 70, duration: 1.0 });
      setTextPop({ x: centerX, y: centerY, text: 'LEVEL UP!' });

      // Play upgrade sound
      audioManager.playSFX('upgrade');

      setTimeout(() => {
        setTextPop(null);
      }, 1000);

      setFunds(prev => prev - cost);
      const newTiles = tiles.map(t =>
        t.id === currentTile.id
          ? { ...t, level: t.level + 1 }
          : t
      );
      setTiles(newTiles);

      setTotalUpgrades(prev => prev + 1); // Increment total upgrades for mission tracker

      // Analytics: Record upgrade
      currentSession.current.recordUpgrade();
      currentSession.current.recordFundsChange(-cost);
      // Check if all landmarks are fully upgraded
      const landmarks = newTiles.filter(t => t.type === 'Landmark');
      const allMaxed = landmarks.every(l => l.level === l.maxLevel);
      if (allMaxed) {
        const nextCityLevel = cityLevel + 1;
        if (CITIES[nextCityLevel]) {
          // Calculate multiplier display
          const multipliers = {
            2: '1.4x',
            3: '1.96x',
            4: '2.74x',
            5: '3.84x'
          };

          showConfirm(
            `CITY COMPLETE!`,
            `Congratulations! You've maxed out ${CITIES[cityLevel].name}.\n\n` +
            `Ready to travel to ${CITIES[nextCityLevel].name}?\n` +
            `• New ${CITIES[nextCityLevel].name} Theme\n` +
            `• Higher Rewards (${multipliers[nextCityLevel] || '1.4x+'})\n` +
            `• New Challenges`,
            () => handleCityTransition(nextCityLevel),
            {
              confirmText: `TRAVEL TO CITY ${nextCityLevel}`,
              confirmColor: CITIES[nextCityLevel].themeColor,
              confirmBorder: CITIES[nextCityLevel].themeColor
            }
          );
        } else {
          // All cities complete - Trigger Global Prestige
          handleGlobalPrestigeConfirmation();
        }
      }

    } else {
      showNotification('Not enough funds to upgrade this landmark.', 'error');
    }
  };

  const handleMissionComplete = (reward) => {
    if (reward.type === 'funds') {
      setFunds(prev => prev + reward.amount);
      showNotification(`Mission Complete! +${reward.amount} Funds!`, 'success', 2000);
    } else if (reward.type === 'dice') {
      setDice(prev => prev + reward.amount);
      showNotification(`Mission Complete! +${reward.amount} Dice!`, 'success', 2000);
    } else if (reward.type === 'shields') {
      setShields(prev => prev + reward.amount);
      showNotification(`Mission Complete! +${reward.amount} Shields!`, 'success', 2000);
    }
  };

  const openStickerPack = () => {
    if (stickerPacksAvailable <= 0) {
      setHudMessage("NO PACKS!");
      return;
    }

    setStickerPacksAvailable(prev => prev - 1);
    const packType = STICKER_PACK_CONTENTS.BASIC;
    const newStickers = [];
    let duplicatesFound = 0;
    let dustGained = 0;

    for (let i = 0; i < packType.stickersPerPack; i++) {
      const randomStickerIndex = Math.floor(Math.random() * ALL_STICKERS.length);
      const newSticker = { ...ALL_STICKERS[randomStickerIndex] };

      const isDuplicate = playerStickers.some(existingSticker => existingSticker.id === newSticker.id) ||
        newStickers.some(s => s.id === newSticker.id);

      if (isDuplicate) {
        duplicatesFound++;
        if (newSticker.rarity === 'Common') dustGained += 10;
        else if (newSticker.rarity === 'Rare') dustGained += 20;
        else if (newSticker.rarity === 'Epic') dustGained += 50;
      } else {
        newStickers.push(newSticker);
        setHasNewSticker(true);
      }
    }

    setPlayerStickers(prev => [...prev, ...newStickers]);
    setDust(prev => prev + dustGained);

    let setTokensGained = 0;
    if (dustGained > 0) {
      setTokensGained = Math.floor(dustGained / 50);
      setSetTokens(prev => prev + setTokensGained);
    }

    if (newStickers.length > 0) {
      setHudMessage(`GOT ${newStickers.length} NEW STICKERS!`);
      setTextPop({ x: window.innerWidth / 2, y: window.innerHeight / 2, text: "NEW STICKERS!", color: cityData.themeColor });
    } else {
      setHudMessage(`DUPLICATES: +${dustGained} DUST`);
      setTextPop({ x: window.innerWidth / 2, y: window.innerHeight / 2, text: "DUPLICATES", color: "#94a3b8" });
    }
    setTimeout(() => setTextPop(null), 1500);
  };

  const redeemSetToken = () => {
    if (setTokens <= 0) {
      showNotification("No Set Tokens available!", 'warning');
      return;
    }

    showConfirm(
      "Redeem Set Token?",
      "Are you sure you want to redeem a set token? You'll receive a random missing sticker.",
      () => {
        performSetTokenRedemption();
        setConfirmDialog(null);
      }
    );
  };

  const performSetTokenRedemption = () => {

    const missingStickers = [];
    ['Common', 'Rare', 'Epic'].forEach(rarity => {
      for (let i = 0; i < 100; i++) {
        const name = `${rarity} Sticker ${i}`;
        if (!playerStickers.some(s => s.name === name)) {
          missingStickers.push({ rarity, name, id: Math.random() });
        }
      }
    });

    if (missingStickers.length === 0) {
      showNotification("You have collected all stickers!", 'success');
      return;
    }

    const randomSticker = missingStickers[Math.floor(Math.random() * missingStickers.length)];
    setPlayerStickers(prev => [...prev, randomSticker]);
    setSetTokens(prev => prev - 1);
    showNotification(`Redeemed Token! Got: ${randomSticker.name}`, 'success');
  };

  const craftSpecificSticker = () => {
    const cost = CRAFTING_COSTS[craftRarity];
    if (dust < cost) {
      showNotification(`Not enough dust! Need ${cost}.`, 'error');
      return;
    }

    showConfirm(
      "Craft Sticker?",
      `Are you sure you want to craft this sticker for ${cost} dust?`,
      () => {
        performStickerCraft(cost, craftRarity, craftIndex);
        setConfirmDialog(null);
      }
    );
  };

  const performStickerCraft = (cost, craftRarity, craftIndex) => {

    const name = `${craftRarity} Sticker ${craftIndex}`;
    if (playerStickers.some(s => s.name === name)) {
      showNotification("You already have this sticker!", 'warning');
      return;
    }

    const newSticker = { id: Math.random(), rarity: craftRarity, name };
    setPlayerStickers(prev => [...prev, newSticker]);
    setDust(prev => prev - cost);
    showNotification(`Crafted: ${name}`, 'success');
  };

  const getTilePosition = (index) => {
    // Match 3D board positioning: 6x6 grid, bottom-right is START (tile 0)
    const max = 6;
    const min = 1;

    if (index <= 5) {
      // Bottom side (tiles 0-5, right to left) - matches 3D board
      return { gridRow: max, gridColumn: max - index };
    }
    if (index <= 10) {
      // Left side (tiles 5-10, bottom to top) - matches 3D board
      return { gridRow: max - (index - 5), gridColumn: min };
    }
    if (index <= 15) {
      // Top side (tiles 10-15, left to right) - matches 3D board
      return { gridRow: min, gridColumn: min + (index - 10) };
    }
    // Right side (tiles 15-20, top to bottom) - matches 3D board
    return { gridRow: min + (index - 15), gridColumn: max };
  };

  const renderedTiles = useMemo(() => tiles.map((tile, index) => {
    const position = getTilePosition(tile.id);
    const isLanded = playerPosition === tile.id;
    const effectClass = isLanded && tileEffect ? `tile-effect-${tileEffect.type}` : '';
    const isCorner = tile.id === 0 || tile.id === 5 || tile.id === 10 || tile.id === 15;

    // Determine tile type class
    let tileTypeClass = '';
    if (tile.type === 'Funds') tileTypeClass = 'board-tile-funds';
    else if (tile.type === 'Rent') tileTypeClass = 'board-tile-rent';
    else if (tile.type === 'Bonus') tileTypeClass = 'board-tile-bonus';
    else if (tile.type === 'Lottery') tileTypeClass = 'board-tile-lottery';
    else if (tile.type === 'Tax') tileTypeClass = 'board-tile-tax';
    else if (tile.type === 'Jail') tileTypeClass = 'board-tile-jail';
    else if (tile.type === 'Fortune') tileTypeClass = 'board-tile-fortune';
    else if (tile.type === 'Heist') tileTypeClass = 'board-tile-heist';
    else if (tile.type === 'Shutdown') tileTypeClass = 'board-tile-shutdown';
    else if (tile.type === 'StickerPack') tileTypeClass = 'board-tile-sticker';
    else if (tile.type === 'Shield') tileTypeClass = 'board-tile-shield';
    else if (tile.type === 'Dice') tileTypeClass = 'board-tile-free';
    else if (tile.type === 'Card') tileTypeClass = 'board-tile-card';
    else if (tile.type === 'Landmark') tileTypeClass = 'board-tile-card';

    // Display label - show type for regular tiles, name for corners
    const displayLabel = isCorner ? tile.name : tile.type.toUpperCase();

    return (
      <motion.div
        key={tile.id}
        style={{
          ...position,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          pointerEvents: 'auto',
          zIndex: use3DBoard ? 10 : 'auto',
          // Make tiles slightly visible for debugging alignment, but still clickable
          opacity: use3DBoard ? 0.1 : 1, // Changed from 0 to 0.1 for debugging
          position: 'absolute', // Ensure absolute positioning for proper alignment
          width: '100%', // Fill grid cell
          height: '100%', // Fill grid cell
          display: 'flex', // Enable flexbox for content
          alignItems: 'center', // Center content
          justifyContent: 'center' // Center content
        }}
        className={`${use3DBoard ? '' : 'board-tile'} ${tileTypeClass} tile-id-${tile.id} ${isLanded ? 'board-tile-active' : ''} ${tileGlow === tile.type ? 'tile-glow' : ''} ${effectClass}`}
        initial={false}
        animate={{
          scale: 1,
          opacity: use3DBoard ? 0.1 : 1, // Changed from 0 to 0.1 for debugging
          z: isLanded ? 30 : 10
        }}
        whileHover={{
          scale: 1.05,
          z: 25,
          rotateZ: [0, -1, 1, 0],
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
          }
        }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        onClick={() => {
          // Handle tile clicks for both 2D and 3D modes
          if (tile.type === 'Landmark' && tile.level < tile.maxLevel) {
            handleUpgradeLandmark();
          }
        }}
      >
        {!use3DBoard && (
          <span className="board-tile-label">{displayLabel}</span>
        )}
        {!use3DBoard && tile.type === 'Landmark' && (
          <div style={{
            fontSize: '11px',
            marginTop: '4px',
            fontWeight: 'bold',
            color: tile.level === tile.maxLevel ? '#34d399' : '#fbbf24',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span>{tile.level}/{tile.maxLevel}</span>
            {tile.level === tile.maxLevel && (
              <span style={{ fontSize: '9px', color: '#34d399' }}>MAX</span>
            )}
          </div>
        )}
        {use3DBoard && isLanded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            zIndex: 100,
            pointerEvents: 'none'
          }}>
            {displayLabel}
          </div>
        )}
      </motion.div>
    );
  }), [tiles, playerPosition, tileEffect, tileGlow, use3DBoard]);



  const currentTile = tiles.find(t => t.id === playerPosition);
  const canUpgrade = currentTile && currentTile.type === 'Landmark' && currentTile.level < currentTile.maxLevel;
  const upgradeCost = canUpgrade ? currentTile.upgradeCost[currentTile.level] : 0;
  const eventLevel = Math.floor(eventProgress / 5) + 1;
  const totalStickers = playerStickers.length;
  const stickerCompletion = Math.min(
    100,
    Math.round((totalStickers / ALL_STICKERS.length) * 100)
  );
  const nextMilestone = MILESTONES.find((milestone) => eventProgress < milestone.threshold) || MILESTONES[MILESTONES.length - 1];
  const nextRewardLabel = nextMilestone.reward.type === 'funds'
    ? `$${nextMilestone.reward.amount.toLocaleString()} Funds`
    : nextMilestone.reward.type === 'sticker_pack'
      ? `${nextMilestone.reward.amount} Sticker Pack`
      : `+${nextMilestone.reward.amount} ${nextMilestone.reward.type}`;
  const nextTiles = [1, 2, 3]
    .map((offset) => tiles[(playerPosition + offset) % TILE_COUNT]?.name)
    .filter(Boolean)
    .join(' • ');



  return (
    <>
      {/* Phase 10: Global 3D Scene */}
      <GameScene>
        <group position={[0, 2.5, 0]}>
          <DiceGroup rolling={rolling} value1={die1Value} value2={die2Value} />
        </group>
        <InstancedParticles ref={particleSystemRef} />
        <Board3D
          ref={board3DRef}
          tiles={tiles}
          playerPosition={playerPosition}
          isMoving={isMoving}
          themeColor={cityData.themeColor}
        />
        <VFXManager ref={vfxRef} />
      </GameScene>

      <Notification notification={notification} onClose={() => setNotification(null)} />
      <ConfirmDialog
        dialog={confirmDialog}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />
      <section className={`board-section board-section-fit ${cityData.backdropClass}`} style={{ position: 'relative', zIndex: 10 }}>
        {/* Dynamic Progression Backdrop */}
        <div className="city-backdrop -z-10" />
        <div className="city-grid -z-10" />
        <div className="city-glow -z-10" style={{ background: 'transparent' }} />

        {/* Active particle effects */}
        {activeParticles.map(particle => (
          <ParticleEffect
            key={particle.id}
            type={particle.type}
            x={particle.x}
            y={particle.y}
            count={particle.count || 20}
            cityLevel={particle.cityLevel}
            size={particle.size || 8}
            duration={particle.duration || 1}
            distance={particle.distance || 100}
            customColors={particle.customColors}
          />
        ))}
        {textPop && <TextPop x={textPop.x} y={textPop.y} text={textPop.text} />}

        {/* Audio Controls */}
        <AudioControls />

        <div className="board-shell">
          <div className="board-layout-main">
            {/* Main Board Area (Left/Center) */}
            <div className={`board-stage ${dicePulse ? 'board-stage-bounce' : ''} ${rolling ? 'board-stage-rolling' : ''} ${upgradePulse ? 'upgrade-pulse' : ''}`}>
              <div className={`board-grid ${rolling ? 'board-zoom' : ''}`}>
                {renderedTiles}
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale: isMoving ? [1, 1.3, 1] : 1,
                    y: isMoving ? [0, -30, 0] : 0,
                    rotateZ: isMoving ? [0, 360, 720] : 0,
                  }}
                  transition={{
                    layout: { type: "spring", stiffness: 400, damping: 35 },
                    scale: { duration: 0.3, ease: "easeOut" },
                    y: { duration: 0.3, ease: "easeOut" },
                    rotateZ: { duration: 0.6, ease: "linear" },
                  }}
                  className="player-piece"
                  style={{
                    ...getTilePosition(playerPosition),
                    zIndex: 50,
                    pointerEvents: 'none',
                    backgroundColor: cityData.themeColor,
                    boxShadow: 'none'
                  }}
                >
                  <motion.div
                    className="player-piece-glow"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0, 0, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      inset: '-10px',
                      borderRadius: '50%',
                      background: 'transparent',
                      filter: 'none',
                      zIndex: -1,
                    }}
                  />
                </motion.div>
                <div className="board-center">
                  {/* Phase 10: Dice moved to Global GameScene */}
                  {/* <ThreeDice rolling={rolling} value1={die1Value} value2={die2Value} /> */}
                  <div style={{ height: '100%', width: '100%' }} />

                  <ComboTracker comboChain={comboChain} getComboMultiplier={getComboMultiplier} />

                  <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
                    <div className="board-center-logo">City Slacker</div>
                    <div className="board-center-subtitle" style={{ color: cityData.themeColor }}>{cityData.name}</div>
                  </div>

                  {/* Board Status - Compact */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '10px', opacity: 0.8 }}>
                    <span>Roll: <strong>{rollValue ?? 0}</strong></span>
                    <span>•</span>
                    <span>Tile: <strong>{stoppedOnName}</strong></span>
                    {diceStreak > 1 && (
                      <>
                        <span>•</span>
                        <span className="dice-streak">Streak: x{diceStreak}</span>
                      </>
                    )}
                  </div>
                  {hudMessage && <div className="hud-message" style={{ marginTop: '8px', fontSize: '11px', fontWeight: 'bold', color: cityData.themeColor }}>{hudMessage}</div>}

                  <div className="board-center-layout" style={{ position: 'relative', zIndex: 10, marginTop: 'auto', width: '100%', maxWidth: '280px' }}>
                    <div className="board-mini-panel" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)', border: `1px solid ${cityData.themeColor}22` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
                        <p className="board-mini-label">Event Progress</p>
                        <p className="board-mini-value" style={{ fontSize: '13px' }}>{eventProgress} / {nextMilestone.threshold}</p>
                      </div>
                      <div className="board-mini-progress" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <span
                          className="board-mini-progress-fill"
                          style={{ width: `${Math.min(100, (eventProgress / nextMilestone.threshold) * 100)}%`, backgroundColor: cityData.themeColor }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <p className="board-mini-text" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Next: {nextRewardLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Controls (Right Column) */}
            <div className={`board-info ${upgradePulse ? 'upgrade-pulse' : ''}`}>
              <div className="board-panel">
                <div className="board-panel-header">
                  <div>
                    <p className="board-panel-label" style={{ color: cityData.themeColor }}>City Level {cityLevel || 1}</p>
                    <p className="board-panel-title">{cityData.name}</p>
                  </div>
                </div>

                <div className="board-metric-summary">
                  <div className="metric-chip">
                    <span className="label">Funds</span>
                    <span className="value">${funds.toLocaleString()}</span>
                  </div>
                  <div className="metric-chip">
                    <span className="label">Dice</span>
                    <span className="value">{dice}</span>
                  </div>
                  <div className="metric-chip">
                    <span className="label">Shields</span>
                    <span className="value">{shields}/{ECONOMY.MAX_SHIELDS}</span>
                  </div>
                  <div className="metric-chip">
                    <span className="label">Stickers</span>
                    <span className="value">
                      {totalStickers}/{ALL_STICKERS.length}
                      {stickerPacksAvailable > 0 && (
                        <span className="pack-count-badge" style={{ color: cityData.themeColor, marginLeft: '6px', fontSize: '11px' }}>
                          ({stickerPacksAvailable}P)
                        </span>
                      )}
                      {hasNewSticker && <span className="new-badge-dot" style={{ backgroundColor: cityData.themeColor }}>NEW</span>}
                    </span>
                  </div>
                </div>

                <PowerUpIndicator activePowerUps={activePowerUps} />

                {activeSpecialEvent && (
                  <div data-testid="special-event-indicator" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: `${activeSpecialEvent.color}22`,
                    border: `1px solid ${activeSpecialEvent.color}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: activeSpecialEvent.color,
                    margin: '4px 0',
                  }}>
                    <span>{activeSpecialEvent.icon}</span>
                    <span style={{ fontWeight: 'bold' }}>{activeSpecialEvent.name}</span>
                    <span style={{ opacity: 0.8 }}>({activeSpecialEvent.remainingRolls} rolls)</span>
                  </div>
                )}

                {/* Compact Action Bar */}
                <div className="board-actions-compact">
                  <button
                    className="action-btn action-btn-primary"
                    onClick={handleRollDice}
                    disabled={rolling || isMoving || dice <= 0 || autoRollEnabled || activeTileModal || cityTransitionActive}
                    style={{
                      backgroundColor: cityData.themeColor,
                      color: '#000',
                      opacity: (rolling || isMoving || dice <= 0 || autoRollEnabled || activeTileModal || cityTransitionActive) ? 0.5 : 1
                    }}
                    title="Roll Dice"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {rolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll'}
                  </button>

                  <button
                    className={`action-btn ${autoRollEnabled ? 'action-btn-active' : 'action-btn-secondary'}`}
                    onClick={() => setAutoRollEnabled(!autoRollEnabled)}
                    disabled={dice <= 0}
                    style={autoRollEnabled
                      ? {
                        backgroundColor: cityData.themeColor,
                        color: '#000',
                        animation: 'pulse 2s ease-in-out infinite'
                      }
                      : {
                        borderColor: cityData.themeColor,
                        color: cityData.themeColor,
                        opacity: dice <= 0 ? 0.5 : 1
                      }
                    }
                    title={autoRollEnabled ? 'Auto Roll: ON' : 'Auto Roll: OFF'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {autoRollEnabled ? 'ON' : 'Auto'}
                  </button>

                  <button
                    className="action-btn action-btn-secondary action-btn-upgrade"
                    onClick={handleUpgradeLandmark}
                    disabled={!canUpgrade || funds < upgradeCost || rolling}
                    style={{
                      borderColor: cityData.themeColor,
                      color: cityData.themeColor,
                      opacity: (!canUpgrade || funds < upgradeCost || rolling) ? 0.5 : 1
                    }}
                    title={canUpgrade
                      ? `Upgrade ${currentTile.name} ${currentTile.level}→${currentTile.level + 1} ($${upgradeCost.toLocaleString()})`
                      : currentTile?.type === 'Landmark' && currentTile.level === currentTile.maxLevel
                        ? `${currentTile.name} MAX`
                        : 'Land on Landmark'
                    }
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {canUpgrade
                      ? `${currentTile.level}→${currentTile.level + 1} $${(upgradeCost / 1000).toFixed(0)}k`
                      : currentTile?.type === 'Landmark' && currentTile.level === currentTile.maxLevel
                        ? 'MAX'
                        : 'Upgrade'
                    }
                  </button>

                  <button
                    className="action-btn action-btn-secondary"
                    onClick={() => setShowAnalytics(true)}
                    style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                    title="View session analytics"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </button>

                  <button
                    className="action-btn action-btn-secondary"
                    onClick={handleNewGame}
                    style={{ borderColor: '#ef4444', color: '#ef4444' }}
                    title="Reset everything and start over"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Reset
                  </button>
                </div>

                {lastSaved && (
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: '4px', paddingRight: '12px' }}>
                    Autosaved at {lastSaved}
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button
                    className={`tab-btn ${activeTab === 'event' ? 'tab-btn-active' : ''}`}
                    onClick={() => setActiveTab('event')}
                    style={activeTab === 'event' ? { borderBottomColor: cityData.themeColor, color: cityData.themeColor } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Events</span>
                    {eventPrestigeLevel > 0 && <span className="tab-badge" style={{ backgroundColor: '#d946ef' }}>P{eventPrestigeLevel}</span>}
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'missions' ? 'tab-btn-active' : ''}`}
                    onClick={() => setActiveTab('missions')}
                    style={activeTab === 'missions' ? { borderBottomColor: cityData.themeColor, color: cityData.themeColor } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Missions</span>
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'stickers' ? 'tab-btn-active' : ''}`}
                    onClick={() => setActiveTab('stickers')}
                    style={activeTab === 'stickers' ? { borderBottomColor: cityData.themeColor, color: cityData.themeColor } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Stickers</span>
                    {hasNewSticker && <span className="tab-badge-dot" style={{ backgroundColor: cityData.themeColor }}></span>}
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'powerups' ? 'tab-btn-active' : ''}`}
                    onClick={() => setActiveTab('powerups')}
                    style={activeTab === 'powerups' ? { borderBottomColor: cityData.themeColor, color: cityData.themeColor } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Power-Ups</span>
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'social' ? 'tab-btn-active' : ''}`}
                    onClick={() => setActiveTab('social')}
                    style={activeTab === 'social' ? { borderBottomColor: cityData.themeColor, color: cityData.themeColor } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Social</span>
                    {friends.some(f => f.giftReceived) && <span className="tab-badge-dot" style={{ backgroundColor: cityData.themeColor }}></span>}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === 'event' && (
                    <div className="tab-panel">
                      {eventPrestigeLevel > 0 && (
                        <div className="prestige-badge">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>Prestige {eventPrestigeLevel} - {currentMultiplier.toFixed(1)}x Rewards</span>
                        </div>
                      )}

                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">{eventProgress} / {MILESTONES[MILESTONES.length - 1].threshold}</span>
                      </div>
                      <div className="board-mini-progress">
                        <span
                          className="board-mini-progress-fill"
                          style={{ width: `${Math.min(100, (eventProgress / MILESTONES[MILESTONES.length - 1].threshold) * 100)}%`, backgroundColor: cityData.themeColor }}
                        />
                      </div>

                      {MILESTONES.some((m, idx) => eventProgress >= m.threshold && !milestoneRewardsClaimed[idx]) && (
                        <button
                          className="btn-claim-all"
                          onClick={handleClaimAllRewards}
                          style={{ backgroundColor: cityData.themeColor }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          CLAIM ALL AVAILABLE
                        </button>
                      )}

                      <div className="milestones-list">
                        {MILESTONES.map((milestone, index) => {
                          const scaledAmount = getScaledReward(milestone.reward.amount, eventPrestigeLevel);
                          const rewardText = milestone.reward.type === 'funds'
                            ? `$${scaledAmount.toLocaleString()}`
                            : milestone.reward.type === 'sticker_pack'
                              ? `${scaledAmount} Pack${scaledAmount > 1 ? 's' : ''}`
                              : `${scaledAmount} ${milestone.reward.type}`;

                          return (
                            <div key={index} className="milestone-item">
                              <div className="milestone-info">
                                <span className={`milestone-threshold ${eventProgress >= milestone.threshold ? 'milestone-done' : ''}`}>
                                  {milestone.threshold} pts
                                </span>
                                <span className="milestone-reward">{rewardText}</span>
                              </div>
                              <button
                                className="milestone-claim-btn"
                                onClick={() => claimReward(index)}
                                disabled={eventProgress < milestone.threshold || milestoneRewardsClaimed[index]}
                                style={!milestoneRewardsClaimed[index] && eventProgress >= milestone.threshold ? { backgroundColor: cityData.themeColor, color: '#000' } : {}}
                              >
                                {milestoneRewardsClaimed[index] ? '✓' : 'Claim'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'missions' && (
                    <div className="tab-panel">
                      <MissionTracker
                        rolls={totalRolls}
                        upgrades={totalUpgrades}
                        shieldsCollected={totalShieldsCollected}
                        currentShields={shields}
                        fundsTilesLanded={fundsTilesLanded}
                        missionState={missionState}
                        setMissionState={setMissionState}
                        onMissionComplete={handleMissionComplete}
                        onAllMissionsComplete={handleAllMissionsComplete}
                        onResetAvailable={(available, handler) => {
                          setMissionResetAvailable(available);
                          setMissionResetHandler(() => handler);
                        }}
                        missionResetCount={missionState.daily.resetCount || 0}
                      />
                    </div>
                  )}

                  {activeTab === 'stickers' && (
                    <div className="tab-panel">
                      <div className="sticker-currency-bar">
                        <div className="currency-item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span>Dust: {dust}</span>
                        </div>
                        <div className="currency-item">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>Tokens: {setTokens}</span>
                        </div>
                      </div>

                      <div className="sticker-actions-grid">
                        <button
                          onClick={openStickerPack}
                          disabled={stickerPacksAvailable <= 0}
                          className="sticker-action-btn"
                          style={stickerPacksAvailable > 0 ? { backgroundColor: cityData.themeColor, color: '#000' } : {}}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>Open Pack</span>
                          <span className="sticker-count-badge">{stickerPacksAvailable}</span>
                        </button>

                        <button
                          onClick={redeemSetToken}
                          disabled={setTokens <= 0}
                          className="sticker-action-btn"
                          style={setTokens > 0 ? { borderColor: cityData.themeColor, color: cityData.themeColor } : {}}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                          <span>Redeem</span>
                        </button>
                      </div>

                      <div className="crafting-bar">
                        <select
                          value={craftRarity}
                          onChange={(e) => setCraftRarity(e.target.value)}
                          className="craft-select"
                          style={{ borderColor: cityData.themeColor }}
                        >
                          <option value="Common">Common</option>
                          <option value="Rare">Rare</option>
                          <option value="Epic">Epic</option>
                        </select>
                        <button
                          onClick={craftSpecificSticker}
                          disabled={dust < CRAFTING_COSTS[craftRarity]}
                          className="craft-btn"
                          style={dust >= CRAFTING_COSTS[craftRarity] ? { backgroundColor: cityData.themeColor, color: '#000' } : {}}
                        >
                          Craft ({CRAFTING_COSTS[craftRarity]} Dust)
                        </button>
                      </div>

                      <div className="sticker-sets-list">
                        {Object.entries(STICKER_COLLECTION).map(([setName, stickers]) => {
                          const ownedCount = stickers.filter(s => playerStickers.some(ps => ps.id === s.id)).length;
                          const isSetComplete = ownedCount === stickers.length;
                          const isRewardClaimed = setCompletionRewardsClaimed[setName];
                          const setProgress = (ownedCount / stickers.length) * 100;

                          return (
                            <div key={setName} className="sticker-set-item">
                              <div className="set-header">
                                <span className="set-name">{setName}</span>
                                <span className="set-count">{ownedCount}/{stickers.length}</span>
                              </div>
                              <div className="board-mini-progress">
                                <div
                                  className="board-mini-progress-fill"
                                  style={{ width: `${setProgress}%`, backgroundColor: isSetComplete ? cityData.themeColor : '#64748b' }}
                                />
                              </div>
                              <div className="set-footer">
                                <span className="set-reward">50 Dice, $10k</span>
                                {isSetComplete && !isRewardClaimed && (
                                  <button
                                    onClick={() => handleClaimSetReward(setName)}
                                    className="set-claim-btn"
                                    style={{ backgroundColor: cityData.themeColor, color: '#000' }}
                                  >
                                    CLAIM
                                  </button>
                                )}
                                {isRewardClaimed && <span className="set-claimed">✓ Claimed</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'powerups' && (
                    <div className="tab-panel">
                      <PowerUpShop
                        cityLevel={cityLevel}
                        funds={funds}
                        activePowerUps={activePowerUps}
                        cooldowns={powerUpCooldowns}
                        purchasedPowerUps={purchasedPowerUps}
                        onPurchase={handlePurchasePowerUp}
                      />
                    </div>
                  )}

                  {activeTab === 'social' && (
                    <div className="tab-panel">
                      <SocialTab
                        friends={friends}
                        cityLevel={cityLevel}
                        netWorth={funds} // Simple net worth proxy for now
                        themeColor={cityData.themeColor}
                        onSendGift={handleSendGift}
                        onReceiveGift={handleReceiveGift}
                        dailyGiftCount={dailyGiftCount}
                      />
                    </div>
                  )}
                </div>

                {/* Floating Action Buttons */}
                {false && canPrestige && (
                  <button
                    className="fab-prestige"
                    onClick={handlePrestige}
                    style={{
                      background: 'linear-gradient(135deg, #d946ef 0%, #9333ea 100%)',
                      boxShadow: '0 0 20px rgba(217, 70, 239, 0.5)',
                      bottom: missionResetAvailable ? '80px' : '24px'
                    }}
                    title="Prestige available! Reset for enhanced rewards"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>PRESTIGE</span>
                  </button>
                )}

                {missionResetAvailable && (
                  <button
                    className="fab-mission-reset"
                    onClick={missionResetHandler}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
                    }}
                    title="Start new mission cycle"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>NEW CYCLE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Viewer Modal */}
      {showAnalytics && (
        <AnalyticsViewer onClose={() => setShowAnalytics(false)} />
      )}

      {/* Tile Modals */}
      {activeTileModal === 'lottery' && (
        <LotteryTile
          cityLevel={cityLevel}
          currentFunds={funds}
          guaranteeWin={!!activePowerUpEffects.guaranteeLotteryWin}
          onResult={handleLotteryResult}
          onClose={() => setActiveTileModal(null)}
        />
      )}
      {activeTileModal === 'tax' && (
        <TaxTile
          cityLevel={cityLevel}
          currentFunds={funds}
          hasTaxHavenPowerUp={hasTaxHavenPowerUp || !!activePowerUpEffects.blockTax}
          onResult={handleTaxResult}
          onClose={() => setActiveTileModal(null)}
        />
      )}
      {activeTileModal === 'jail' && (
        <JailTile
          cityLevel={cityLevel}
          currentFunds={funds}
          hasJailFreeCard={hasJailFreeCard}
          onResult={handleJailResult}
          onClose={() => setActiveTileModal(null)}
        />
      )}
      {activeTileModal === 'fortune' && (
        <FortuneTile
          cityLevel={cityLevel}
          onResult={handleFortuneResult}
          onClose={handleFortuneClose}
        />
      )}
      {activeTileModal === 'slot_machine' && (
        <SlotMachine
          cityLevel={cityLevel}
          currentFunds={funds}
          onResult={handleSlotResult}
          onClose={() => setActiveTileModal(null)}
        />
      )}
      {activeTileModal === 'wheel' && (
        <WheelOfFortune
          cityLevel={cityLevel}
          currentFunds={funds}
          onResult={handleWheelResult}
          onClose={() => setActiveTileModal(null)}
        />
      )}

      {/* Special Event Modal */}
      {specialEventDisplay && (
        <SpecialEventModal
          event={specialEventDisplay}
          onClose={() => setSpecialEventDisplay(null)}
        />
      )}

      {/* City Transition Animation */}
      <CityTransition
        targetCityLevel={targetCity}
        onComplete={handleCityTransitionComplete}
        isActive={cityTransitionActive}
      />
    </>
  );
};
