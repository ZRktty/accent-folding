# accent-folding ![GitHub package.json version](https://img.shields.io/github/package-json/v/zr87/accent-folding) [![Coverage Status](https://coveralls.io/repos/github/zr87/accent-folding/badge.svg?branch=main)](https://coveralls.io/github/zr87/accent-folding?branch=main)

## Description

A case-insensitive accent folding functions to replace accented characters with their unaccented equivalents
or hightlight matched terms in a string, ignoring accents.

## Installation

Install with npm:

```shell
npm install accent-folding
```

or with pnpm:

```shell
pnpm install accent-folding
```

or even with yarn:

```shell
yarn add accent-folding
```

## Public Methods

### `replace`

Replaces accented characters in a string with their unaccented equivalents.

#### Key Features:

- Handles various Unicode characters, including fullwidth ASCII
- Preserves original string formatting in the output

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

af.replace('Fulanilo López'); // --> "Fulanilo Lopez"
```

### `highlightMatch`

Highlights matched terms in a string, ignoring accents.

#### Key Features:

- Accent-insensitive matching
- Customizable highlight wrapping (can use any HTML tag)
- Preserves original string formatting in the output
- Handles various Unicode characters, including fullwidth ASCII
- wraps string fragment in `<b>` html tag by default.

#### Potential Use Cases:

- Search functionality in applications where accents should be ignored
- Highlighting matched terms in search results

```js
import AccentFolding from 'accent-folding';

const af = new AccentFolding();

af.highlightMatch('Fulanilo López', 'lo'); // --> "Fulani<b>lo</b> <b>Ló</b>pez"
```

Use the 3d argument to specify the wrapping html tag (strong, em, span etc.):

```js
af.highlightMatch('Fulanilo López', 'lo', 'strong'); // --> "Fulani<strong>lo</strong> <strong>Ló</strong>pez"
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

## Requirements

Node.js version 14.7 or higher

## Legacy usage (v1)

Install with npm:

```
npm install accent-folding@1
```

Example:

```js
const accentFoldedHighlight = require('accent-folding');

accentFoldedHighlight('Fulanilo López', 'lo'); // --> "Fulani<b>lo</b> <b>Ló</b>pez"
accentFoldedHighlight('Fulanilo López', 'lo', 'strong'); // --> "Fulani<strong>lo</strong> <strong>Ló</strong>pez"
```

## Roadmap

See the [Roadmap](./ROADMAP.md 'View the project roadmap') for planned features and future improvements.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
