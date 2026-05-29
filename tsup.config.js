import { defineConfig } from 'tsup';

export default defineConfig([
	{
		entry: { index: 'src/accentFolding.js' },
		format: ['esm'],
		outDir: 'dist/esm',
		clean: true,
	},
	{
		entry: { index: 'src/accentFolding.js' },
		format: ['cjs'],
		outDir: 'dist/cjs',
		clean: true,
		footer: {
			js: 'var _d = module.exports.default; module.exports = _d; module.exports.default = _d;',
		},
	},
]);
