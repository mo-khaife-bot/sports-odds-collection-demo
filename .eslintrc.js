module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaFeatures: { jsx: true },
    babelOptions: {
      // "configFile": "babel.config.js" //When linting it only works with absolute path
      // Here starts the configuration
      presets: ["@babel/preset-env", "@babel/preset-react", "react-app"],
      plugins: [],
      // Here ends the configuration
    },
  },
  root: true, // For configuration cascading.
  rules: {},
  settings: {
    react: {
      version: "detect", // Detect react version
    },
  },
};
