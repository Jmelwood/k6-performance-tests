// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,js,cjs,mjs}'],
    ignores: ['eslint.config.js', '.prettierrc.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: 'tsconfig.json'
      }
    }
  },
  prettier
);
