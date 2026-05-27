// @ts-check
import nestjs from '@crypto-whale-watcher/eslint-config/nestjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...nestjs, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
