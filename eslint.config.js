import js from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginNode from "eslint-plugin-node";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    /**
     * External plugin to power up eslint base feature
     */
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      node: pluginNode,
      import: pluginImport
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      /**
       * Node.js and ES6 import rules
       */
      "node/no-unsupported-features/es-syntax": "off",
      "node/no-extraneous-import": "error",
      "import/first": "error",
      "import/no-duplicates": "error",

      /**
       * General style and best practices for javascript
       */
      quotes: ["error", "double", { avoidEscape: true }],
      curly: ["error", "all"],
      camelcase: "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"]
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"]
        },
        {
          selector: "variable",
          format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow"
        },
        {
          selector: "parameter",
          format: ["camelCase", "snake_case"],
          leadingUnderscore: "allow",
          filter: {
            regex: "^_$",
            match: false
          }
        },
        {
          selector: "parameter",
          format: null,
          filter: {
            regex: "^_$",
            match: true
          }
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
          leadingUnderscore: "allow"
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase"]
        },
        {
          selector: "objectLiteralProperty",
          format: null
        },
        {
          selector: ["property"],
          modifiers: ["destructured"],
          format: null
        }
      ],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "no-console": "error",
      "prefer-const": "error",
      "no-trailing-spaces": "error",
      "max-len": ["off", { code: 200 }],
      "object-curly-spacing": ["error", "always"],
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      "no-extra-boolean-cast": "error",

      /**
       * Additional rules for better code quality.
       */
      "no-shadow": "error",
      "require-await": "error",
      "no-return-await": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-use-before-define": ["error", { functions: false, classes: true }]
    }
  }
);
