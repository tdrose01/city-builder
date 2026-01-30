# AGENTS.md â€” AI Coding Agent Instructions (React/Node, .NET, Python, Postgres)

Applies to **Cursor**, **Codex CLI**, **Gemini CLI**, and **Claude Code** in this repo.

Goal: ship correct, minimal, test-backed changes with clean diffs and safe database handling.

---

## 0) Prime Directive
**Be reliable, not clever.**
- Read before writing.
- Small diffs over sweeping refactors.
- Prove changes with tests (or deterministic repro).
- Prefer existing patterns and conventions.

---

## 1) Non-Negotiable Guardrails
### 1.1 Read-First Rule
Before editing, identify:
- Entry points and a similar implementation
- Repo conventions (naming, error handling, logging)
- How tests run for the touched component

### 1.2 No Surprise Dependencies
Do not add new libraries unless explicitly required.
If needed, justify and show the minimal alternative first.

### 1.3 No Drive-By Refactors
No unrelated reformatting, renames, or restructures.

### 1.4 Every Fix Must Be Proven
Bug fix: failing test (preferred) OR deterministic repro steps/script.

### 1.5 Database Changes Are High-Risk
Any Postgres schema change requires:
- A migration in db/migrations/
- Rollback plan (documented; optional db/rollback/*.down.sql)
- Notes about impact (locks, backfill cost, index build time)

### 1.6 Security Basics
Never log secrets/PII. Validate inputs. Enforce authZ (not just authN).

---

## 2) Roles (One Lane Per Agent)
- Planner: requirements, acceptance criteria, plan, risks, files to touch, test plan
- Implementer: minimal code changes + tests
- QA: tests + edge cases + commands run
- Reviewer: correctness/security/perf review scoped to the task

---

## 3) Standard Workflow
A) Understand â†’ B) Plan â†’ C) Implement (minimal diff) â†’ D) Verify â†’ E) Package

---

## 4) Commands (fill in as repo evolves)

### 4.1 Postgres SQL Migrations (Windows-only, SQL-first)
- Apply: powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-DbMigrations.ps1
- Dry run: .\scripts\Invoke-DbMigrations.ps1 -DryRun

Rules:
- Any schema change ships as a new migration file: db/migrations/NNN_description.sql
- Include rollback plan in PR summary.

### 4.2 Node API (apps/api-node)
- Install: 
pm ci (or 
pm i)
- Run: 
pm run dev
- Test: 
pm test (when added)

### 4.3 React Web (apps/web-react)
- Install: 
pm ci (or 
pm i)
- Run: 
pm run dev
- Build: 
pm run build
- Test: 
pm test (when added)

### 4.4 .NET API (apps/api-dotnet)
- Build: dotnet build
- Test: dotnet test
- Run: dotnet run

### 4.5 Python Worker (apps/worker-python)
- Setup: python -m venv .venv
- Install: pip install -r requirements.txt
- Test: pytest -q (when added)

---

## 5) Definition of Done
- Acceptance criteria met
- Tests added/updated (or deterministic repro)
- Lint/format passes
- DB changes: migration + rollback notes
- Minimal diff, no unrelated refactors
- PR summary includes commands run
- **Knowledge Base updated** (see Section 6)

---

## 6) Knowledge Base Documentation (REQUIRED)

After completing ANY significant work, update the knowledge base:

### 6.1 When to Update Knowledge Base
**ALWAYS update after:**
- ✅ Completing a feature, bug fix, or refactoring
- ✅ Adding/removing/updating dependencies
- ✅ Making configuration changes
- ✅ Security-related changes
- ✅ Completing a phase or milestone
- ✅ Making architectural decisions
- ✅ Resolving major issues

**DO NOT skip this step.** The knowledge base is the project's memory.

### 6.2 How to Update Knowledge Base
1. **Run the skill:** Follow instructions in `knowledge-base-updater.skill`
2. **Gather info:** Recent commits, changed files, test results
3. **Create entry:** Use the template in the skill file
4. **Update statistics:** Current metrics (commits, tests, dependencies)
5. **Commit KB:** `git commit -m "docs: Update knowledge base - [description]"`

### 6.3 Knowledge Base Structure
The `KNOWLEDGE_BASE.md` file contains:
- Recent Changes (last 30 days)
- Phase History
- Security Changes
- Dependency History
- Architecture Decisions
- Configuration Changes
- Known Issues & Workarounds

### 6.4 Entry Template (Brief)
```markdown
## [YYYY-MM-DD HH:MM] - Brief Title

**Type:** Feature|Bug Fix|Refactor|Configuration|Documentation|Security|Test
**Status:** Completed|In Progress
**Commit:** [hash]

### What Changed
- Specific changes made

### Why
- Reason for the change

### Impact
- Effects on project

### Related Files
- `path/to/file`

### Testing
- Test results

### Follow-up Tasks
- [ ] Remaining work
```

### 6.5 Best Practices
- Be specific: include file names, function names, line numbers
- Link commits: always reference the commit hash
- Document why: explain reasoning, not just what changed
- Track dependencies: note all package changes
- Update statistics: keep metrics current
- Tag entries: use `#security`, `#phase4`, etc. for search
- Note breaking changes: clearly mark backwards-incompatible changes

### 6.6 Integration with Git
```powershell
# After completing work:
git add KNOWLEDGE_BASE.md
git commit -m "docs: Update knowledge base - [brief description]"
```

**This is not optional.** The knowledge base ensures continuity across sessions and agents.

---

## 7) Available Skills (Context7)

Use these specialized skills to automate standardized workflows.

### 7.1 Knowledge Base Updater
- **File:** `knowledge-base-updater.skill`
- **Use when:** Completing any task, phase, or significant change.
- **Action:** Automates the creation of knowledge base entries.

### 7.2 Phase Completion Assistant
- **File:** `phase-completion-assistant.skill`
- **Use when:** Finishing a development phase (e.g., Phase 9 to Phase 10).
- **Action:** Automates documentation synchronization (CHANGELOG, STATUS, README, NEXT_STEPS) and git commit workflow.
- **Workflow:**
  1. Updates all status files.
  2. Generates `PHASE_[X]_COMPLETE.md` summary.
  3. Prepares standardized git commit message.

### 7.3 Ralph Orchestration Assistant
- **File:** `ralph-orchestration-assistant.skill`
- **Use when:** Coordinating development cycles and task tracking.
- **Action:** Manages the Ralph loop workflow.