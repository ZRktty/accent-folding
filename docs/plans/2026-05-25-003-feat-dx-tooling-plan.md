---
title: DX Tooling — Husky, publint, attw, size-limit
status: active
created: 2026-05-25
---

## Problem

Developer experience friction identified during TypeScript declaration work:
- Prettier drift accumulates across commits and gets cleaned up reactively rather than at commit time
- No validation that the published package shape is correct for npm consumers
- TypeScript declarations ship but are not verified from a real consumer's perspective
- The "2.7 kB gzipped" README claim is asserted but not enforced

## Scope

Add four lightweight tools. No build step changes, no source migration.

---

## Implementation Units

### U1 — Husky + lint-staged (pre-commit hook)

**Goal:** Run prettier + eslint on staged files before every commit. Eliminates prettier drift.

**Files:**
- Create: `.husky/pre-commit`
- Modify: `package.json` — add `lint-staged` config and `prepare` script

**Approach:**
- `pnpm add -D husky lint-staged`
- `pnpm exec husky init` — creates `.husky/pre-commit`
- Hook runs `pnpm exec lint-staged`
- `lint-staged` config in `package.json`:
  ```json
  "lint-staged": {
    "*.{js,ts,tsx,json,html,css,md}": "prettier --write",
    "*.{js,ts,tsx}": "eslint --fix"
  }
  ```
- Add `"prepare": "husky"` to `scripts`

**Verification:** Commit a file with formatting drift — hook should auto-fix and re-stage it.

---

### U2 — publint (package shape validation)

**Goal:** Validate `package.json` exports, `main`, `types`, and `files` are correct for npm consumers. Run in CI.

**Files:**
- Modify: `package.json` — add `"publint": "publint"` script
- Modify: `.github/workflows/coverage.yml` — add publint step

**Approach:**
- `publint` is zero-install via `pnpm dlx`, or add as devDependency for CI caching
- Add script: `"publint": "publint"`
- CI step after type-check: `pnpm run publint`

**Verification:** `pnpm run publint` exits 0 with no warnings.

---

### U3 — @arethetypeswrong/cli / attw (declaration correctness)

**Goal:** Verify TypeScript declarations work correctly from a consumer's perspective across moduleResolution modes (node16, bundler, etc.).

**Files:**
- Modify: `package.json` — add `"attw": "attw --pack ."` script
- Modify: `.github/workflows/coverage.yml` — add attw step

**Approach:**
- `pnpm add -D @arethetypeswrong/cli`
- Script: `"attw": "attw --pack ."`
- CI step after type-check: `pnpm run attw`
- Expect clean output for ESM-only package with `"types"` field

**Verification:** `pnpm run attw` exits 0 with no ❌ or ⚠️ rows.

---

### U4 — size-limit (bundle size enforcement)

**Goal:** Enforce the "2.7 kB gzipped" claim from the README. Fail CI if the package grows beyond a defined threshold.

**Files:**
- Modify: `package.json` — add `size-limit` config and `size` script
- Modify: `.github/workflows/coverage.yml` — add size-limit step

**Approach:**
- `pnpm add -D size-limit @size-limit/preset-small-lib`
- Config in `package.json`:
  ```json
  "size-limit": [
    { "path": "index.js", "limit": "4 kB" }
  ]
  ```
  (Set limit to 4 kB to give headroom above current 2.7 kB)
- Script: `"size": "size-limit"`
- CI step: `pnpm run size`

**Verification:** `pnpm run size` exits 0 and reports size within limit.

---

## Dependencies between units

U1 is independent. U2, U3, U4 are independent of each other but all modify `coverage.yml` — implement sequentially to avoid conflicts.

## Out of scope

- Gitleaks (no secrets in this repo, Snyk already covers deps)
- Bun migration (high churn, pnpm workspaces already in place)
- Changesets (semantic-release already established)
