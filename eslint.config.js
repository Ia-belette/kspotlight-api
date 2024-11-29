import typescriptParser from "@typescript-eslint/parser";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTypeScript from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["**/node_modules/**", "**/.git/**"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      "@typescript-eslint": eslintPluginTypeScript,
    },
    rules: {
      "prettier/prettier": "error",
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "unknown",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
