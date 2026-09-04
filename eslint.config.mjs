import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Flat config, loaded straight from eslint-config-next 16.
 * The old FlatCompat bridge crashed on this version while normalising the
 * plugin graph, which left the project effectively unlinted.
 */
const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
