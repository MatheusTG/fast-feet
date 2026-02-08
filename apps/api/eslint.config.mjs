import baseConfig from '@fast-feet/config/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...baseConfig,
  ...tseslint.configs.recommended,
    {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          "./apps/api/tsconfig.json",
          "./packages/config/tsconfig.json",
        ],
        tsconfigRootDir: path.resolve(__dirname),
        sourceType: "module",
      },
    },
  },
]);
