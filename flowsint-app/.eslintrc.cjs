module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // TS already checks unused vars/undefined names better than eslint's base rules.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // ~290 pre-existing `any` uses. Real debt, but not a hazard on the level of
    // an unchecked hook — downgrade to visible-not-blocking rather than pretend
    // it's fixed. Tighten to 'error' once the backlog is paid down.
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  settings: {
    react: { version: 'detect' }
  }
}
