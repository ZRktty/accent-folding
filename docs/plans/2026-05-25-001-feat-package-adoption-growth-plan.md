---
title: 'feat: Grow accent-folding adoption through discoverability and positioning'
type: feat
status: active
date: 2026-05-25
---

# feat: Grow accent-folding adoption through discoverability and positioning

## Summary

`accent-folding` sits at ~1,089 weekly downloads while `remove-accents` reaches 6.6M — not because of a feature gap but because of a discoverability and positioning gap. This plan restructures the README to lead with the package's unique differentiator (`highlightMatch`), tightens npm metadata, adds real-world integration examples, and cuts a fresh release. No new features are required; the product is already differentiated.

---

## Problem Frame

Every competing package (`remove-accents`, `diacritics`, `lodash.deburr`, `latinize`, `fold-to-ascii`) does fold-only: string in, ASCII out. `accent-folding` is the **only package** that solves the read-back problem — matching against folded text while returning the original accented string with HTML markup for display. A user typing "cafe" sees "**café**" highlighted. Nobody else does this.

The gap is not features. It is:

1. The README leads with `replace` (the commodity feature), not `highlightMatch` (the unique one)
2. npm keywords miss every search term a UI engineer would use
3. Last publish was Aug 2024 — the package appears unmaintained
4. No integration examples for the environments where this is most useful (React, plain JS search inputs)
5. GitHub repo URLs in `package.json` point to old username (`zr87` → `ZRktty`)

---

## Requirements

- R1. The README leads with `highlightMatch` as the headline feature, with a compelling real-world framing before API docs
- R2. npm keywords cover the search terms UI engineers actually use when looking for this capability
- R3. `package.json` metadata is accurate (URLs, description, engines)
- R4. A plain JS and a React integration example demonstrate the canonical use case (accent-insensitive search input with highlighted results)
- R5. A fresh npm release is published, showing the package is actively maintained
- R6. GitHub repository topics and description match the package's actual positioning

---

## Scope Boundaries

- No new API methods or behavioral changes to `src/accentFolding.js`
- No TypeScript types in this plan (remains in ROADMAP for a later iteration)
- No CommonJS build (remains in ROADMAP)
- No website or dedicated demo app — examples live in the README
- PACKAGE_ANALYSIS.md accuracy corrections are deferred (low user-facing value)

### Deferred to Follow-Up Work

- TypeScript type declarations: separate PR, high value for TS-heavy projects but out of scope here
- CommonJS support: separate effort, needs a build step
- Dedicated demo/playground (CodeSandbox or StackBlitz): nice-to-have, defer until after initial positioning work

---

## Context & Research

### Relevant Code and Patterns

- `src/accentFolding.js` — `AccentFolding` class with `replace()` and `highlightMatch(str, fragment, wrapTag)`. The `wrapTag` defaulting to `'b'` is a key ergonomic detail to highlight in examples
- `src/accentFolding.js.test.js` — 728 tests, 100% coverage; test file shows full API surface including edge cases useful for docs
- `README.md` — current structure: Description → Installation → replace → highlightMatch → Extending → Requirements → Legacy → Contributing
- `package.json` — `bugs.url` and `repository.url` still reference `github.com/zr87/`; `engines.node` recently bumped to `>=22` (PR #51); keywords exist but miss UI/search-specific terms
- `ROADMAP.md` — TypeScript and CJS flagged as future; treat as authoritative on scope limits

### Competitive Landscape

- `remove-accents` (6.6M/wk): fold-only, pulled in transitively by `match-sorter`/TanStack Table — not beatable on downloads alone
- `diacritics` (2.4M/wk): abandoned 2017, fold-only, 414 dependents — highlight the staleness contrast
- `fuse.js`: added `ignoreDiacritics` June 2024 for comparison, no highlight output — name-drop as a complement, not a competitor
- No competitor offers `highlightMatch` — this is the moat

### External References

- npm keyword search shows "diacritic highlight", "accent search", "search highlight" return no strong results — clear SEO gap
- bundlephobia: `accent-folding` at 2.7 kB gzipped — competitive, worth calling out

---

## Key Technical Decisions

- **Lead with `highlightMatch`, not `replace`**: The fold-only use case is a commodity; the highlight use case is unique. README restructure inverts the current order
- **Plain JS example before React**: Keeps the package framework-agnostic in positioning while still showing React since that's where most UI search UX lives
- **Examples show the full loop** (user input → `highlightMatch` → rendered result), not just the function call — this is what UI engineers need to see to evaluate fit
- **React example uses `dangerouslySetInnerHTML`**: The output of `highlightMatch` is an HTML string; this is the correct pattern and should be shown explicitly with a note on when it is safe (trusted content, server-controlled strings)
- **Keep `wrapTag` prominently**: The ability to use `<strong>`, `<mark>`, or `<span class="highlight">` is a key ergonomic advantage over building your own wrapper
- **GitHub topics set via `gh api`**: Not a file change — an operational step in U5

---

## Open Questions

### Resolved During Planning

- _Should examples use React hooks?_ Yes — show a minimal `useState`/`useEffect` pattern since that's the realistic integration context, but keep it copy-paste small
- _Should `dangerouslySetInnerHTML` use be flagged?_ Yes — one sentence noting it is safe when the input is app-controlled (not user-generated HTML)
- _Fix repo URLs in package.json?_ Yes — `bugs.url` and `repository.url` both still reference `zr87`, should be `ZRktty`

### Deferred to Implementation

- Exact wording of the README headline — implementer should draft 2-3 options and pick the strongest
- Whether to add a `## Why accent-folding?` comparison section to README — optional, could come across as defensive; implement decides based on tone

---

## Implementation Units

- U1. **Fix package.json metadata**

**Goal:** Correct stale URLs, expand keywords to cover UI-engineer search terms, sharpen the npm description.

**Requirements:** R2, R3

**Dependencies:** None

**Files:**

- Modify: `package.json`

**Approach:**

- Update `repository.url` and `bugs.url` from `github.com/zr87/` to `github.com/ZRktty/`
- Replace description with something that leads with the unique value: e.g. _"Accent-insensitive text matching with built-in search highlighting — the only library that returns original accented text with HTML markup around matches"_
- Add keywords: `search highlight`, `diacritic highlight`, `highlight match`, `accent search`, `search input`, `autocomplete`, `typeahead`, `fuzzy search display`, `accent insensitive search`
- Remove redundant keyword `JavaScript library` (noise on npm)

**Test scenarios:**

- Test expectation: none — metadata-only change with no behavioral surface

**Verification:**

- `npm pack --dry-run` shows updated metadata; `npm info accent-folding` after publish reflects new keywords and description

---

- U2. **Restructure README to lead with highlightMatch**

**Goal:** Reorder and rewrite the README so the unique differentiator (`highlightMatch`) is the first thing an evaluator sees, with a compelling real-world framing before any API details.

**Requirements:** R1, R3

**Dependencies:** None (parallel with U1)

**Files:**

- Modify: `README.md`

**Approach:**

- **New opening**: One punchy sentence framing the problem (`Searching "cafe" should find "café". Highlighting "lo" in "López" should show "<b>Ló</b>pez", not stripped text.`) followed immediately by a `highlightMatch` example
- **Move `highlightMatch` before `replace`** in the Public Methods section — it is the headline API
- **Fix typo** in current description: "hightlight" → "highlight"
- **Update Requirements section**: change "Node.js version 14.7" to "Node.js ≥22" to match the updated `engines.node`
- **De-emphasize Legacy section**: move to bottom, make it a collapsed `<details>` block or shrink it — v1 CJS API is not the pitch
- **Remove "Roadmap" link** from README or inline it — ROADMAP.md is an internal artifact, not a selling point to evaluators
- **Badges**: add npm version badge and weekly downloads badge alongside the existing ones (signals activity and traction)
- **Keep Contributing section** — it is short and appropriate

**Test scenarios:**

- Test expectation: none — content-only change

**Verification:**

- README renders correctly on GitHub (check headings, code blocks, badges)
- `highlightMatch` section appears before `replace` section
- No broken links

---

- U3. **Add integration examples**

**Goal:** Show the canonical real-world use case — an accent-insensitive search input that highlights matches in results — in plain JS and React.

**Requirements:** R1, R4

**Dependencies:** U2 (appended to the restructured README)

**Files:**

- Modify: `README.md` (new `## Examples` section after API docs)

**Approach:**

Add a `## Real-World Examples` section (or `## Integration Examples`) with two subsections:

**Plain JS (browser):**

```
// Conceptual — implementer writes the actual code
// Show: input event listener → AccentFolding.highlightMatch on each result item → innerHTML
// Dataset: a small hardcoded array of names with accents
// Key point: filtering and highlighting in one loop
```

**React:**

```
// Conceptual — implementer writes the actual code
// Show: useState for query, filter array with af.replace() for comparison,
//        render matches with dangerouslySetInnerHTML={{ __html: af.highlightMatch(item, query) }}
// Note: dangerouslySetInnerHTML is safe here because the string content is app-controlled,
//        not user-generated HTML
// Keep the component under 25 lines — copy-paste friendly
```

**Key choices for implementer:**

- Use a dataset with accented names (e.g., López, Müller, Björk, Ñoño) to make the accent-insensitive aspect immediately visible
- The React example should use functional component + hooks, no class component
- Both examples should show the full loop: input → filter → highlight → display

**Test scenarios:**

- Test expectation: none — documentation-only change

**Verification:**

- Both examples render correctly in README preview
- Code blocks are syntactically valid JS/JSX
- `dangerouslySetInnerHTML` note is present in React example

---

- U4. **Cut a fresh release**

**Goal:** Publish a new version to npm so the package shows recent activity, incorporating all pending PRs.

**Requirements:** R5

**Dependencies:** U1, U2, U3 (all content changes land first), plus merging open PRs (#49 pnpm fix, #51 semantic-release v25, #44 eslint-config-prettier, #47 prettier)

**Files:**

- No file changes — operational steps only

**Approach:**

- Merge open PRs in dependency order: #49 → #51 → #44 → #47 (wait for dependabot rebases on #44/#47)
- Merge the content PR from U1–U3 with a `fix:` or `feat:` conventional commit prefix so semantic-release picks it up and bumps the version (a `feat:` commit triggers a minor version bump; a `fix:` triggers a patch)
- Semantic-release handles changelog, git tag, and npm publish automatically on merge to `main`
- Confirm publish on npmjs.com after CI completes

**Test scenarios:**

- Test expectation: none — operational/release step

**Verification:**

- `npm info accent-folding` shows new version and updated metadata
- GitHub shows a new release tag
- Weekly download trend on npmjs.com (check after 7 days)

---

- U5. **Update GitHub repository metadata**

**Goal:** Set the GitHub repo description and topics to match the new positioning, so the repo itself surfaces in GitHub search results.

**Requirements:** R6

**Dependencies:** U2 (positioning is settled)

**Files:**

- No file changes — GitHub API/UI operation

**Approach:**

- Set repo description via `gh api` or GitHub UI: mirror the sharpened npm description
- Add GitHub topics: `accent-folding`, `diacritics`, `search-highlight`, `highlight`, `autocomplete`, `typeahead`, `accent-insensitive`, `javascript`, `esm`, `zero-dependency`
- Topics are indexed by GitHub search and show on the repo page

**Test scenarios:**

- Test expectation: none — metadata operation

**Verification:**

- GitHub repo page shows updated description and topic pills
- `gh repo view ZRktty/accent-folding` reflects the changes

---

## System-Wide Impact

- **API surface:** No changes — `replace()` and `highlightMatch()` signatures are unchanged
- **npm publish:** New version triggered by semantic-release on merge to `main`; existing consumers unaffected (no breaking changes)
- **Unchanged invariants:** All 728 tests continue to pass; 100% coverage is maintained

---

## Risks & Dependencies

| Risk                                                                          | Mitigation                                                                                         |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `dangerouslySetInnerHTML` example causes concern                              | Add explicit one-line safety note in the React example                                             |
| New keywords attract wrong traffic (e.g., "fuzzy search" implies Levenshtein) | Frame keywords accurately in README; `highlightMatch` is accent-insensitive exact match, not fuzzy |
| Dependabot PRs (#44, #47) still pending rebase                                | U4 waits for them; U1–U3 can land independently                                                    |
| Conventional commit prefix affects version bump                               | Use `feat:` for the content PR to trigger a minor bump (signals meaningful update)                 |

---

## Sources & References

- Competitive data: npm downloads API, bundlephobia (researched 2026-05-25)
- Related PRs: #49 (pnpm fix), #51 (semantic-release v25), #44 (eslint-config-prettier), #47 (prettier)
- `src/accentFolding.js` — current API implementation
- `ROADMAP.md` — scope boundary for TypeScript/CJS
