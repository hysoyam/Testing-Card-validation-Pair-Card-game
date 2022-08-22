module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },

  plugins: ["prettier", "jest", "cypress"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "prettier",
    "plugin:cypress/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-var": "error",
    "prettier/prettier": "error",
  },
};
