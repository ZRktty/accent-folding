import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
	},
	pluginJs.configs.recommended,
	eslintConfigPrettier,
	{
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
	{
		ignores: ['dist/', 'demo/dist/', '.idea', 'coverage/'],
	},
];
