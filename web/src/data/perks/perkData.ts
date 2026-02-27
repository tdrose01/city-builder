/**
 * Perk Tree Data Configuration
 * Defines nodes, dependencies, and effects for the Nexus Perk Tree
 */

export type PerkCategory = 'architect' | 'explorer' | 'enforcer';

export interface PerkNode {
  id: string;
  category: PerkCategory;
  name: string;
  description: string;
  cost: number;
  icon: string;
  dependsOn?: string; // ID of required perk
  effect: {
    type: string;
    value: number;
  };
}

export const PERK_TREE: Record<string, PerkNode> = {
  // --- ARCHITECT PATH (Economy) ---
  'arch_1': {
    id: 'arch_1',
    category: 'architect',
    name: 'Bulk Sourcing',
    description: '-10% Landmark Upgrade Cost.',
    cost: 1,
    icon: '🏗️',
    effect: { type: 'upgrade_discount', value: 0.10 }
  },
  'arch_2': {
    id: 'arch_2',
    category: 'architect',
    name: 'Tax Haven',
    description: 'Tax tiles have a 25% chance to refund funds.',
    cost: 2,
    icon: '🏛️',
    dependsOn: 'arch_1',
    effect: { type: 'tax_refund_chance', value: 0.25 }
  },
  'arch_3': {
    id: 'arch_3',
    category: 'architect',
    name: 'Urban Planning',
    description: '+50% District Synergy Multiplier (1.5x -> 2.0x)',
    cost: 3,
    icon: '📐',
    dependsOn: 'arch_2',
    effect: { type: 'synergy_boost', value: 0.5 }
  },

  // --- EXPLORER PATH (Dice & Pacing) ---
  'expl_1': {
    id: 'expl_1',
    category: 'explorer',
    name: 'Quick Feet',
    description: '-10% Dice Roll Cost.',
    cost: 1,
    icon: '👟',
    effect: { type: 'dice_discount', value: 0.10 }
  },
  'expl_2': {
    id: 'expl_2',
    category: 'explorer',
    name: 'Double Luck',
    description: '+15% chance for natural doubles.',
    cost: 2,
    icon: '🎲',
    dependsOn: 'expl_1',
    effect: { type: 'doubles_chance', value: 0.15 }
  },
  'expl_3': {
    id: 'expl_3',
    category: 'explorer',
    name: 'Time Warp',
    description: 'Dice recharge 25% faster.',
    cost: 3,
    icon: '⏳',
    dependsOn: 'expl_2',
    effect: { type: 'recharge_speed', value: 0.25 }
  },

  // --- ENFORCER PATH (Social) ---
  'enf_1': {
    id: 'enf_1',
    category: 'enforcer',
    name: 'Audit specialist',
    description: 'Heists steal 10% more funds from rivals.',
    cost: 1,
    icon: '💼',
    effect: { type: 'heist_boost', value: 0.10 }
  },
  'enf_2': {
    id: 'enf_2',
    category: 'enforcer',
    name: 'Hardened Vaults',
    description: 'Shield Traps grant 50% more Bounty funds.',
    cost: 2,
    icon: '🔐',
    dependsOn: 'enf_1',
    effect: { type: 'trap_bounty_boost', value: 0.50 }
  },
  'enf_3': {
    id: 'enf_3',
    category: 'enforcer',
    name: 'Nexus Shield',
    description: '+2 Max Shield Capacity.',
    cost: 3,
    icon: '🛡️',
    dependsOn: 'enf_2',
    effect: { type: 'max_shields', value: 2 }
  }
};
