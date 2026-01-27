# Cloud Agent Context Check

**Date:** 2026-01-23  
**Purpose:** Verify cloud agent has correct workspace context

---

## Expected Workspace Root

```
C:\city-slacker\
```

---

## Files the Agent Should See at Root Level

### Critical Entry Point Files
- ✅ `.cursorrules` - AI agent configuration (Cursor-specific)
- ✅ `CURRENT_PHASE.md` - Main entry point for AI agents
- ✅ `README.md` - Project overview
- ✅ `STATUS.md` - Current project state
- ✅ `HOW_TO_OPEN_PROJECT.md` - Instructions for correct setup
- ✅ `city-slacker.code-workspace` - VS Code workspace file

### Documentation Files
- ✅ `NEXT_STEPS.md` - Phase 5 detailed guide
- ✅ `PRD.md` - Product Requirements Document
- ✅ `PHASE_4_COMPLETE.md` - Phase 4 completion report
- ✅ `GDD.md` - Game Design Document
- ✅ `DESIGN_DOC.md` - Design specifications

### Directories
- ✅ `web/` - Active React web prototype
- ✅ `conductor/` - Project management and tracks

---

## What the Agent Should Know

### 1. Project Type
- **Name:** City Slacker
- **Type:** React web game prototype (Monopoly Go-style)
- **Tech Stack:** React 18, Vite, Tailwind CSS, Framer Motion
- **Status:** Phase 4 Complete, Phase 5 Ready to Start

### 2. Current Phase
- **Phase:** Phase 5 - Content Polish & Enhancement
- **Track Location:** `conductor/tracks/phase5_polish_20260123/`
- **Status:** Ready to Start
- **Estimated Time:** 8-12 hours

### 3. Current Task
- **Task:** 5.1 - Enhanced City Transitions
- **Time:** 2-3 hours
- **Details:** `conductor/tracks/phase5_polish_20260123/plan.md`
- **Specs:** `conductor/tracks/phase5_polish_20260123/spec.md`

### 4. Test Status
- **Tests Passing:** 73/73 (100%)
- **Coverage:** ~80% on critical paths
- **Target:** >85% coverage for Phase 5
- **Linting:** Clean, no errors

### 5. Active Development Location
- **Main Component:** `web/src/components/BoardLoop.jsx`
- **Config:** `web/src/config/gameBalance.js`
- **Utils:** `web/src/utils/` (saveSystem, sessionAnalytics)
- **Tests:** `web/tests/` and `web/src/components/__tests__/`

---

## Agent Should Read (In Order)

1. **`.cursorrules`** (if Cursor AI)
   - Project structure
   - Current phase
   - Quick commands
   - Tech stack

2. **`CURRENT_PHASE.md`**
   - Complete context
   - Task breakdown
   - Navigation guide
   - How to start

3. **`conductor/tracks/phase5_polish_20260123/index.md`**
   - Phase 5 overview
   - Goals and success criteria
   - Prerequisites

4. **`conductor/tracks/phase5_polish_20260123/plan.md`**
   - Detailed implementation steps
   - Acceptance criteria
   - Task breakdown

5. **`conductor/workflow.md`**
   - TDD workflow
   - Commit strategy
   - Quality gates

---

## Quick Verification Commands

```bash
# Verify you're in correct directory
pwd
# Should show: C:\city-slacker

# Check for key files
ls CURRENT_PHASE.md
ls .cursorrules
ls city-slacker.code-workspace

# Check for active development
ls web/
ls conductor/

# Navigate to active code
cd web
ls src/components/BoardLoop.jsx
```

---

## Verification Commands

```bash
# Verify you're in correct directory
pwd
# Should show: C:\city-slacker

# Check for key files
ls CURRENT_PHASE.md
ls .cursorrules

# Check for active development
ls web/
ls conductor/
```

---

## Expected Agent Behavior

The cloud agent should:

1. ✅ Recognize workspace root as `C:\city-slacker\`
2. ✅ Read `.cursorrules` for project configuration
3. ✅ Read `CURRENT_PHASE.md` for current context
4. ✅ Understand Phase 5 is ready to start
5. ✅ Know Task 5.1 is the first task
6. ✅ Navigate to `web/` for active development
7. ✅ Follow TDD workflow from `conductor/workflow.md`

---

## Context Summary

**Project Root:** `C:\city-slacker\`  
**Active Code:** `C:\city-slacker\web\`  
**Current Phase:** Phase 5 - Content Polish & Enhancement  
**Current Task:** Task 5.1 - Enhanced City Transitions  
**Documentation:** `conductor/tracks/phase5_polish_20260123/`  
**Workflow:** `conductor/workflow.md` (TDD approach)  
**Test Status:** 73/73 passing, >85% target  
**Quality:** Clean linting, 60fps target  

---

## Success Indicators

If the cloud agent can:
- ✅ See this file
- ✅ Read `CURRENT_PHASE.md`
- ✅ Access `web/src/components/`
- ✅ Read `conductor/tracks/phase5_polish_20260123/plan.md`
- ✅ Understand current task is 5.1

Then the agent has **correct context** and can proceed with development!

---

## Next Action for Agent

1. Confirm workspace root is `C:\city-slacker\`
2. Read `CURRENT_PHASE.md` thoroughly
3. Review `conductor/tracks/phase5_polish_20260123/plan.md`
4. Start Task 5.1 implementation following TDD workflow
5. Update `plan.md` as tasks are completed

---

**Agent Context Check Complete**  
**Ready for Phase 5 Development** ✅
