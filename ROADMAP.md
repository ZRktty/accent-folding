## Current Release (v2.0.0)

- [x] Feature 1: move to ESM
- [x] Feature 2: Adding support custom accent maps
- [x] Improvement: Enhancing performance, rewrite using ES6
- [x] Documentation: Detailed examples and use cases.

## What's `next`

- [x] chore: Add code quality tools like ESlint, EditorConfig & Prettier
- [x] add `replace` method for replacing accents with it's unaccented equivalents without wrapping
- [x] Add coverage reporting

## Future Plans

- [x] Add TypeScript support
- [ ] Add `attw` (`@arethetypeswrong/cli`) validation — blocked by upstream [fflate@0.8.3 crash](https://github.com/arethetypeswrong/arethetypeswrong.github.io/issues/262), revisit once a patched release ships
- [x] Add support for CommonJS — dual ESM + CJS build via tsup; `require('accent-folding')` works in Jest, Next.js pages router, and any CJS toolchain
