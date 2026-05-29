# accent-folding [![npm version](https://img.shields.io/npm/v/accent-folding)](https://www.npmjs.com/package/accent-folding) [![npm downloads](https://img.shields.io/npm/dw/accent-folding)](https://www.npmjs.com/package/accent-folding) [![Bundle size](https://img.shields.io/bundlephobia/minzip/accent-folding)](https://bundlephobia.com/package/accent-folding) [![GitHub package.json version](https://img.shields.io/github/package-json/v/ZRktty/accent-folding)](https://github.com/ZRktty/accent-folding) [![Coverage Status](https://coveralls.io/repos/github/ZRktty/accent-folding/badge.svg?branch=main)](https://coveralls.io/github/ZRktty/accent-folding?branch=main)

**[Live demo →](https://zrktty.github.io/accent-folding/)**

Searching "cafe" should find "café". Highlighting "lo" in "López" should show `<b>Ló</b>pez` — not stripped text.

`accent-folding` is the only library that solves both: accent-insensitive matching that returns the **original accented string** with HTML markup around matches — or raw index positions for React, React Native, PDF, canvas, and any environment where HTML strings don't belong. Zero dependencies. ~2.4 kB gzipped. Ships as **dual ESM + CJS** — works in Node ESM, CommonJS, Jest (no transform config), Next.js pages router, and any bundler.

## Installation

Install with npm:

```shell
npm install accent-folding
```

or with pnpm:

```shell
pnpm install accent-folding
```

or with bun:

```shell
bun add accent-folding
```

or with yarn:

```shell
yarn add accent-folding
```

## Module formats

The package ships as a **dual ESM + CJS** build. No configuration needed — your toolchain picks the right format automatically:

| Environment                                              | Format used                |
| -------------------------------------------------------- | -------------------------- |
| `import` / bundlers (Vite, webpack, Rollup)              | ESM (`dist/esm/index.js`)  |
| `require()` / Jest (no transform) / Next.js pages router | CJS (`dist/cjs/index.cjs`) |

```js
// ESM
import AccentFolding from 'accent-folding';

// CommonJS
const AccentFolding = require('accent-folding');

const af = new AccentFolding();
console.log(af.replace('café')); // → 'cafe'
```

## TypeScript

Full type declarations are included. No `@types/` package needed.

```ts
import AccentFolding, { type AccentMap, type MatchPosition } from 'accent-folding';

const af = new AccentFolding();

const replaced: string = af.replace('café');
const positions: MatchPosition[] = af.matchPositions('López', 'lo');
const highlighted: string = af.highlightMatch('López', 'lo');
const highlightedMark: string = af.highlightMatch('López', 'lo', 'mark');

// Custom accent map with typed argument
const customMap: AccentMap = { ö: 'oe', ü: 'ue' };
const afCustom = new AccentFolding(customMap);

// Type your own rendering helper
function renderParts(text: string, positions: MatchPosition[]) { ... }
```

## Public Methods

### `matchPositions`

Returns an array of `{ start, end }` index pairs for every accent-insensitive match of `fragment` in `str`. `end` is exclusive — pass directly to `str.slice(start, end)`.

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

af.matchPositions('Fulanilo López', 'lo');
// → [{ start: 6, end: 8 }, { start: 9, end: 11 }]

af.matchPositions('Straße', 'ss');
// → [{ start: 4, end: 5 }]  ß treated as ss, position points back to ß

af.matchPositions('Hello World', 'xyz');
// → []
```

This is the framework-agnostic primitive. Use it when you need to control rendering yourself — React without `dangerouslySetInnerHTML`, React Native, PDF generation, canvas, terminal ANSI codes, and so on.

### `highlightMatch`

Matches a search fragment against a string, ignoring accents, and wraps each match in an HTML tag — returning the original accented characters intact.

- Accent-insensitive matching
- Returns original accented text with HTML markup around matches
- Customizable highlight tag (default: `<b>`, use `strong`, `mark`, `span`, etc.)
- Handles various Unicode characters, including fullwidth ASCII

> **Note:** `highlightMatch` returns an HTML string and does not escape its inputs. Only inject the output into the DOM when `str` comes from trusted, app-controlled data — not from untrusted user input.

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

af.highlightMatch('Fulanilo López', 'lo'); // --> "Fulani<b>lo</b> <b>Ló</b>pez"
```

Use the third argument to specify the wrapping HTML tag:

```js
af.highlightMatch('Fulanilo López', 'lo', 'strong'); // --> "Fulani<strong>lo</strong> <strong>Ló</strong>pez"
af.highlightMatch('Fulanilo López', 'lo', 'mark'); // --> "Fulani<mark>lo</mark> <mark>Ló</mark>pez"
```

### `replace`

Replaces accented characters in a string with their unaccented equivalents.

- Handles various Unicode characters, including fullwidth ASCII
- Preserves original string formatting in the output

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

af.replace('Fulanilo López'); // --> "Fulanilo Lopez"
```

## Extending and Overriding the Accent Map

The `AccentFolding` class allows you to extend or override the default accent map by providing a custom map to the constructor.

### Extending the Accent Map

To extend the accent map with new mappings, pass an object with the new mappings to the constructor. For example:

```js
import AccentFolding from 'accent-folding';

const customAccentMap = { ö: 'oe', '✝': 't' };
const accentFolder = new AccentFolding(customAccentMap);

console.log(accentFolder.replace('Föhn')); // Outputs: Foehn
console.log(accentFolder.replace('✝illa')); // Outputs: tilla
```

## Real-World Examples

### CommonJS (Jest, Next.js pages router)

```js
const AccentFolding = require('accent-folding');

const af = new AccentFolding();
const names = ['López', 'Müller', 'Björk', 'Ñoño'];

// Filter and highlight — identical API to ESM
const results = names
	.filter((name) =>
		af.replace(name).toLowerCase().includes(af.replace('lo').toLowerCase())
	)
	.map((name) => af.highlightMatch(name, 'lo'));

console.log(results); // ['<b>Ló</b>pez']
```

### Plain JS (browser)

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();
const names = ['López', 'Müller', 'Björk', 'Ñoño', 'García', 'Renée'];

const input = document.querySelector('#search');
const list = document.querySelector('#results');

input.addEventListener('input', () => {
	const query = input.value.trim();
	const matches = query
		? names.filter((name) =>
				af.replace(name).toLowerCase().includes(af.replace(query).toLowerCase())
			)
		: names;

	list.innerHTML = matches
		.map((name) => `<li>${query ? af.highlightMatch(name, query) : name}</li>`)
		.join('');
});
```

### React — with `matchPositions` (recommended)

Use `matchPositions` to build real React elements — no `dangerouslySetInnerHTML`, no ESLint warnings, works with concurrent mode and React Server Components.

```jsx
import { useState } from 'react';
import AccentFolding from 'accent-folding';

const af = new AccentFolding();
const names = ['López', 'Müller', 'Björk', 'Ñoño', 'García', 'Renée'];

function Highlight({ text, query }) {
	const positions = af.matchPositions(text, query);
	if (!positions.length) return <span>{text}</span>;

	const parts = [];
	let last = 0;
	for (const { start, end } of positions) {
		if (start > last) parts.push(text.slice(last, start));
		parts.push(
			<mark key={start} className="bg-yellow-200 rounded px-0.5 font-semibold">
				{text.slice(start, end)}
			</mark>
		);
		last = end;
	}
	parts.push(text.slice(last));
	return <span>{parts}</span>;
}

export default function AccentSearch() {
	const [query, setQuery] = useState('');

	const matches = query
		? names.filter((name) =>
				af.replace(name).toLowerCase().includes(af.replace(query).toLowerCase())
			)
		: names;

	return (
		<div>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search..."
			/>
			<ul>
				{matches.map((name) => (
					<li key={name}>
						<Highlight text={name} query={query} />
					</li>
				))}
			</ul>
		</div>
	);
}
```

### React Native

`highlightMatch` is useless in React Native — there is no DOM. `matchPositions` is the only way to highlight accented text in a native app.

```jsx
import { Text, StyleSheet } from 'react-native';
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

function Highlight({ text, query }) {
	const positions = af.matchPositions(text, query);
	if (!positions.length) return <Text>{text}</Text>;

	const parts = [];
	let last = 0;
	for (const { start, end } of positions) {
		if (start > last)
			parts.push(<Text key={`t-${last}`}>{text.slice(last, start)}</Text>);
		parts.push(
			<Text key={`h-${start}`} style={styles.highlight}>
				{text.slice(start, end)}
			</Text>
		);
		last = end;
	}
	parts.push(<Text key="tail">{text.slice(last)}</Text>);
	return <Text>{parts}</Text>;
}

const styles = StyleSheet.create({
	highlight: { fontWeight: 'bold', backgroundColor: '#fef08a' },
});
```

A full React + TypeScript demo (Vite, typed `AccentMap`, search highlight, custom map showcase) is available in [`demo/`](demo/). Run it with:

```shell
cd demo && pnpm dev
```

## Requirements

Node.js ≥18

<details>
<summary>Legacy usage (v1 CommonJS API — accent-folding@1)</summary>

v1 exported a single function (no class). If you need `require()` support with the **current** API, see the [Module formats](#module-formats) section above — v2+ ships dual ESM + CJS natively.

Install v1:

```shell
npm install accent-folding@1
```

Example:

```js
const accentFoldedHighlight = require('accent-folding');

accentFoldedHighlight('Fulanilo López', 'lo'); // --> "Fulani<b>lo</b> <b>Ló</b>pez"
accentFoldedHighlight('Fulanilo López', 'lo', 'strong'); // --> "Fulani<strong>lo</strong> <strong>Ló</strong>pez"
```

</details>

## Migrating from `latinize`

[`latinize`](https://github.com/dundalek/latinize) was archived in November 2024. Here's how to migrate to `accent-folding`:

```diff
- import latinize from 'latinize';
+ import AccentFolding from 'accent-folding';
+ const af = new AccentFolding();

- const result = latinize('Ñoño García');
+ const result = af.replace('Ñoño García');

- const filtered = names.filter(n => latinize(n).toLowerCase().includes(latinize(query).toLowerCase()));
+ const filtered = names.filter(n => af.replace(n).toLowerCase().includes(af.replace(query).toLowerCase()));

// New: highlight matches in results (no latinize equivalent)
+ const highlighted = af.highlightMatch('López', 'lo'); // → '<b>Ló</b>pez'
```

### How they compare

|                             | `latinize`                         | `accent-folding`                                                                |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| Status                      | ❌ Archived Nov 2024               | ✅ Actively maintained                                                          |
| `highlightMatch()`          | ❌ No                              | ✅ Unique — wraps matches in HTML while preserving original accented characters |
| `matchPositions()`          | ❌ No                              | ✅ Framework-agnostic — works in React, React Native, PDF, canvas, terminal     |
| NFC/NFD normalization       | ❌ NFD input produces wrong output | ✅ Handles both automatically                                                   |
| Result caching              | ❌ No                              | ✅ Yes — repeated calls with the same input are cached                          |
| Test coverage               | ❌ Not reported                    | ✅ 100% line + branch coverage                                                  |
| TypeScript                  | ⚠️ Added in v2 (archived)          | ✅ Full types, no `@types/` needed                                              |
| Latin script coverage       | ✅ ~1,000 entries                  | ✅ ~700 entries (same practical coverage for Western European text)             |
| Cyrillic / IPA / subscripts | ✅ Yes                             | ❌ No — Latin script only                                                       |
| Bundle size                 | ~6 kB gzipped                      | ~2.7 kB gzipped                                                                 |

**Honest caveat:** `latinize` covers ~1,000 character mappings including Cyrillic, IPA phonetic symbols, and subscripts. `accent-folding` focuses on Latin script only (~700 entries). For typical search/autocomplete over Western European names and text the coverage is identical — but if you need to fold Russian, Greek, or IPA, [`transliteration`](https://www.npmjs.com/package/transliteration) is the right choice.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Development requires Node.js ≥22** (ESLint v10 constraint). The published package supports Node.js ≥18 for consumers.

## Credits

The initial idea came from the article [Accent Folding for Auto-Complete](https://alistapart.com/article/accent-folding-for-auto-complete/) by Carlos Bueno on A List Apart (February 2010). This library has since grown beyond that original concept, but the credit belongs there.
