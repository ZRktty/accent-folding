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

			const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const strNFC = str.normalize('NFC');
			const strFolded = this.#fold(strNFC).toLowerCase();
			const fragmentFolded = this.#fold(escapedFragment).toLowerCase();

			const re = new RegExp(fragmentFolded, 'g');
			let result = '';
			let lastIndex = 0;
			let hasMatch = false;

			strFolded.replace(re, (match, index) => {
				hasMatch = true;
				result += this.#escapeHtml(strNFC.slice(lastIndex, index));
				result += `<${wrapTag}>${this.#escapeHtml(strNFC.slice(index, index + match.length))}</${wrapTag}>`;
				lastIndex = index + match.length;
			});

			result += this.#escapeHtml(strNFC.slice(lastIndex));

			return hasMatch ? result : str;
		} catch (error) {
			console.error('Error in highlightMatch:', error.message);
			throw error; // Return original string if there's an error
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
