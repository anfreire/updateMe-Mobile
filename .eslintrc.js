module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "@react-native",
    "react-native",
    "local-rules",
  ],
  extends: [
    "eslint:recommended",
    "@react-native",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "prettier",
  ],
  env: {
    "react-native/react-native": true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "dot-notation": ["off", { allowPattern: "^translations$" }],
    "react-native/sort-styles": "off",
    "react-native/no-color-literals": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-explicit-any": ["warn"],
    "react-hooks/exhaustive-deps": "off",
    "local-rules/exhaustive-deps": "warn",
  },
};
