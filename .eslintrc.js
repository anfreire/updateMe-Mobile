module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['local-rules'],
  rules: {
    'dot-notation': ['off', {allowPattern: '^translations$'}],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    'react-hooks/exhaustive-deps': 'off',
    'local-rules/exhaustive-deps': 'warn',
  },
};
