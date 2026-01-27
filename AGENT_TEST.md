# Agent Context Test

**Purpose:** Verify AI agent is in correct directory and has proper context

---

## Quick Verification Questions

If you're an AI agent reading this file, please verify:

1. **What is your workspace root path?**
   - Expected: `C:\city-slacker\` or similar
   - NOT: `C:\city-slacker\city-slacker\`

2. **Can you see these files in the root?**
   - [ ] CURRENT_PHASE.md
   - [ ] README.md
   - [ ] STATUS.md
   - [ ] .cursorrules
   - [ ] city-slacker.code-workspace
   - [ ] web/ directory
   - [ ] conductor/ directory

3. **What is the current development phase?**
   - Expected: Phase 5 - Content Polish & Enhancement
   - Location: `conductor/tracks/phase5_polish_20260123/`

4. **What is the first task to work on?**
   - Expected: Task 5.1 - Enhanced City Transitions
   - Details in: `conductor/tracks/phase5_polish_20260123/plan.md`

5. **Where is the active development code?**
   - Expected: `web/src/components/BoardLoop.jsx`
   - NOT in: `city-slacker/` (Unity project)

---

## If You Can Answer These Correctly

✅ You're in the right place!
✅ You have the correct context!
✅ You can proceed with Phase 5 development!

**Next steps:**
1. Read `CURRENT_PHASE.md` for complete context
2. Review `conductor/tracks/phase5_polish_20260123/plan.md`
3. Start with Task 5.1 implementation

---

## If You Cannot Answer These

❌ You might be in the wrong directory
❌ Check your workspace root path
❌ Follow instructions in `HOW_TO_OPEN_PROJECT.md`

**Recovery steps:**
1. Check workspace root (should be `C:\city-slacker\`)
2. If wrong, close and reopen using `city-slacker.code-workspace`
3. Read `.cursorrules` for project structure
4. Read `CURRENT_PHASE.md` for context

---

## Context Summary for AI Agents

**Project:** City Slacker (React web game prototype)  
**Tech Stack:** React 18, Vite, Tailwind CSS, Framer Motion  
**Current Phase:** Phase 5 - Content Polish & Enhancement  
**Current Task:** Task 5.1 - Enhanced City Transitions  
**Test Status:** 73/73 passing  
**Target:** >85% coverage, 60fps, production-ready  

**Active Code Location:** `web/src/components/`  
**Documentation:** `conductor/tracks/phase5_polish_20260123/`  
**Workflow:** `conductor/workflow.md` (TDD approach)

---

## Test Complete

If you can read and understand this file, you have proper access to the project!
