#!/usr/bin/env node

/**
 * Playtest Helper - Quick access to all playtest automation tools
 * 
 * Usage:
 *   node scripts/playtest-helper.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PLAYTEST_DIR = path.join(__dirname, '../playtest-results');

// Ensure playtest directory exists
if (!fs.existsSync(PLAYTEST_DIR)) {
  fs.mkdirSync(PLAYTEST_DIR, { recursive: true });
}

// Find latest CSV file
function findLatestCSV() {
  const files = fs.readdirSync(PLAYTEST_DIR)
    .filter(f => f.startsWith('session-data-') && f.endsWith('.csv'))
    .map(f => ({
      name: f,
      path: path.join(PLAYTEST_DIR, f),
      time: fs.statSync(path.join(PLAYTEST_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  return files.length > 0 ? files[0] : null;
}

// Count CSV files
function countCSVFiles() {
  return fs.readdirSync(PLAYTEST_DIR)
    .filter(f => f.startsWith('session-data-') && f.endsWith('.csv'))
    .length;
}

// Main menu
async function showMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
  
  console.clear();
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       City Slacker - Playtest Helper Tool             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log();
  
  const latestCSV = findLatestCSV();
  const csvCount = countCSVFiles();
  
  console.log('📊 Status:');
  console.log(`   CSV files found: ${csvCount}`);
  if (latestCSV) {
    console.log(`   Latest: ${latestCSV.name}`);
    console.log(`   Modified: ${new Date(latestCSV.time).toLocaleString()}`);
  } else {
    console.log('   ⚠️  No CSV files found - play sessions and export data first');
  }
  console.log();
  
  console.log('🎮 What would you like to do?');
  console.log();
  console.log('  1. Start dev server (play sessions)');
  console.log('  2. Analyze latest CSV');
  console.log('  3. Analyze specific CSV');
  console.log('  4. Apply balance changes (interactive)');
  console.log('  5. Apply balance changes (preset)');
  console.log('  6. View playtest guide');
  console.log('  7. View automation README');
  console.log('  8. Open playtest-results folder');
  console.log('  9. Exit');
  console.log();
  
  const choice = await question('Enter choice (1-9): ');
  console.log();
  
  switch (choice.trim()) {
    case '1':
      startDevServer();
      break;
    case '2':
      if (latestCSV) {
        analyzeCSV(latestCSV.path);
      } else {
        console.log('❌ No CSV files found. Play sessions and export data first.\n');
        await question('Press Enter to continue...');
        showMenu();
      }
      break;
    case '3':
      await analyzeSpecific(rl);
      break;
    case '4':
      applyChangesInteractive();
      break;
    case '5':
      await applyChangesPreset(rl);
      break;
    case '6':
      viewGuide('PLAYTEST_GUIDE.md');
      break;
    case '7':
      viewGuide('playtest-results/README.md');
      break;
    case '8':
      openFolder();
      break;
    case '9':
      console.log('👋 Happy playtesting!\n');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('❌ Invalid choice\n');
      await question('Press Enter to continue...');
      showMenu();
  }
}

// Start dev server
function startDevServer() {
  console.log('🚀 Starting dev server...\n');
  console.log('Instructions:');
  console.log('  1. Browser will open to http://localhost:5173');
  console.log('  2. Play 10 sessions (follow PLAYTEST_GUIDE.md)');
  console.log('  3. Click Reset after each session');
  console.log('  4. After all 10, click Analytics → Export CSV');
  console.log('  5. Save to playtest-results/ folder');
  console.log('  6. Press Ctrl+C to stop server, then run this tool again');
  console.log();
  console.log('Starting in 3 seconds...\n');
  
  setTimeout(() => {
    try {
      execSync('cd web && npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n❌ Server stopped\n');
    }
  }, 3000);
}

// Analyze CSV
function analyzeCSV(csvPath) {
  console.log(`🔍 Analyzing: ${path.basename(csvPath)}\n`);
  
  try {
    execSync(`node scripts/analyze-playtest.js "${csvPath}"`, { stdio: 'inherit' });
    console.log('\n✅ Analysis complete!\n');
  } catch (error) {
    console.log('\n❌ Analysis failed\n');
  }
}

// Analyze specific CSV
async function analyzeSpecific(rl) {
  const files = fs.readdirSync(PLAYTEST_DIR)
    .filter(f => f.startsWith('session-data-') && f.endsWith('.csv'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.log('❌ No CSV files found\n');
    await new Promise((resolve) => rl.question('Press Enter to continue...', resolve));
    showMenu();
    return;
  }
  
  console.log('Available CSV files:\n');
  files.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f}`);
  });
  console.log();
  
  const choice = await new Promise((resolve) => rl.question('Enter number (or 0 to cancel): ', resolve));
  const index = parseInt(choice) - 1;
  
  if (index >= 0 && index < files.length) {
    const csvPath = path.join(PLAYTEST_DIR, files[index]);
    analyzeCSV(csvPath);
  } else {
    showMenu();
  }
}

// Apply changes interactively
function applyChangesInteractive() {
  console.log('🔧 Starting interactive balance tuning...\n');
  
  try {
    execSync('node scripts/apply-balance-changes.js --interactive', { stdio: 'inherit' });
    console.log('\n✅ Changes applied!\n');
  } catch (error) {
    console.log('\n❌ Operation cancelled or failed\n');
  }
}

// Apply changes with preset
async function applyChangesPreset(rl) {
  console.log('Available presets:\n');
  console.log('  1. faster     - Speed up sessions (for "too long" issue)');
  console.log('  2. slower     - Slow down sessions (for "too short" issue)');
  console.log('  3. more_dice  - Increase dice generation (for "too few rolls")');
  console.log('  4. less_dice  - Decrease dice generation (for "too many rolls")');
  console.log('  0. Cancel');
  console.log();
  
  const choice = await new Promise((resolve) => rl.question('Enter number: ', resolve));
  
  const presets = ['', 'faster', 'slower', 'more_dice', 'less_dice'];
  const presetIndex = parseInt(choice);
  
  if (presetIndex > 0 && presetIndex < presets.length) {
    const preset = presets[presetIndex];
    console.log(`\n🔧 Applying preset: ${preset}\n`);
    
    try {
      execSync(`node scripts/apply-balance-changes.js --preset=${preset}`, { stdio: 'inherit' });
      console.log('\n✅ Preset applied!\n');
    } catch (error) {
      console.log('\n❌ Failed to apply preset\n');
    }
  }
  
  await new Promise((resolve) => rl.question('\nPress Enter to continue...', resolve));
  showMenu();
}

// View guide
function viewGuide(filename) {
  const guidePath = path.join(__dirname, '..', filename);
  
  if (!fs.existsSync(guidePath)) {
    console.log(`❌ Guide not found: ${filename}\n`);
    return;
  }
  
  const content = fs.readFileSync(guidePath, 'utf-8');
  console.log(content);
  console.log('\n' + '='.repeat(60) + '\n');
}

// Open folder
function openFolder() {
  console.log('📂 Opening playtest-results folder...\n');
  
  try {
    if (process.platform === 'win32') {
      execSync(`explorer "${PLAYTEST_DIR}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${PLAYTEST_DIR}"`);
    } else {
      execSync(`xdg-open "${PLAYTEST_DIR}"`);
    }
    console.log('✅ Folder opened\n');
  } catch (error) {
    console.log(`❌ Could not open folder. Path: ${PLAYTEST_DIR}\n`);
  }
}

// Start
console.log('Loading...\n');
setTimeout(() => showMenu(), 500);
