# Agent Instructions

Guidelines for AI agents (GitHub Copilot, Claude, Cursor, etc.) working in this repository.

## Repository overview

`accent-folding` is a zero-dependency JavaScript library for accent-insensitive text matching with search-highlighting. The core logic lives in `src/accentFolding.js` and the accent map in `src/accentMap.json`. The root `index.js` re-exports from `src/`.

## Key constraints

- **No dependencies.** The library ships with zero runtime dependencies — do not add any.
- **No build step.** Plain ESM JavaScript only. No TypeScript compilation for the library itself.
- **Size matters.** The library is ~2.7 kB gzipped. Flag or avoid changes that significantly increase bundle size (use `pnpm size` to check).
- **Node ≥ 18** is the minimum engine target.

## Project layout

```
src/accentFolding.js       # Core library logic
src/accentMap.json         # Accent → ASCII character map
src/accentFolding.js.test.js  # Tests (Vitest)
index.js                   # Public entry point (re-exports src/)
index.d.ts                 # TypeScript declarations
demo/                      # Vite-based interactive demo (not published)
docs/                      # Static documentation site
docs/plans/                # Feature/improvement planning docs
```

## Common commands

```sh
pnpm test            # Run tests (Vitest, watch mode)
pnpm coverage        # Run tests with coverage report
pnpm lint            # ESLint
pnpm lint:fix        # ESLint with auto-fix
pnpm type-check      # TypeScript type checking (tsc)
pnpm size            # Check bundle size
```

## Branch & PR workflow

- `main` is the protected default branch — **never push directly to main**.
- All changes go through a PR. Branch naming convention: `<type>/<short-description>` (e.g. `feat/add-replace-method`, `fix/accent-map-typo`, `docs/update-readme`).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — releases are automated via semantic-release.

## Testing

- Tests are in `src/accentFolding.js.test.js` using Vitest.
- Always add or update tests when changing `src/accentFolding.js` or `src/accentMap.json`.
- Run `pnpm test` before pushing.

## Accent map changes

- `src/accentMap.json` maps accented characters to their ASCII equivalents.
- When adding new mappings, check for existing entries first to avoid duplicates.
- Add a regression test in `src/accentFolding.js.test.js` for every new mapping.
