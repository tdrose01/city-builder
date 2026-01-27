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