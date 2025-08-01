import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
      linkComponents: [{ name: "Link", linkAttribute: ["to"] }],
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
      import: importPlugin,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "_", varsIgnorePattern: "_" }],
      "prettier/prettier": "error",
      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            {
              pattern: "@uniformdev/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@**/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // React-specific
      "react/jsx-uses-react": "off", // для React 17+
      "react/react-in-jsx-scope": "off", // для React 17+
      "react/prop-types": "off", // если используем TS
      "react/self-closing-comp": "error",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  ...compat.extends("eslint-config-prettier"),
];

export default eslintConfig;
