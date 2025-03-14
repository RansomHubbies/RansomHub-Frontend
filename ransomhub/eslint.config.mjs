import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Ignore unused variables
      "react-hooks/exhaustive-deps": "warn", // Show warning but don't fail build
      "@next/next/no-img-element": "off", // Allow <img> tag usage
      "react/no-unescaped-entities": "off", // Disable apostrophe escaping warning
    },
  },
];

export default eslintConfig;
