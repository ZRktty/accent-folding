import { expect, describe, it, beforeEach } from 'vitest';
import AccentFolding from './accentFolding.js';
import accentMap from './accentMap.json';

describe('AccentFolding', () => {
	let accentFolder;

	beforeEach(() => {
		accentFolder = new AccentFolding();
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

		it('should throw TypeError if wrapTag is not a string', () => {
			expect(() => accentFolder.highlightMatch('test', 'es', 123)).toThrow(
				TypeError
			);
			expect(() => accentFolder.highlightMatch('test', 'es', 123)).toThrow(
				'wrapTag must be a string'
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

		it("should wrap matched fragment with custom tag added in second parameter '<strong>'", () => {
			expect(
				accentFolder.highlightMatch('Fulanilo López', 'lo', 'strong')
			).toEqual('Fulani<strong>lo</strong> <strong>Ló</strong>pez');
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

		it('should handle empty string', () => {
			expect(accentFolder.replace('')).toBe('');
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
