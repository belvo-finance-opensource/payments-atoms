import js from '@eslint/js'
import prettierConfig from '@vue/eslint-config-prettier'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import storybook from 'eslint-plugin-storybook'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginVueScopedCSS from 'eslint-plugin-vue-scoped-css'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  ...eslintPluginVue.configs['flat/strongly-recommended'],
  ...eslintPluginVueScopedCSS.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  ...storybook.configs['flat/recommended'],
  prettierConfig,
  {
    ignores: [
      '.gitignore',
      'coverage',
      'dist',
      'node_modules',
      'public',
      'storybook-static',
      'tests',
      'vue.config.js',
      '**/examples/**'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        myCustomGlobal: 'readonly'
      }
    },
    plugins: {
      'unused-imports': unusedImports,
      'no-only-tests': noOnlyTests
    },
    rules: {
      'vue/no-unused-properties': [
        'warn',
        {
          groups: ['props', 'data', 'computed', 'methods'],
          deepData: false,
          ignorePublicMembers: false
        }
      ],
      'vue-scoped-css/enforce-style-type': 'off',
      'vue-scoped-css/no-parsing-error': 'off',
      'vue-scoped-css/no-unused-selector': 'error',
      'vue/no-setup-props-destructure': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-only-tests/no-only-tests': 'error',
      'no-return-assign': ['error', 'always'],
      '@typescript-eslint/prefer-ts-expect-error': 'error'
    },
    files: [
      '**/*.vue',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mt'
    ]
  }
]
