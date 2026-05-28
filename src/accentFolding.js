import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const defaultAccentMap = require('./accentMap.json');

class AccentFolding {
	#cache;
	#accentMap;

	constructor(newMap = null) {
		if (newMap !== null && typeof newMap !== 'object') {
			throw new TypeError('newMap must be an object');
		}
		this.#accentMap = new Map([
			...AccentFolding.convertAccentMapToArray(defaultAccentMap),
		]);
		this.#cache = new Map();
		if (newMap) {
			this.#extendAccentMap(newMap);
		}
	}

	#fold(s) {
		if (!s) return '';
		s = s.normalize('NFC');
		if (this.#cache.has(s)) return this.#cache.get(s);

		const ret = [...s]
			.map((char) => this.#accentMap.get(char) || char)
			.join('');
		this.#cache.set(s, ret);
		return ret;
	}

	replace(text) {
		if (typeof text !== 'string') {
			throw new TypeError('Input must be a string');
		}
		return this.#fold(text);
	}

	#findMatchPositions(strNFC, fragment) {
		const offsets = [];
		let foldedStr = '';
		for (const char of [...strNFC]) {
			offsets.push(foldedStr.length);
			foldedStr += this.#accentMap.get(char) ?? char;
		}
		offsets.push(foldedStr.length);

		const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const fragmentFolded = this.#fold(escapedFragment).toLowerCase();
		const re = new RegExp(fragmentFolded, 'g');

		const positions = [];
		let lastOriginalIndex = 0;

		foldedStr.toLowerCase().replace(re, (match, foldedIndex) => {
			const foldedEnd = foldedIndex + match.length;
			const origStart = offsets.findIndex(
				(_, i) => offsets[i] <= foldedIndex && foldedIndex < offsets[i + 1]
			);
			const origEnd = offsets.findIndex(
				(_, i) => offsets[i] <= foldedEnd && foldedEnd <= offsets[i + 1]
			);

			if (origStart < 0 || origEnd < 0 || origStart < lastOriginalIndex) return;

			positions.push({ start: origStart, end: origEnd + 1 });
			lastOriginalIndex = origEnd + 1;
		});

		return positions;
	}

	matchPositions(str, fragment) {
		if (!fragment) return [];
		if (typeof str !== 'string' || typeof fragment !== 'string') {
			throw new TypeError('Both str and fragment must be strings');
		}
		return this.#findMatchPositions(str.normalize('NFC'), fragment);
	}

	highlightMatch(str, fragment, wrapTag = 'b') {
		try {
			if (!fragment) return str;

			if (typeof str !== 'string' || typeof fragment !== 'string') {
				throw new TypeError('Both str and fragment must be strings');
			}

			const allowedWrapTags = new Set(['b', 'strong', 'mark', 'span']);
			if (typeof wrapTag !== 'string' || !allowedWrapTags.has(wrapTag)) {
				wrapTag = 'b';
			}

			const strNFC = str.normalize('NFC');
			const positions = this.#findMatchPositions(strNFC, fragment);

			if (!positions.length) return str;

			let result = '';
			let last = 0;
			for (const { start, end } of positions) {
				result += this.#escapeHtml(strNFC.slice(last, start));
				result += `<${wrapTag}>${this.#escapeHtml(strNFC.slice(start, end))}</${wrapTag}>`;
				last = end;
			}
			result += this.#escapeHtml(strNFC.slice(last));
			return result;
		} catch (error) {
			console.error('Error in highlightMatch:', error.message);
			throw error;
		}
	}

	#escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	static convertAccentMapToArray(accentMap) {
		return Object.entries(accentMap);
	}

	#extendAccentMap(newMap) {
		for (const [key, value] of Object.entries(newMap)) {
			this.#accentMap.set(key, value);
		}
		this.#cache.clear(); // Clear cache to ensure new mappings are used
	}
}

export default AccentFolding;
