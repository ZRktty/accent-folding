/**
 * CJS integration smoke test — run with: node test/integration/cjs.cjs
 * Exercises the dist/cjs build to confirm it loads and behaves correctly.
 */
'use strict';

const AccentFolding = require('../../dist/cjs/index.cjs');

let passed = 0;
let failed = 0;

function assert(label, condition) {
	if (condition) {
		passed++;
	} else {
		failed++;
		console.error(`  FAIL: ${label}`);
	}
}

// --- require() shape: class should be the direct export (no .default needed) ---
assert('require returns a class directly', typeof AccentFolding === 'function');
assert('.default is also the class (interop)', typeof AccentFolding.default === 'function');

const af = new AccentFolding();

// --- replace ---
assert('replace: strips accent', af.replace('café') === 'cafe');
assert('replace: preserves ASCII', af.replace('hello') === 'hello');
assert('replace: multi-char mapping (ß→ss)', af.replace('Straße') === 'Strasse');

// --- highlightMatch ---
assert(
	'highlightMatch: wraps match preserving accented char',
	af.highlightMatch('López', 'lo') === '<b>Ló</b>pez'
);
assert(
	'highlightMatch: returns original when no match',
	af.highlightMatch('Hello', 'xyz') === 'Hello'
);
assert(
	'highlightMatch: custom tag',
	af.highlightMatch('café', 'ca', 'mark') === '<mark>ca</mark>fé'
);

// --- matchPositions ---
const positions = af.matchPositions('Fulanilo López', 'lo');
assert('matchPositions: finds two matches', positions.length === 2);
assert('matchPositions: start/end are numbers', typeof positions[0].start === 'number');
assert(
	'matchPositions: slices back to original text',
	'Fulanilo López'.slice(positions[1].start, positions[1].end) === 'Ló'
);
assert('matchPositions: empty fragment → []', af.matchPositions('hello', '').length === 0);

// --- custom map ---
const afCustom = new AccentFolding({ ö: 'oe' });
assert('custom map: override works', afCustom.replace('Föhn') === 'Foehn');

// --- static method ---
const entries = AccentFolding.convertAccentMapToArray({ á: 'a', ñ: 'n' });
assert('convertAccentMapToArray returns pairs', entries.length === 2 && entries[0][0] === 'á');

// --- result ---
if (failed > 0) {
	console.error(`\nCJS integration: ${failed} assertion(s) failed`);
	process.exit(1);
}
console.log(`CJS integration: ${passed} assertions passed`);
