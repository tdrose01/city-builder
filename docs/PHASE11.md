# Phase 11: Player System, Economy Engine, and Core Game Rules

**Started:** February 13, 2026
**Status:** In Progress

## 🎯 Goal
Implement core gameplay mechanics for multi-player Monopoly-style city builder game, including player management, economic systems, and fundamental game rules.

## 📋 Task List

### Task 11.1: Player System
- [ ] Create Player data model (id, name, piece, money, position, properties, isAI, status)
- [ ] Manage player turn order and current turn state
- [ ] Player piece movement system (animated transitions between board positions)
- [ ] Support 2-6 players (human or AI)

### Task 11.2: Economy Engine
- [ ] Money management and transactions
- [ ] Property value calculation
- [ ] Rent calculation engine
- [ ] "Pass Go" income ($200)

### Task 11.3: Core Game Rules
- [ ] Property purchase flow
- [ ] Rent payment mechanics
- [ ] Jail system
- [ ] Chance/Community Chest framework
- [ ] Game state machine

## 📁 Implementation Structure

### New Files to Create:
```
web/src/
├── lib/
│   ├── playerManager.js          # Player data model and turn management
│   ├── economyEngine.js          # Money, property, and rent calculations
│   ├── gameRules.js             # Core game rules and state machine
│   └── cardDeck.js              # Chance/Community Chest cards
├── components/
│   ├── PlayerList.jsx           # Player status display
│   ├── PropertyModal.jsx        # Property purchase interface
│   ├── RentPaymentModal.jsx     # Rent payment interface
│   ├── JailModal.jsx            # Jail system interface
│   └── CardModal.jsx            # Chance/Community Chest interface
└── config/
    └── gameConfig.js           # Game configuration and constants
```

### Files to Modify:
- `BoardLoop.jsx` - Integrate multi-player support
- `GameScene.jsx` - Support multiple player pawns
- `PlayerPawn.jsx` - Handle multiple player pieces

## 🔧 Key Features

### Player System Features:
- **Player Data Model**: Complete player profile with game state
- **Turn Management**: Sequential turn order with AI support
- **Piece Movement**: Smooth animated transitions for all players
- **AI Players**: Basic AI decision making for computer opponents

### Economy Engine Features:
- **Transaction System**: Safe money transfers between players
- **Property Values**: Dynamic calculation based on location and improvements
- **Rent Calculation**: Complex rent formulas with multipliers
- **Pass Go**: Automatic $200 income when completing a lap

### Core Game Rules:
- **Property Ownership**: Buy, sell, and manage properties
- **Rent Collection**: Automatic rent collection when landing on owned properties
- **Jail Mechanics**: Multiple ways to get out of jail
- **Card Events**: Random chance and community chest events
- **Win Conditions**: First player to bankruptcy or target net worth

## 🎮 Game States

### Player States:
- `ACTIVE` - Normal gameplay
- `JAIL` - In jail, skipping turns
- `BANKRUPT` - Eliminated from game
- `WAITING` - Waiting for other players

### Game States:
- `SETUP` - Game initialization and player selection
- `PLAYING` - Normal gameplay
- `PROPERTY_TURN` - Property purchase decision
- `RENT_TURN` - Rent payment processing
- `JAIL_TURN` - Jail processing
- `GAME_OVER` - Game conclusion

## 🎯 Integration Points

### With Existing System:
- **BoardLoop.jsx**: Integrate player state with existing game loop
- **3D System**: Support multiple player pawns in Scene3D
- **Tile System**: Extend tile interactions for multi-player scenarios
- **Save System**: Support multi-player game saves

### UI Components:
- **Player HUD**: Display all player statuses and current turn
- **Property Interface**: Buy/sell property interactions
- **Transaction Log**: Display all money transfers
- **Game Settings**: Player count and AI difficulty selection

## 📅 Progress Tracking

### Week 1 (Feb 13-19):
- [ ] Player data model implementation
- [ ] Turn management system
- [ ] Basic multi-player UI
- [ ] Economy engine foundation

### Week 2 (Feb 20-26):
- [ ] Property purchase system
- [ ] Rent calculation engine
- [ ] Jail system implementation
- [ ] Card deck system

### Week 3 (Feb 27-Mar 4):
- [ ] AI player logic
- [ ] Game state machine
- [ ] Integration testing
- [ ] Polish and optimization

## 🚀 Deployment

**Target:** March 4, 2026
**Environment:** Development branch
**Testing:** Multi-player scenarios and edge cases

## 🔗 Dependencies

- **React Hooks**: useState, useEffect, useCallback
- **Framer Motion**: Animation support
- **Three.js**: 3D pawn rendering
- **Existing Components**: BoardLoop, Scene3D integration

## 📊 Success Metrics

- [ ] Support 2-6 players simultaneously
- [ ] Smooth turn transitions (< 2s delay)
- [ ] Accurate economic calculations
- [ ] Stable multiplayer save/load system
- [ ] AI decision making quality
- [ ] Game state consistency across all scenarios