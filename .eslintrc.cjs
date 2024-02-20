module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['eslint-plugin-unused-imports', 'no-only-tests'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue-scoped-css/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:storybook/recommended'
  ],
  ignorePatterns: ['examples/**/*'],
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
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
