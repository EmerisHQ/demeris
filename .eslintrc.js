require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    /**
     * Typescript naming conventions
     * Would like to turn this on at some moment, but right now it's causing too much noise
     */

    '@typescript-eslint/naming-convention': ['warn', { selector: 'variableLike', format: ['camelCase'] }],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
    ],

    /**
     * Max Lines + Max Lines per function.
     * Would like to turn this on at some moment, but right now it's causing too much noise
     */

    'max-lines': [2, { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': [2, { max: 50, skipBlankLines: true, skipComments: true }],

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/component-api-style': ['warn', ['script-setup']],
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['apexchart', 'i18n-n', 'i18n-t', 'metainfo', 'router-link', 'router-view', 'tippy'],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        printWidth: 120,
        endOfLine: 'auto',
        useTabs: false,
        bracketSameLine: false,
      },
    ],
    'vue/no-static-inline-styles': [
      'warn',
      {
        allowBinding: false,
      },
    ],
    'vue/no-reserved-component-names': 'off',
  },
  overrides: [
    {
      files: ['**/src/**/*.spec.{j,t}s?(x)'],
    },
  ],
};
