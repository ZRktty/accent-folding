# typesnapshot — Real-World Integration Findings

Tested against [`accent-folding`](https://github.com/ZRktty/accent-folding) v2.7.0: a published npm library with a hand-authored `index.d.ts` and no TypeScript source (JS library + separate `.d.ts`).

---

## Setup

```
typesnapshot -e index.d.ts --update
```

Non-default entry point (`-e index.d.ts`) worked correctly.

---

## Scorecard across all three versions

| #   | Scenario                        | 0.1.1 | 0.1.2 | 0.1.3       |
| --- | ------------------------------- | ----- | ----- | ----------- |
| 1   | Removed export                  | ✓     | ✓     | ✓           |
| 2   | Type alias structural change    | ✓     | ✓     | ✓ + cascade |
| 3   | Class method return type change | ✗     | ✓     | ✓           |
| 4   | New method added to class       | ✗     | ✓     | ✓           |
| 5   | Interface member change         | ✗     | ✓     | ✓           |
| 6   | Static method removed           | ✗     | ✗     | ✗           |
| 7   | Constructor signature change    | ✗     | ✗     | ✓           |

---

## Snapshot format evolution

**0.1.1** — export names and categories only, no member resolution:

```
type-alias AccentMap: { [x: string]: string; }
interface MatchPosition: MatchPosition
class default: typeof AccentFolding
```

**0.1.2** — instance methods and interface members resolved:

```
type-alias AccentMap: { [x: string]: string; }
interface MatchPosition: { end: number; start: number }
class default: { highlightMatch: ...; matchPositions: ...; replace: ... }
```

**0.1.3** — constructor signature added to class:

```
type-alias AccentMap: { [x: string]: string; }
interface MatchPosition: { end: number; start: number }
class default: { highlightMatch: ...; matchPositions: ...; new(newMap: null | undefined | { [x: string]: string; }); replace: ... }
```

---

## Notable 0.1.3 behaviour

**Constructor tracking (test 7)** — now caught:

```diff
- constructor(newMap?: AccentMap | null);
+ constructor(newMap: AccentMap);
```

```text
~ CHANGED  class default  [breaking]
    before: { ...; new(newMap: null | undefined | { [x: string]: string; }); ... }
    after:  { ...; new(newMap: { [x: string]: string; }); ... }
```

**Type alias cascade (test 2)** — 0.1.3 detects that changing `AccentMap` ripples into the constructor signature, reporting two breaking changes from one edit:

```
~ CHANGED  type-alias AccentMap  [breaking]
~ CHANGED  class default  [breaking]  ← constructor now references updated AccentMap
```

---

## Remaining gap

Static methods are not included in the class snapshot. Removing `convertAccentMapToArray` passes silently:

```diff
- static convertAccentMapToArray(accentMap: AccentMap): Array<[string, string]>;
```

```text
✓ Public type surface unchanged.
```

This is the one outstanding gap. For `accent-folding` this method is part of the public API, so a removal or signature change would not be detected.

---

## Verdict

0.1.3 is comprehensive for all instance-side class members (methods + constructor) and interface members. The only remaining blind spot is static methods. Worth keeping — it now catches scenarios that `test-types.ts` usage tests do not cover, and the cascade detection adds extra signal for ripple-effect breaking changes.
