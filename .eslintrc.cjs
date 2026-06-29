module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: false
  },
  env: { browser: true, node: true, es2021: true },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    }
  },
  rules: {
    // React 17+ 不需要显式 import React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // TS 项目里 import 顺序警告噪音太大，关闭
    'import/order': 'off',
    'import/no-unresolved': 'off',
    // @ts-ignore 在 #ifdef 块里常用，警告一下
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }]
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'cloudfunctions/**',
    'config/**',
    '*.config.js',
    'jest.config.js',
    'babel.config.js',
    'src/global.d.ts'
  ]
};
