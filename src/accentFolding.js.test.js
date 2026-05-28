import { expect, describe, it, beforeEach } from 'vitest';
import AccentFolding from './accentFolding.js';
import accentMap from './accentMap.json';

describe('AccentFolding', () => {
	let accentFolder;

	beforeEach(() => {
		accentFolder = new AccentFolding();
	});

	describe('matchPositions', () => {
		it('returns [] for empty fragment', () => {
			expect(accentFolder.matchPositions('Hello', '')).toEqual([]);
		});

		it('returns [] when no match', () => {
			expect(accentFolder.matchPositions('Hello World', 'xyz')).toEqual([]);
		});

		it('returns [] for empty string', () => {
			expect(accentFolder.matchPositions('', 'lo')).toEqual([]);
		});

		it('throws TypeError for non-string inputs', () => {
			expect(() => accentFolder.matchPositions(123, 'lo')).toThrow(TypeError);
			expect(() => accentFolder.matchPositions('text', 123)).toThrow(TypeError);
		});

		it('finds accent-insensitive matches and returns correct positions', () => {
			expect(accentFolder.matchPositions('Fulanilo López', 'lo')).toEqual([
				{ start: 6, end: 8 },
				{ start: 9, end: 11 },
			]);
		});

		it('is case insensitive', () => {
			expect(accentFolder.matchPositions('FULANILO LÓPEZ', 'lo')).toEqual([
				{ start: 6, end: 8 },
				{ start: 9, end: 11 },
			]);
		});

		it('handles multi-character folding: ß matched by ss', () => {
			expect(accentFolder.matchPositions('Straße', 'ss')).toEqual([
				{ start: 4, end: 5 },
			]);
		});

		it('handles multi-character folding: æ matched by ae', () => {
			expect(accentFolder.matchPositions('encyclopædia', 'ae')).toEqual([
				{ start: 8, end: 9 },
			]);
		});

		it('positions slice back to the original matched text', () => {
			const text = 'Fulanilo López';
			const positions = accentFolder.matchPositions(text, 'lo');
			expect(text.slice(positions[0].start, positions[0].end)).toBe('lo');
			expect(text.slice(positions[1].start, positions[1].end)).toBe('Ló');
		});

		it('positions slice back the correct text for ß', () => {
			const text = 'Straße';
			const [{ start, end }] = accentFolder.matchPositions(text, 'ss');
			expect(text.slice(start, end)).toBe('ß');
		});

		it('handles multiple matches', () => {
			const positions = accentFolder.matchPositions('lólá lòlã', 'la');
			expect(positions).toEqual([
				{ start: 2, end: 4 },
				{ start: 7, end: 9 },
			]);
		});

		it('handles special characters in fragment', () => {
			expect(accentFolder.matchPositions('a+b=c', '+')).toEqual([
				{ start: 1, end: 2 },
			]);
		});
	});

	describe('highlightMatch', () => {
		it('should throw TypeError if str is not a string', () => {
			expect(() => accentFolder.highlightMatch(123, 'test')).toThrow(TypeError);
			expect(() => accentFolder.highlightMatch(123, 'test')).toThrow(
				'Both str and fragment must be strings'
			);
		});

		it('should throw TypeError if fragment is not a string', () => {
			expect(() => accentFolder.highlightMatch('test', 123)).toThrow(TypeError);
			expect(() => accentFolder.highlightMatch('test', 123)).toThrow(
				'Both str and fragment must be strings'
			);
		});

		it('should fall back to "b" for non-string or disallowed wrapTag', () => {
			expect(accentFolder.highlightMatch('test', 'es', 123)).toBe(
				't<b>es</b>t'
			);
			expect(accentFolder.highlightMatch('test', 'es', 'script')).toBe(
				't<b>es</b>t'
			);
			expect(accentFolder.highlightMatch('test', 'es', 'img')).toBe(
				't<b>es</b>t'
			);
		});

		it('should recognize simple accents', () => {
			expect(accentFolder.highlightMatch('Fulanilo López', 'lo')).toBe(
				'Fulani<b>lo</b> <b>Ló</b>pez'
			);
			expect(accentFolder.highlightMatch('Erik Lørgensen', 'lo')).toBe(
				'Erik <b>Lø</b>rgensen'
			);
			expect(accentFolder.highlightMatch('James Lö', 'lo')).toBe(
				'James <b>Lö</b>'
			);
		});

		it('wraps matched fragment with custom tag', () => {
			expect(
				accentFolder.highlightMatch('Fulanilo López', 'lo', 'strong')
			).toBe('Fulani<strong>lo</strong> <strong>Ló</strong>pez');
		});

		it('is case insensitive', () => {
			expect(accentFolder.highlightMatch('FULANILO LÓPEZ', 'lo')).toBe(
				'FULANI<b>LO</b> <b>LÓ</b>PEZ'
			);
		});

		it('handles empty strings', () => {
			expect(accentFolder.highlightMatch('', 'test')).toBe('');
			expect(accentFolder.highlightMatch('Test', '')).toBe('Test');
		});

		it('returns original string when no match is found', () => {
			expect(accentFolder.highlightMatch('Hello World', 'xyz')).toBe(
				'Hello World'
			);
		});

		it('handles multiple matches', () => {
			expect(accentFolder.highlightMatch('lólá lòlã', 'la')).toBe(
				'ló<b>lá</b> lò<b>lã</b>'
			);
		});

		it('handles special characters in fragment', () => {
			expect(accentFolder.highlightMatch('a+b=c', '+')).toBe('a<b>+</b>b=c');
		});

		describe('multi-character folding', () => {
			it('highlights ß when searching ss', () => {
				expect(accentFolder.highlightMatch('Straße', 'ss')).toBe(
					'Stra<b>ß</b>e'
				);
			});

			it('highlights æ when searching ae', () => {
				expect(accentFolder.highlightMatch('encyclopædia', 'ae')).toBe(
					'encyclop<b>æ</b>dia'
				);
			});

			it('does not double-highlight a char that expands to multiple folded chars', () => {
				// ß folds to ss; searching s finds both positions in foldedStr but should wrap ß once
				expect(accentFolder.highlightMatch('Straße', 's')).toBe(
					'<b>S</b>tra<b>ß</b>e'
				);
			});
		});

		// it('preserves HTML in original string', () => {
		//     expect(accentFold.highlightMatch("<p>Héllo</p>", "he")).toBe("<p><b>Hé</b>llo</p>");
		// });
	});

	describe('replace', () => {
		it('should throw TypeError if input is not a string', () => {
			expect(() => accentFolder.replace(123)).toThrow(TypeError);
			expect(() => accentFolder.replace(123)).toThrow('Input must be a string');
		});

		it.each(Object.entries(accentMap))(
			'should replace %s with %s',
			(accentedChar, expectedChar) => {
				expect(accentFolder.replace(accentedChar)).toBe(expectedChar);
			}
		);
		it('should recognize simple accents', () => {
			expect(accentFolder.replace('naïve')).toBe('naive');
		});

		it('should replace multiple accented characters', () => {
			expect(accentFolder.replace('résumé')).toBe('resume');
		});

		it('should handle mixed accented and non-accented text', () => {
			expect(accentFolder.replace('Café au lait')).toBe('Cafe au lait');
		});
		it('should return the same string if no accented characters are present', () => {
			expect(accentFolder.replace('hello world')).toBe('hello world');
		});

		it('should not lowercase plain uppercase ASCII letters', () => {
			// Regression: H, I, J, N, P, S, T, W, Y were accidentally in the accent
			// map and got silently lowercased (e.g. replace('NORWAY') → 'nORwAy')
			expect(accentFolder.replace('NORWAY')).toBe('NORWAY');
			expect(accentFolder.replace('PARIS')).toBe('PARIS');
			expect(accentFolder.replace('John')).toBe('John');
			expect(accentFolder.replace('HIJNTPSWJ')).toBe('HIJNTPSWJ');
		});

		it('should replace Ĺ with L (regression: mapping typo prevention)', () => {
			expect(accentFolder.replace('Ĺukasz')).toBe('Lukasz');
		});

		it('should handle empty string', () => {
			expect(accentFolder.replace('')).toBe('');
		});

		describe('multi-character mappings', () => {
			it('replaces ß with ss (German sharp s)', () => {
				expect(accentFolder.replace('Straße')).toBe('Strasse');
			});

			it('replaces æ with ae', () => {
				expect(accentFolder.replace('encyclopædia')).toBe('encyclopaedia');
			});

			it('replaces œ with oe', () => {
				expect(accentFolder.replace('cœur')).toBe('coeur');
			});

			it('replaces Þ with TH (Icelandic thorn, uppercase)', () => {
				expect(accentFolder.replace('Þór')).toBe('THor');
			});
		});
	});

	describe('map correctness', () => {
		it('does not alter ASCII text', () => {
			expect(accentFolder.replace('Hello World')).toBe('Hello World');
			expect(accentFolder.replace('JAPAN')).toBe('JAPAN');
			expect(accentFolder.replace('NORWAY')).toBe('NORWAY');
			expect(accentFolder.replace('WITTY')).toBe('WITTY');
		});

		it('folds common accented characters correctly', () => {
			expect(accentFolder.replace('naïve')).toBe('naive');
			expect(accentFolder.replace('résumé')).toBe('resume');
			expect(accentFolder.replace('Ñoño')).toBe('Nono');
			expect(accentFolder.replace('García')).toBe('Garcia');
			expect(accentFolder.replace('Müller')).toBe('Muller');
			expect(accentFolder.replace('Björk')).toBe('Bjork');
		});

		it('maps Ĺ (U+0139) to L', () => {
			expect(accentFolder.replace('Ĺ')).toBe('L');
		});

		it('expands uppercase multi-character ligatures', () => {
			expect(accentFolder.replace('ẞ')).toBe('SS'); // ẞ → SS (uppercase sharp S)
			expect(accentFolder.replace('Ǽ')).toBe('AE'); // Ǽ (Æ+acute) → AE
			expect(accentFolder.replace('ǽ')).toBe('ae'); // ǽ → ae
		});
	});

	describe('NFD input handling', () => {
		it('replace() handles NFD-encoded input identically to NFC', () => {
			const nfc = 'Ñoño García';
			const nfd = nfc.normalize('NFD');
			expect(accentFolder.replace(nfd)).toBe(accentFolder.replace(nfc));
			expect(accentFolder.replace(nfd)).toBe('Nono Garcia');
		});

		it('highlightMatch() handles NFD input correctly', () => {
			expect(accentFolder.highlightMatch('ñoño'.normalize('NFD'), 'n')).toBe(
				'<b>ñ</b>o<b>ñ</b>o'
			);
		});
	});

	describe('constructor', () => {
		it('should initialize with default accent map', () => {
			expect(accentFolder.replace('á')).toBe('a');
		});

		it('should extend the accent map with new mappings if provided', () => {
			const customAccentFolder = new AccentFolding({ ö: 'oe', '✝': 't' });
			expect(customAccentFolder.replace('Föhn')).toBe('Foehn');
			expect(customAccentFolder.replace('✝illa')).toBe('tilla');
		});

		it('should override existing mappings if provided', () => {
			const customAccentFolder = new AccentFolding({ á: 'aa' });
			expect(customAccentFolder.replace('á')).toBe('aa');
		});

		it('should throw TypeError if newMap is not an object', () => {
			expect(() => new AccentFolding(123)).toThrow(TypeError);
			expect(() => new AccentFolding(123)).toThrow('newMap must be an object');
		});
	});
});
