#!/usr/bin/env node

/**
 * Apply Balance Changes Automation
 * 
 * This script applies recommended balance changes from analysis reports.
 * It can work interactively (prompting for each change) or automatically.
 * 
 * Usage:
 *   node scripts/apply-balance-changes.js --interactive
 *   node scripts/apply-balance-changes.js --auto --duration=short --rolls=few
 *   node scripts/apply-balance-changes.js --preset=faster
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BALANCE_FILE = path.join(__dirname, '../web/src/config/gameBalance.js');

// Preset adjustments
const PRESETS = {
  faster: {
    description: 'Speed up sessions (for "too long" issue)',
    changes: {
      'PACING.POINTS_PER_ROLL': 12,
      'ECONOMY.MILESTONE_THRESHOLDS': '[8, 15, 30, 60, 90]',
      'INITIAL_STATE.FUNDS': 6000
    }
  },
  slower: {
    description: 'Slow down sessions (for "too short" issue)',
    changes: {
      'PACING.POINTS_PER_ROLL': 8,
      'ECONOMY.MILESTONE_THRESHOLDS': '[15, 30, 60, 100, 150]',
      'INITIAL_STATE.FUNDS': 4000
    }
  },
  more_dice: {
    description: 'Increase dice generation (for "too few rolls" issue)',
    changes: {
      'INITIAL_STATE.DICE': 60,
      'ECONOMY.DICE_TILE_PAYOUT_BASE': 6
    }
  },
  less_dice: {
    description: 'Decrease dice generation (for "too many rolls" issue)',
    changes: {
      'INITIAL_STATE.DICE': 40,
      'ECONOMY.DICE_TILE_PAYOUT_BASE': 3
    }
  },
  more_stickers: {
    description: 'Increase sticker rewards (for "too few stickers" issue)',
    note: 'Requires manual BoardLoop.jsx edits - increase pack rewards in milestones/missions'
  },
  less_stickers: {
    description: 'Decrease sticker rewards (for "too many stickers" issue)',
    note: 'Requires manual BoardLoop.jsx edits - decrease pack rewards in milestones/missions'
  }
};

// Read current balance file
function readBalanceFile() {
  return fs.readFileSync(BALANCE_FILE, 'utf-8');
}

// Write balance file
function writeBalanceFile(content) {
  fs.writeFileSync(BALANCE_FILE, content);
}

// Extract current value from balance file
function getCurrentValue(content, section, parameter) {
  const sectionRegex = new RegExp(`export const ${section} = \\{([^}]+)\\}`, 's');
  const sectionMatch = content.match(sectionRegex);
  
  if (!sectionMatch) {
    return null;
  }
  
  const paramRegex = new RegExp(`${parameter}:\\s*([^,\\n]+)`, 's');
  const paramMatch = sectionMatch[1].match(paramRegex);
  
  return paramMatch ? paramMatch[1].trim() : null;
}

// Apply a single change
function applyChange(content, section, parameter, newValue) {
  const sectionRegex = new RegExp(`(export const ${section} = \\{[^}]*${parameter}:\\s*)([^,\\n]+)`, 's');
  
  if (!sectionRegex.test(content)) {
    console.error(`  ❌ Could not find ${section}.${parameter}`);
    return content;
  }
  
  const updated = content.replace(sectionRegex, `$1${newValue}`);
  console.log(`  ✅ Updated ${section}.${parameter} → ${newValue}`);
  return updated;
}

// Interactive mode
async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
  
  console.log('\n🎮 Interactive Balance Tuning\n');
  console.log('Answer questions about your playtest results to generate recommendations.\n');
  
  // Duration
  const duration = await question('Session duration issue? (short/long/ok): ');
  
  // Rolls
  const rolls = await question('Roll count issue? (few/many/ok): ');
  
  // Stickers
  const stickers = await question('Sticker rewards issue? (few/many/ok): ');
  
  // Economy
  const funds = await question('Funds balance issue? (accumulating/depleting/ok): ');
  const dice = await question('Dice balance issue? (accumulating/depleting/ok): ');
  
  rl.close();
  
  console.log('\n📝 Generating recommendations...\n');
  
  const changes = {};
  
  // Duration adjustments
  if (duration === 'short') {
    changes['PACING.POINTS_PER_ROLL'] = 8;
    changes['ECONOMY.MILESTONE_THRESHOLDS'] = '[15, 30, 60, 100, 150]';
    changes['INITIAL_STATE.FUNDS'] = 4000;
  } else if (duration === 'long') {
    changes['PACING.POINTS_PER_ROLL'] = 12;
    changes['ECONOMY.MILESTONE_THRESHOLDS'] = '[8, 15, 30, 60, 90]';
    changes['INITIAL_STATE.FUNDS'] = 6000;
  }
  
  // Roll adjustments
  if (rolls === 'few') {
    changes['INITIAL_STATE.DICE'] = 60;
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = 6;
  } else if (rolls === 'many') {
    changes['INITIAL_STATE.DICE'] = 40;
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = 3;
  }
  
  // Sticker note
  if (stickers === 'few' || stickers === 'many') {
    console.log(`⚠️  Sticker adjustments require manual edits to BoardLoop.jsx`);
    console.log(`   ${stickers === 'few' ? 'Increase' : 'Decrease'} pack rewards in milestone/mission handlers\n`);
  }
  
  // Economy notes
  if (funds === 'accumulating') {
    console.log(`⚠️  Funds accumulating: Increase upgrade costs in BoardLoop.jsx (Landmark tiles)\n`);
  } else if (funds === 'depleting') {
    console.log(`⚠️  Funds depleting: Increase Funds tile payouts in BoardLoop.jsx\n`);
  }
  
  if (dice === 'accumulating') {
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = Math.max(2, (changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] || 4) - 1);
  } else if (dice === 'depleting') {
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = Math.min(8, (changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] || 4) + 2);
  }
  
  if (Object.keys(changes).length === 0) {
    console.log('✅ No changes needed - all metrics are OK!\n');
    return;
  }
  
  console.log('Recommended changes:');
  Object.entries(changes).forEach(([key, value]) => {
    console.log(`  - ${key}: ${value}`);
  });
  
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const confirm = await new Promise((resolve) => {
    rl2.question('\nApply these changes? (yes/no): ', resolve);
  });
  
  rl2.close();
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ Changes cancelled\n');
    return;
  }
  
  applyChanges(changes);
}

// Apply changes to balance file
function applyChanges(changes) {
  console.log('\n🔧 Applying changes...\n');
  
  let content = readBalanceFile();
  const backup = content;
  
  Object.entries(changes).forEach(([key, value]) => {
    const [section, parameter] = key.split('.');
    const current = getCurrentValue(content, section, parameter);
    
    if (current) {
      console.log(`${section}.${parameter}: ${current} → ${value}`);
      content = applyChange(content, section, parameter, value);
    } else {
      console.log(`⚠️  Could not find ${key}`);
    }
  });
  
  // Create backup
  const backupPath = BALANCE_FILE + '.backup';
  fs.writeFileSync(backupPath, backup);
  console.log(`\n💾 Backup saved to: ${backupPath}`);
  
  // Write changes
  writeBalanceFile(content);
  console.log(`✅ Changes applied to: ${BALANCE_FILE}\n`);
  
  console.log('📋 Next steps:');
  console.log('  1. Review changes in gameBalance.js');
  console.log('  2. Run: cd web && npm run dev');
  console.log('  3. Play 5 test sessions');
  console.log('  4. Export new CSV and re-analyze');
  console.log('  5. Iterate until metrics hit targets\n');
}

// Preset mode
function presetMode(presetName) {
  const preset = PRESETS[presetName];
  
  if (!preset) {
    console.error(`❌ Unknown preset: ${presetName}`);
    console.log('\nAvailable presets:');
    Object.entries(PRESETS).forEach(([name, data]) => {
      console.log(`  - ${name}: ${data.description}`);
    });
    process.exit(1);
  }
  
  console.log(`\n🎮 Applying preset: ${presetName}`);
  console.log(`Description: ${preset.description}\n`);
  
  if (preset.note) {
    console.log(`⚠️  Note: ${preset.note}\n`);
  }
  
  if (preset.changes) {
    applyChanges(preset.changes);
  }
}

// Custom mode (from CLI args)
function customMode(args) {
  const changes = {};
  
  if (args.duration === 'short') {
    changes['PACING.POINTS_PER_ROLL'] = 8;
    changes['ECONOMY.MILESTONE_THRESHOLDS'] = '[15, 30, 60, 100, 150]';
  } else if (args.duration === 'long') {
    changes['PACING.POINTS_PER_ROLL'] = 12;
    changes['ECONOMY.MILESTONE_THRESHOLDS'] = '[8, 15, 30, 60, 90]';
  }
  
  if (args.rolls === 'few') {
    changes['INITIAL_STATE.DICE'] = 60;
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = 6;
  } else if (args.rolls === 'many') {
    changes['INITIAL_STATE.DICE'] = 40;
    changes['ECONOMY.DICE_TILE_PAYOUT_BASE'] = 3;
  }
  
  if (Object.keys(changes).length === 0) {
    console.log('❌ No valid changes specified\n');
    console.log('Usage: node scripts/apply-balance-changes.js --duration=short --rolls=few\n');
    process.exit(1);
  }
  
  applyChanges(changes);
}

// Main
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
City Slacker Balance Tuning Tool

Usage:
  node scripts/apply-balance-changes.js --interactive
  node scripts/apply-balance-changes.js --preset=<name>
  node scripts/apply-balance-changes.js --duration=<short|long> --rolls=<few|many>

Options:
  --interactive         Interactive Q&A mode
  --preset=<name>       Apply a preset configuration
  --duration=<issue>    Duration issue (short/long)
  --rolls=<issue>       Roll count issue (few/many)
  --auto                Skip confirmation prompts

Available presets:
${Object.entries(PRESETS).map(([name, data]) => `  ${name.padEnd(15)} ${data.description}`).join('\n')}

Examples:
  node scripts/apply-balance-changes.js --interactive
  node scripts/apply-balance-changes.js --preset=faster
  node scripts/apply-balance-changes.js --duration=short --rolls=few
    `);
    process.exit(0);
  }
  
  // Check for preset
  const presetArg = args.find(a => a.startsWith('--preset='));
  if (presetArg) {
    const presetName = presetArg.split('=')[1];
    presetMode(presetName);
    return;
  }
  
  // Check for interactive
  if (args.includes('--interactive')) {
    interactiveMode();
    return;
  }
  
  // Custom mode
  const parsedArgs = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      parsedArgs[key] = value;
    }
  });
  
  customMode(parsedArgs);
}

main();
