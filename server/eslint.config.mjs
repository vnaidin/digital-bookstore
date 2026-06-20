import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // node builtins
            ['^node:'],
            // NestJS and other external packages
            ['^@nestjs/', '^@prisma/', '^[a-z]'],
            // internal @ alias
            ['^@/'],
            // relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
