// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { base } from './base.mjs';

/** @type {import('typescript-eslint').ConfigArray} */
export const nestjs = tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  ...base,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);

export default nestjs;
