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

			// Build a folded string with an offset table that maps each position
			// in the folded string back to the corresponding original character index.
			// This handles multi-character expansions (e.g. ß → ss, æ → ae).
			const chars = [...strNFC];
			const offsets = []; // offsets[i] = start position in foldedStr for chars[i]
			let foldedStr = '';
			for (const char of chars) {
				offsets.push(foldedStr.length);
				foldedStr += this.#accentMap.get(char) ?? char;
			}
			offsets.push(foldedStr.length); // sentinel

			const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const fragmentFolded = this.#fold(escapedFragment).toLowerCase();

			const re = new RegExp(fragmentFolded, 'g');
			let result = '';
			let lastOriginalIndex = 0;
			let hasMatch = false;

			foldedStr.toLowerCase().replace(re, (match, foldedIndex) => {
				// Map folded indices back to original character indices.
				const foldedEnd = foldedIndex + match.length;
				const origStart = offsets.findIndex(
					(_, i) => offsets[i] <= foldedIndex && foldedIndex < offsets[i + 1]
				);
				const origEnd = offsets.findIndex(
					(_, i) => offsets[i] <= foldedEnd && foldedEnd <= offsets[i + 1]
				);

				if (origStart < 0 || origEnd < 0 || origStart < lastOriginalIndex)
					return;

				hasMatch = true;
				result += this.#escapeHtml(strNFC.slice(lastOriginalIndex, origStart));
				result += `<${wrapTag}>${this.#escapeHtml(strNFC.slice(origStart, origEnd + 1))}</${wrapTag}>`;
				lastOriginalIndex = origEnd + 1;
			});

			result += this.#escapeHtml(strNFC.slice(lastOriginalIndex));

			return hasMatch ? result : str;
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
