import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Füge Node-Umgebungen und -Globals hinzu
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    ignores: [
      "node_modules/",
      "src/archive/",
    ],
  },
];
